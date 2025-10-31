// مولد Google Merchant Feed المحسّن والمُصلح - متجر هدايا الإمارات
// يحل مشكلة التصنيف الخاطئ للعطور والساعات

// إعدادات المتجر الأساسية
const STORE_CONFIG = {
    name: 'متجر هدايا الإمارات',
    domain: 'https://emirates-gifts.arabsad.com',
    currency: 'AED',
    country: 'AE',
    language: 'ar',
    brand: 'Emirates Gifts',
    gtin_prefix: '1234567',
    mpn_prefix: 'EG'
};

// فئات المنتجات بمعايير Google مع تصنيف دقيق
const GOOGLE_CATEGORIES = {
    'perfume': {
        google_category: 'Health & Beauty > Personal Care > Cosmetics > Fragrance',
        product_type: 'عطور فاخرة',
        condition: 'new',
        age_group: 'adult',
        gender: 'unisex'
    },
    'watch': {
        google_category: 'Apparel & Accessories > Jewelry > Watches',
        product_type: 'ساعات فاخرة',
        condition: 'new', 
        age_group: 'adult',
        gender: 'unisex'
    },
    'gift': {
        google_category: 'Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts',
        product_type: 'هدايا مميزة',
        condition: 'new',
        age_group: 'adult', 
        gender: 'unisex'
    }
};

// كلمات مفتاحية دقيقة لتصنيف العطور
const PERFUME_KEYWORDS = [
    'عطر', 'عطور', 'perfume', 'fragrance', 'cologne', 'eau', 'scent',
    'chanel', 'dior', 'versace', 'tom ford', 'gucci', 'ysl', 
    'saint laurent', 'hermes', 'kayali', 'penhaligons', 'xerjoff',
    'marly', 'delina', 'oriana', 'safanad', 'vanilla', 'oud', 'دخون',
    'فواحة', 'عبق', 'عبير', 'أريج', 'عبقري', 'مسك'
];

// كلمات مفتاحية دقيقة لتصنيف الساعات
const WATCH_KEYWORDS = [
    'ساعة', 'ساعات', 'watch', 'watches', 'timepiece',
    'rolex', 'omega', 'patek philippe', 'audemars piguet', 'cartier',
    'breitling', 'submariner', 'datejust', 'daytona', 'gmt',
    'اوميغا', 'رولكس', 'باتيك', 'كارتييه', 'بريتلينغ',
    'يخت ماستر', 'ديت جاست', 'دايتونا', 'سواتش', 'اويستر',
    'كرونوغراف', 'automatic', 'كوبي', 'high quality', 'copy'
];

// دالة تصنيف دقيقة للمنتجات حسب مصدر البيانات
function classifyProduct(product, dataSource) {
    // إذا كان من ملف العطور - أعطي أولوية للعطور
    if (dataSource === 'perfumes') {
        return 'perfume';
    }
    
    // إذا كان من ملف الساعات - أعطي أولوية للساعات
    if (dataSource === 'watches') {
        return 'watch';
    }
    
    // تصنيف احتياطي حسب النص
    const title = (product.title || '').toLowerCase();
    
    // فحص كلمات الساعات أولاً (لأن بعض العطور قد تحتوي على كلمات مشتركة)
    const watchScore = WATCH_KEYWORDS.reduce((score, keyword) => {
        return title.includes(keyword.toLowerCase()) ? score + 1 : score;
    }, 0);
    
    // فحص كلمات العطور
    const perfumeScore = PERFUME_KEYWORDS.reduce((score, keyword) => {
        return title.includes(keyword.toLowerCase()) ? score + 1 : score;
    }, 0);
    
    // قرار التصنيف حسب النقاط
    if (watchScore > perfumeScore && watchScore > 0) {
        return 'watch';
    } else if (perfumeScore > 0) {
        return 'perfume';
    }
    
    return 'gift'; // افتراضي
}

// دالة إنشاء GTIN موحد
function generateGTIN(productId, category) {
    const categoryCode = category === 'perfume' ? '00' : category === 'watch' ? '10' : '20';
    const base = STORE_CONFIG.gtin_prefix + categoryCode;
    const paddedId = String(productId).padStart(4, '0');
    
    const code = base + paddedId;
    let sum = 0;
    for (let i = 0; i < code.length; i++) {
        const digit = parseInt(code[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return code + checkDigit;
}

// دالة إنشاء MPN موحد
function generateMPN(productId, title, category) {
    const categoryPrefix = category === 'perfume' ? 'PERF' : 
                          category === 'watch' ? 'WATCH' : 'GIFT';
    
    const sanitizedTitle = title
        .replace(/[^\u0600-\u06FF\w\s]/g, '')
        .replace(/\s+/g, '')
        .substring(0, 8);
    
    return `${STORE_CONFIG.mpn_prefix}-${categoryPrefix}-${sanitizedTitle}-${productId}`;
}

// دالة تنظيف وتحسين النصوص
function sanitizeText(text, maxLength = 150) {
    if (!text) return '';
    
    return text
        .replace(/[<>"&]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, maxLength);
}

// دالة إنشاء وصف مفصل للمنتج
function generateProductDescription(product, category) {
    const categoryText = category === 'perfume' ? 'عطور فاخرة' : 
                        category === 'watch' ? 'ساعات أنيقة' : 'هدايا مميزة';
    
    const baseDescription = `${product.title} - ${categoryText} عالية الجودة من متجر هدايا الإمارات`;
    
    if (product.description && product.description !== product.title) {
        return sanitizeText(`${baseDescription}. ${product.description}`, 500);
    }
    
    // إضافة وصف تلقائي حسب الفئة
    const additionalInfo = category === 'perfume' 
        ? ' مع توصيل مجاني في جميع إمارات الدولة. عطور أصلية بأفضل الأسعار.'
        : category === 'watch'
        ? ' مع توصيل مجاني في جميع إمارات الدولة. ساعات عالية الجودة بضمان الجودة.'
        : ' مع توصيل مجاني في جميع إمارات الدولة. هدايا مثالية لجميع المناسبات.';
    
    return sanitizeText(baseDescription + additionalInfo, 500);
}

// دالة إنشاء XML لمنتج واحد
function createProductXML(product, index, dataSource) {
    const category = classifyProduct(product, dataSource);
    const categoryConfig = GOOGLE_CATEGORIES[category];
    
    const gtin = generateGTIN(product.id || index, category);
    const mpn = generateMPN(product.id || index, product.title, category);
    
    // تنظيف البيانات
    const title = sanitizeText(product.title);
    const description = generateProductDescription(product, category);
    const price = parseFloat(product.sale_price || product.price || '0');
    const originalPrice = parseFloat(product.price || '0');
    
    // التأكد من صحة السعر
    if (price <= 0) {
        console.warn(`تحذير: سعر غير صحيح للمنتج ${title}`);
        return ''; // تخطي المنتج إذا كان السعر غير صحيح
    }
    
    // إنشاء URL المنتج
    const productSlug = title
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
    
    const productId = product.id || `${dataSource.toUpperCase()}_${index}`;
    const productUrl = `${STORE_CONFIG.domain}/products/${productSlug}-${productId}.html`;
    const imageUrl = product.image_link || '';
    
    // تحديد علامة التخفيض
    const hasSale = originalPrice > price && originalPrice > 0;
    
    return `
    <item>
        <g:id>${productId}</g:id>
        <title><![CDATA[${title}]]></title>
        <description><![CDATA[${description}]]></description>
        <link>${productUrl}</link>
        <image_link>${imageUrl}</image_link>
        <condition>${categoryConfig.condition}</condition>
        <availability>in_stock</availability>
        <price>${price} ${STORE_CONFIG.currency}</price>
        ${hasSale ? `<sale_price>${price} ${STORE_CONFIG.currency}</sale_price>` : ''}
        <brand>${STORE_CONFIG.brand}</brand>
        <gtin>${gtin}</gtin>
        <mpn>${mpn}</mpn>
        <google_product_category>${categoryConfig.google_category}</google_product_category>
        <product_type>${categoryConfig.product_type}</product_type>
        <age_group>${categoryConfig.age_group}</age_group>
        <gender>${categoryConfig.gender}</gender>
        <shipping>
            <g:country>${STORE_CONFIG.country}</g:country>
            <g:service>شحن مجاني</g:service>
            <g:price>0 ${STORE_CONFIG.currency}</g:price>
        </shipping>
        <shipping_weight>0.5 kg</shipping_weight>
        <tax>
            <g:country>${STORE_CONFIG.country}</g:country>
            <g:rate>0</g:rate>
        </tax>
    </item>`;
}

// دالة إنشاء Google Merchant Feed كامل ومحسّن
async function generateFixedMerchantFeed() {
    try {
        console.log('🛍 بدء إنشاء Google Merchant Feed المُصلح...');
        
        // تحميل بيانات المنتجات مع تحديد المصدر
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('./data/otor.json').catch(() => ({ ok: false, json: () => [] })),
            fetch('./data/sa3at.json').catch(() => ({ ok: false, json: () => [] }))
        ]);
        
        const perfumes = perfumesResponse.ok ? await perfumesResponse.json() : [];
        const watches = watchesResponse.ok ? await watchesResponse.json() : [];
        
        console.log(`📦 تم تحميل ${perfumes.length} عطر و ${watches.length} ساعة`);
        
        // إنشاء XML header
        const currentDate = new Date().toUTCString();
        let feedXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title><![CDATA[${STORE_CONFIG.name}]]></title>
        <link>${STORE_CONFIG.domain}</link>
        <description><![CDATA[متجر إلكتروني متخصص في بيع العطور والساعات الفاخرة في دولة الإمارات العربية المتحدة مع توصيل مجاني]]></description>
        <language>${STORE_CONFIG.language}-${STORE_CONFIG.country}</language>
        <lastBuildDate>${currentDate}</lastBuildDate>
        <generator>Emirates Gifts Store - Merchant Feed Generator v2.1 - Fixed</generator>`;
        
        let productsAdded = 0;
        let productsSkipped = 0;
        
        // إضافة العطور (مع تحديد المصدر)
        perfumes.forEach((product, index) => {
            const productXML = createProductXML(product, index + 1, 'perfumes');
            if (productXML.trim()) {
                feedXML += productXML;
                productsAdded++;
            } else {
                productsSkipped++;
            }
        });
        
        // إضافة الساعات (مع تحديد المصدر)
        watches.forEach((product, index) => {
            const productXML = createProductXML(product, index + 1, 'watches');
            if (productXML.trim()) {
                feedXML += productXML;
                productsAdded++;
            } else {
                productsSkipped++;
            }
        });
        
        // إغلاق XML
        feedXML += `
    </channel>
</rss>`;
        
        console.log(`✅ تم إنشاء Feed مُصلح لـ ${productsAdded} منتج`);
        if (productsSkipped > 0) {
            console.warn(`⚠️ تم تخطي ${productsSkipped} منتج بسبب بيانات غير صحيحة`);
        }
        
        return feedXML;
        
    } catch (error) {
        console.error('❌ خطأ في إنشاء Merchant Feed المُصلح:', error);
        return null;
    }
}

// دالة التحقق المتقدم من صحة Feed
function validateFixedFeed(feedXML) {
    const issues = [];
    const warnings = [];
    
    // فحص الهيكل الأساسي
    if (!feedXML.includes('<rss')) {
        issues.push('❌ هيكل RSS غير صحيح');
    }
    
    if (!feedXML.includes('xmlns:g="http://base.google.com/ns/1.0"')) {
        issues.push('❌ مساحة أسماء Google مفقودة');
    }
    
    // فحص العناصر المطلوبة
    const requiredFields = ['g:id', 'title', 'description', 'link', 'image_link', 
                           'condition', 'availability', 'price', 'gtin', 'mpn', 
                           'brand', 'google_product_category'];
    
    requiredFields.forEach(field => {
        if (!feedXML.includes(field)) {
            issues.push(`❌ حقل مطلوب مفقود: ${field}`);
        }
    });
    
    // فحص التصنيفات
    const perfumeCategory = 'Health & Beauty > Personal Care > Cosmetics > Fragrance';
    const watchCategory = 'Apparel & Accessories > Jewelry > Watches';
    
    const hasPerfumes = feedXML.includes(perfumeCategory);
    const hasWatches = feedXML.includes(watchCategory);
    
    if (hasPerfumes) {
        console.log('✅ تم العثور على تصنيف العطور الصحيح');
    }
    
    if (hasWatches) {
        console.log('✅ تم العثور على تصنيف الساعات الصحيح');
    }
    
    // فحص عدد المنتجات
    const productCount = (feedXML.match(/<item>/g) || []).length;
    if (productCount === 0) {
        issues.push('❌ لا توجد منتجات في Feed');
    } else {
        console.log(`📊 إجمالي المنتجات: ${productCount}`);
    }
    
    // فحص الأسعار
    const priceMatches = feedXML.match(/<price>([^<]+)<\/price>/g) || [];
    const invalidPrices = priceMatches.filter(price => {
        const value = parseFloat(price.replace(/<\/?price>/g, ''));
        return isNaN(value) || value <= 0;
    });
    
    if (invalidPrices.length > 0) {
        warnings.push(`⚠️ ${invalidPrices.length} منتج بأسعار غير صحيحة`);
    }
    
    // عرض النتائج
    if (issues.length === 0) {
        console.log('✅ Merchant Feed صحيح ومُصلح وجاهز للرفع إلى Google');
        if (warnings.length > 0) {
            console.warn('تحذيرات:', warnings);
        }
        return true;
    } else {
        console.error('❌ مشاكل في Feed:', issues);
        return false;
    }
}

// دالة حفظ Feed المُصلح
async function saveFixedMerchantFeed() {
    const feedXML = await generateFixedMerchantFeed();
    
    if (feedXML) {
        const isValid = validateFixedFeed(feedXML);
        
        if (isValid) {
            // حفظ الملف
            const blob = new Blob([feedXML], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merchant-feed-fixed.xml';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ تم حفظ Google Merchant Feed المُصلح بنجاح');
            
            // عرض إحصائيات التصنيف
            displayCategoryStats(feedXML);
            
            return true;
        }
    }
    
    return false;
}

// دالة عرض إحصائيات التصنيف
function displayCategoryStats(feedXML) {
    const perfumeCount = (feedXML.match(/Health & Beauty > Personal Care > Cosmetics > Fragrance/g) || []).length;
    const watchCount = (feedXML.match(/Apparel & Accessories > Jewelry > Watches/g) || []).length;
    const giftCount = (feedXML.match(/Arts & Entertainment > Hobbies & Creative Arts/g) || []).length;
    
    console.log('📊 إحصائيات التصنيف:');
    console.log(`🌸 العطور: ${perfumeCount} منتج`);
    console.log(`⌚ الساعات: ${watchCount} منتج`);
    console.log(`🎁 الهدايا: ${giftCount} منتج`);
    
    // إنشاء لوحة إحصائيات بصرية
    showStatsPanel(perfumeCount, watchCount, giftCount);
}

// دالة عرض لوحة الإحصائيات
function showStatsPanel(perfumes, watches, gifts) {
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: white; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10001; font-family: Arial, sans-serif;">
            <h3 style="color: #2c3e50; margin-bottom: 15px; text-align: center;">📊 تصنيف المنتجات المُصلح</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">🌸</span>
                    <span>العطور: <strong>${perfumes}</strong></span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">⌚</span>
                    <span>الساعات: <strong>${watches}</strong></span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">🎁</span>
                    <span>الهدايا: <strong>${gifts}</strong></span>
                </div>
                <div style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;">
                    <strong>المجموع: ${perfumes + watches + gifts} منتج</strong>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 15px;">✖ إغلاق</button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // إزالة تلقائية بعد 30 ثانية
    setTimeout(() => {
        if (panel.parentElement) {
            panel.remove();
        }
    }, 30000);
}

// دالة تشغيل الإصلاح التلقائي
function autoFixGoogleMerchant() {
    console.log('🔧 بدء إصلاح Google Merchant Feed تلقائياً...');
    
    saveFixedMerchantFeed().then(success => {
        if (success) {
            console.log('🎉 تم إصلاح جميع مشاكل Google Merchant Center بنجاح!');
        } else {
            console.error('❌ فشل في إصلاح المشاكل');
        }
    });
}

// تصدير الوظائف
window.FixedGoogleMerchantTools = {
    generateFixedMerchantFeed,
    validateFixedFeed,
    saveFixedMerchantFeed,
    autoFixGoogleMerchant,
    classifyProduct,
    displayCategoryStats
};

// رسالة في الكونسول
console.log('%c🛍 مولد Google Merchant Feed المُصلح جاهز للاستخدام!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
console.log('%cاستخدم: FixedGoogleMerchantTools.autoFixGoogleMerchant() لبدء الإصلاح', 'color: #2196F3;');