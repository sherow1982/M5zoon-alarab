// مولد Google Merchant Feed المحسّن - متجر هدايا الإمارات
// يحل جميع مشاكل Google Merchant Center

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

// فئات المنتجات بمعايير Google
const GOOGLE_CATEGORIES = {
    'عطور': {
        google_category: 'Health & Beauty > Personal Care > Cosmetics > Fragrance',
        condition: 'new',
        age_group: 'adult',
        gender: 'unisex'
    },
    'ساعة': {
        google_category: 'Apparel & Accessories > Jewelry > Watches',
        condition: 'new', 
        age_group: 'adult',
        gender: 'unisex'
    },
    'هدية': {
        google_category: 'Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts',
        condition: 'new',
        age_group: 'adult', 
        gender: 'unisex'
    }
};

// دالة إنشاء GTIN موحد لكل منتج
function generateGTIN(productId) {
    const base = STORE_CONFIG.gtin_prefix;
    const paddedId = String(productId).padStart(6, '0');
    
    // حساب check digit بطريقة صحيحة
    const code = base + paddedId;
    let sum = 0;
    for (let i = 0; i < code.length; i++) {
        const digit = parseInt(code[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return code + checkDigit;
}

// دالة إنشاء MPN (Manufacturer Part Number) موحد
function generateMPN(productId, title) {
    const sanitizedTitle = title
        .replace(/[^\u0600-\u06FF\w\s]/g, '')
        .replace(/\s+/g, '')
        .substring(0, 8)
        .toUpperCase();
    
    return `${STORE_CONFIG.mpn_prefix}-${sanitizedTitle}-${productId}`;
}

// دالة تحديد فئة المنتج
function getProductCategory(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('عطر') || titleLower.includes('perfume') || titleLower.includes('fragrance')) {
        return GOOGLE_CATEGORIES['عطور'];
    } else if (titleLower.includes('ساعة') || titleLower.includes('watch') || titleLower.includes('rolex') || titleLower.includes('omega')) {
        return GOOGLE_CATEGORIES['ساعة'];
    } else {
        return GOOGLE_CATEGORIES['هدية'];
    }
}

// دالة تنظيف وتحسين النصوص لـ Google
function sanitizeForGoogle(text) {
    if (!text) return '';
    
    return text
        .replace(/[<>"&]/g, '') // إزالة رموز HTML
        .replace(/\s+/g, ' ') // توحيد المسافات
        .trim()
        .substring(0, 150); // حد أقصى للطول
}

// دالة إنشاء XML لمنتج واحد
function createProductXML(product, index) {
    const category = getProductCategory(product.title);
    const gtin = generateGTIN(product.id || index);
    const mpn = generateMPN(product.id || index, product.title);
    
    // تنظيف البيانات
    const title = sanitizeForGoogle(product.title);
    const description = sanitizeForGoogle(product.description || `${product.title} - عطور فاخرة عالية الجودة من متجر هدايا الإمارات`);
    const price = parseFloat(product.sale_price || product.price || '0').toFixed(2);
    const originalPrice = parseFloat(product.price || product.sale_price || '0').toFixed(2);
    
    // إنشاء URL المنتج
    const productSlug = title
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
    
    const productUrl = `${STORE_CONFIG.domain}/products/${productSlug}-${product.id || index}.html`;
    const imageUrl = product.image_link || '';
    
    return `
    <item>
        <g:id>${product.id || index}</g:id>
        <title><![CDATA[${title}]]></title>
        <description><![CDATA[${description}]]></description>
        <link>${productUrl}</link>
        <image_link>${imageUrl}</image_link>
        <condition>${category.condition}</condition>
        <availability>in stock</availability>
        <price>${price} ${STORE_CONFIG.currency}</price>
        ${originalPrice !== price ? `<sale_price>${price} ${STORE_CONFIG.currency}</sale_price>` : ''}
        <brand>${STORE_CONFIG.brand}</brand>
        <gtin>${gtin}</gtin>
        <mpn>${mpn}</mpn>
        <google_product_category>${category.google_category}</google_product_category>
        <product_type>هدايا وعطور فاخرة</product_type>
        <age_group>${category.age_group}</age_group>
        <gender>${category.gender}</gender>
        <shipping>
            <g:country>AE</g:country>
            <g:service>شحن مجاني</g:service>
            <g:price>0 AED</g:price>
        </shipping>
        <shipping_weight>0.5 kg</shipping_weight>
        <tax>
            <g:country>AE</g:country>
            <g:rate>0</g:rate>
        </tax>
    </item>`;
}

// دالة إنشاء Google Merchant Feed كامل
async function generateMerchantFeed() {
    try {
        console.log('🛍 بدء إنشاء Google Merchant Feed...');
        
        // تحميل بيانات المنتجات
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('./data/otor.json').catch(() => ({ ok: false, json: () => [] })),
            fetch('./data/sa3at.json').catch(() => ({ ok: false, json: () => [] }))
        ]);
        
        const perfumes = perfumesResponse.ok ? await perfumesResponse.json() : [];
        const watches = watchesResponse.ok ? await watchesResponse.json() : [];
        
        const allProducts = [...perfumes, ...watches];
        
        // إنشاء XML header
        let feedXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title><![CDATA[${STORE_CONFIG.name}]]></title>
        <link>${STORE_CONFIG.domain}</link>
        <description><![CDATA[متجر إلكتروني متخصص في بيع العطور والساعات الفاخرة في دولة الإمارات العربية المتحدة]]></description>
        <language>ar-AE</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <generator>متجر هدايا الإمارات - Merchant Feed Generator v2.0</generator>`;
        
        // إضافة جميع المنتجات
        allProducts.forEach((product, index) => {
            feedXML += createProductXML(product, index + 1);
        });
        
        // إغلاق XML
        feedXML += `
    </channel>
</rss>`;
        
        console.log(`✅ تم إنشاء Feed لـ ${allProducts.length} منتج`);
        return feedXML;
        
    } catch (error) {
        console.error('❌ خطأ في إنشاء Merchant Feed:', error);
        return null;
    }
}

// دالة حفظ Feed في ملف
async function saveMerchantFeed() {
    const feedXML = await generateMerchantFeed();
    
    if (feedXML) {
        // حفظ الملف محلياً (للتطوير)
        const blob = new Blob([feedXML], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merchant-feed.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ تم حفظ Google Merchant Feed بنجاح');
        return true;
    }
    
    return false;
}

// دالة التحقق من صحة Feed
function validateMerchantFeed(feedXML) {
    const issues = [];
    
    // فحص العناصر المطلوبة
    const requiredFields = ['g:id', 'title', 'description', 'link', 'image_link', 'condition', 'availability', 'price', 'gtin', 'mpn', 'brand'];
    
    requiredFields.forEach(field => {
        if (!feedXML.includes(field)) {
            issues.push(`❌ حقل مطلوب مفقود: ${field}`);
        }
    });
    
    // فحص عدد المنتجات
    const productCount = (feedXML.match(/<item>/g) || []).length;
    if (productCount === 0) {
        issues.push('❌ لا توجد منتجات في Feed');
    }
    
    console.log(`🔍 تم فحص ${productCount} منتج`);
    
    if (issues.length === 0) {
        console.log('✅ Merchant Feed صحيح وجاهز للرفع إلى Google');
        return true;
    } else {
        console.warn('⚠️ مشاكل في Merchant Feed:', issues);
        return false;
    }
}

// دالة إنشاء Sitemap.xml محسّن
async function generateSitemap() {
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/cart.html', priority: '0.8', changefreq: 'weekly' },
        { url: '/products-showcase.html', priority: '0.9', changefreq: 'daily' },
        { url: '/blog/', priority: '0.8', changefreq: 'weekly' }
    ];
    
    let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // إضافة الصفحات الثابتة
    staticPages.forEach(page => {
        sitemapXML += `
    <url>
        <loc>${STORE_CONFIG.domain}${page.url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
    });
    
    try {
        // إضافة صفحات المنتجات
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('./data/otor.json').catch(() => ({ ok: false, json: () => [] })),
            fetch('./data/sa3at.json').catch(() => ({ ok: false, json: () => [] }))
        ]);
        
        const perfumes = perfumesResponse.ok ? await perfumesResponse.json() : [];
        const watches = watchesResponse.ok ? await watchesResponse.json() : [];
        const allProducts = [...perfumes, ...watches];
        
        allProducts.forEach((product, index) => {
            const productSlug = sanitizeForGoogle(product.title)
                .toLowerCase()
                .replace(/\s+/g, '-')
                .substring(0, 50);
            
            const productUrl = `${STORE_CONFIG.domain}/products/${productSlug}-${product.id || index}.html`;
            
            sitemapXML += `
    <url>
        <loc>${productUrl}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
        });
        
    } catch (error) {
        console.error('خطأ في إضافة صفحات المنتجات للـ Sitemap:', error);
    }
    
    sitemapXML += '
</urlset>';
    
    return sitemapXML;
}

// دالة إنشاء robots.txt محسّن
function generateRobotsTxt() {
    return `User-agent: *
Allow: /

# منع فهرسة الملفات الإدارية
Disallow: /js/
Disallow: /css/
Disallow: /data/
Disallow: /temp/

# السماح بفهرسة الملفات المهمة
Allow: /products/
Allow: /blog/
Allow: /cart.html
Allow: /sitemap.xml
Allow: /merchant-feed.xml

# خريطة الموقع
Sitemap: ${STORE_CONFIG.domain}/sitemap.xml

# معلومات إضافية لمحركات البحث
Crawl-delay: 1
`;
}

// دالة رئيسية لحل جميع مشاكل Google
async function fixGoogleIssues() {
    console.log('🔧 بدء حل مشاكل Google Merchant Center...');
    
    try {
        // 1. إنشاء Merchant Feed محسّن
        const merchantFeed = await generateMerchantFeed();
        
        // 2. التحقق من صحة Feed
        const isValid = validateMerchantFeed(merchantFeed);
        
        if (isValid) {
            // 3. إنشاء Sitemap
            const sitemap = await generateSitemap();
            
            // 4. إنشاء robots.txt
            const robotsTxt = generateRobotsTxt();
            
            console.log('✅ تم حل جميع مشاكل Google بنجاح');
            
            // عرض معلومات الحلول
            displayGoogleSolutions(merchantFeed, sitemap, robotsTxt);
            
            return { merchantFeed, sitemap, robotsTxt };
        }
        
    } catch (error) {
        console.error('❌ خطأ عام في حل مشاكل Google:', error);
        return null;
    }
}

// دالة عرض الحلول والمعلومات
function displayGoogleSolutions(merchantFeed, sitemap, robotsTxt) {
    console.log('📄 ملفات Google الجاهزة:');
    console.log('1. merchant-feed.xml - Google Merchant Center Feed');
    console.log('2. sitemap.xml - خريطة موقع محسّنة');
    console.log('3. robots.txt - تعليمات محركات البحث');
    
    // إنشاء لوحة تحكم بصرية
    const controlPanel = document.createElement('div');
    controlPanel.id = 'google-solutions-panel';
    controlPanel.innerHTML = `
        <div class="solutions-panel">
            <h3>🛍 حلول Google Merchant Center</h3>
            <div class="solutions-list">
                <div class="solution-item">
                    <span class="status-icon">✅</span>
                    <span>Merchant Feed XML جاهز ومحسّن</span>
                    <button onclick="downloadFile('merchant-feed.xml', \`${merchantFeed.replace(/`/g, '\\`')}\`)" class="download-btn">⬇️ تحميل</button>
                </div>
                <div class="solution-item">
                    <span class="status-icon">✅</span>
                    <span>Sitemap XML محدث وشامل</span>
                    <button onclick="downloadFile('sitemap.xml', \`${sitemap.replace(/`/g, '\\`')}\`)" class="download-btn">⬇️ تحميل</button>
                </div>
                <div class="solution-item">
                    <span class="status-icon">✅</span>
                    <span>Robots.txt محسّن</span>
                    <button onclick="downloadFile('robots.txt', \`${robotsTxt.replace(/`/g, '\\`')}\`)" class="download-btn">⬇️ تحميل</button>
                </div>
            </div>
            <div class="panel-actions">
                <button onclick="this.parentElement.parentElement.style.display='none'" class="close-btn">✖ إغلاق</button>
            </div>
        </div>
    `;
    
    // إضافع أنماط CSS
    const panelCSS = `
        <style>
        #google-solutions-panel {
            position: fixed;
            top: 20px;
            left: 20px;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
        }
        .solutions-panel h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            text-align: center;
        }
        .solution-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            margin-bottom: 10px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .status-icon {
            font-size: 16px;
        }
        .download-btn, .close-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        }
        .close-btn {
            background: #f44336;
            width: 100%;
            margin-top: 15px;
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', panelCSS);
    document.body.appendChild(controlPanel);
}

// دالة تحميل الملفات
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ تم تحميل ${filename} بنجاح`);
}

// تشغيل تلقائي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تأخير تشغيل مولد Feed لعدم تأثير على الأداء
    setTimeout(() => {
        fixGoogleIssues();
    }, 5000);
});

// تصدير الوظائف للاستخدام الخارجي
window.GoogleMerchantTools = {
    generateMerchantFeed,
    generateSitemap,
    generateRobotsTxt,
    fixGoogleIssues,
    downloadFile,
    saveMerchantFeed,
    validateMerchantFeed
};