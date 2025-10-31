// نظام تحميل وعرض المنتجات - مصحح بالكامل
// إصلاح مشكلة التداخل: العطور والساعات منفصلة تماماً
// كل منتج يفتح الصفحة الصحيحة له

(function() {
    'use strict';
    
    // متغيرات البيانات الأساسية
    let perfumesData = [];
    let watchesData = [];
    let allProductsData = [];
    let isDataLoaded = false;
    
    // تحميل البيانات مع فصل كامل
    async function loadProductData() {
        if (isDataLoaded) {
            return {
                perfumes: perfumesData,
                watches: watchesData,
                all: allProductsData
            };
        }
        
        try {
            console.log('🔄 تحميل بيانات المنتجات مع الفصل الكامل...');
            
            // تحميل العطور من otor.json
            try {
                const perfumesResponse = await fetch('./data/otor.json');
                if (perfumesResponse.ok) {
                    const rawPerfumes = await perfumesResponse.json();
                    perfumesData = rawPerfumes.map((item, index) => ({
                        ...item,
                        actualId: item.id, // الID الحقيقي
                        displayIndex: index + 1,
                        type: 'PERFUME',
                        category: 'عطور',
                        categoryEn: 'perfume',
                        icon: '🌸',
                        source: 'otor.json',
                        detailsUrl: `./product-details.html?type=perfume&id=${item.id}&source=otor`,
                        isLoaded: true
                    }));
                    console.log(`✅ تحميل ${perfumesData.length} عطر من otor.json`);
                } else {
                    console.error('❌ فشل تحميل ملف العطور');
                }
            } catch (error) {
                console.error('❌ خطأ في تحميل العطور:', error);
            }
            
            // تحميل الساعات من sa3at.json
            try {
                const watchesResponse = await fetch('./data/sa3at.json');
                if (watchesResponse.ok) {
                    const rawWatches = await watchesResponse.json();
                    watchesData = rawWatches.map((item, index) => ({
                        ...item,
                        actualId: item.id, // الID الحقيقي
                        displayIndex: index + 1,
                        type: 'WATCH',
                        category: 'ساعات',
                        categoryEn: 'watch', 
                        icon: '⏰',
                        source: 'sa3at.json',
                        detailsUrl: `./product-details.html?type=watch&id=${item.id}&source=sa3at`,
                        isLoaded: true
                    }));
                    console.log(`✅ تحميل ${watchesData.length} ساعة من sa3at.json`);
                } else {
                    console.error('❌ فشل تحميل ملف الساعات');
                }
            } catch (error) {
                console.error('❌ خطأ في تحميل الساعات:', error);
            }
            
            // دمج البيانات
            allProductsData = [...perfumesData, ...watchesData];
            isDataLoaded = true;
            
            console.log(`🎯 إجمالي تحميل: ${allProductsData.length} منتج`);
            console.log(`🌸 عطور: ${perfumesData.length}`);
            console.log(`⏰ ساعات: ${watchesData.length}`);
            
        } catch (error) {
            console.error('❌ خطأ عام في تحميل البيانات:', error);
        }
        
        return {
            perfumes: perfumesData,
            watches: watchesData,
            all: allProductsData
        };
    }
    
    // إنشاء بطاقة منتج صحيحة
    function createCorrectProductCard(product, index = 0) {
        // التأكد من نوع المنتج
        const isValidProduct = product && product.actualId && product.type;
        if (!isValidProduct) {
            console.error('❌ منتج غير صحيح:', product);
            return '<div class="error-product">خطأ في بيانات المنتج</div>';
        }
        
        // حساب الخصم
        const originalPrice = parseFloat(product.price) || 0;
        const salePrice = parseFloat(product.sale_price) || originalPrice;
        const hasDiscount = originalPrice > salePrice;
        const discountPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
        
        // رابط صحيح للمنتج
        const correctUrl = product.detailsUrl;
        
        // وصف حسب النوع الفعلي
        let description = '';
        let categoryDisplay = '';
        let categoryStyle = '';
        
        if (product.type === 'PERFUME') {
            description = 'عطر فاخر بتركيبة عالية الجودة ورائحة مميزة تدوم طويلاً';
            categoryDisplay = '🌸 عطور';
            categoryStyle = 'background: rgba(255, 182, 193, 0.9); color: #8B0000;';
        } else if (product.type === 'WATCH') {
            description = 'ساعة عالية الجودة بتصميم أنيق ومواصفات احترافية مميزة';
            categoryDisplay = '⏰ ساعات';
            categoryStyle = 'background: rgba(135, 206, 235, 0.9); color: #000080;';
        }
        
        return `
            <div class="product-card correct-product" 
                 data-product-id="${product.actualId}" 
                 data-product-type="${product.type}"
                 data-source-file="${product.source}"
                 data-index="${index}"
                 style="animation-delay: ${index * 0.1}s; cursor: pointer; text-align: center;"
                 onclick="openCorrectProduct('${product.type}', '${product.actualId}', '${product.source}', event)">
                 
                <!-- الصورة -->
                <div class="product-image-container" style="position: relative; overflow: hidden; height: 250px;">
                    <img src="${product.image_link}" 
                         alt="${product.title}" 
                         class="product-image"
                         style="width: 100%; height: 100%; object-fit: cover;"
                         loading="${index < 8 ? 'eager' : 'lazy'}"
                         onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${product.type === 'PERFUME' ? 'عطر' : 'ساعة'}'">
                    
                    <!-- شارة الفئة الصحيحة -->
                    <div class="product-category-badge" 
                         style="position: absolute; top: 10px; left: 10px; padding: 6px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600; z-index: 2; ${categoryStyle}">
                        ${categoryDisplay}
                    </div>
                    
                    <!-- شارة الخصم -->
                    ${hasDiscount ? 
                        `<div class="discount-badge" style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; padding: 6px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600;">خصم ${discountPercent}%</div>` : 
                        `<div class="new-badge" style="position: absolute; top: 10px; right: 10px; background: #27ae60; color: white; padding: 6px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600;">جديد</div>`
                    }
                </div>
                
                <!-- معلومات المنتج -->
                <div class="product-info" style="padding: 20px;">
                    <!-- العنوان -->
                    <h3 class="product-title" style="font-size: 1.2rem; font-weight: 700; color: #2c3e50; margin-bottom: 10px; line-height: 1.4; text-align: center;">
                        <a href="${correctUrl}" 
                           target="_blank" 
                           rel="noopener"
                           onclick="event.stopPropagation(); logProductClick('${product.type}', '${product.actualId}');"
                           style="text-decoration: none; color: inherit;">
                            ${product.title}
                        </a>
                    </h3>
                    
                    <!-- الوصف -->
                    <div class="product-description" style="font-size: 0.85rem; color: #666; margin: 10px 0; line-height: 1.4; text-align: center;">
                        ${description}
                    </div>
                    
                    <!-- السعر -->
                    <div class="product-price" style="text-align: center; margin: 15px 0;">
                        <span class="current-price" style="font-size: 1.4rem; font-weight: 900; color: #27ae60;">${salePrice.toFixed(2)} د.إ</span>
                        ${hasDiscount ? `<span class="original-price" style="font-size: 1rem; color: #e74c3c; text-decoration: line-through; margin-right: 10px;">${originalPrice.toFixed(2)} د.إ</span>` : ''}
                    </div>
                    
                    <!-- التقييمات -->
                    <div class="product-rating" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0; padding: 8px; background: rgba(255, 215, 0, 0.1); border-radius: 8px;">
                        <div class="stars" style="color: #FFD700; font-size: 1rem;">★★★★☆</div>
                        <span class="rating-number" style="font-weight: bold; color: #D4AF37; font-size: 0.9rem;">4.5</span>
                        <span class="reviews-count" style="color: #666; font-size: 0.8rem;">(15)</span>
                        <span class="verified-badge" style="background: #25D366; color: white; padding: 2px 6px; border-radius: 6px; font-size: 0.7rem; font-weight: 600;">✓ موثق</span>
                    </div>
                    
                    <!-- الأزرار -->
                    <div class="product-actions" style="display: flex; justify-content: center; gap: 8px; margin-top: 15px; flex-wrap: wrap;">
                        <!-- إضافة للسلة -->
                        <button class="icon-btn add-cart-btn" 
                                data-product-id="${product.actualId}"
                                data-product-type="${product.type}"
                                onclick="addProductToCartCorrect('${product.type}', '${product.actualId}', event)"
                                title="أضف للسلة"
                                style="width: 42px; height: 42px; border-radius: 50%; background: white; border: 2px solid #ddd; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: #666;">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        
                        <!-- اطلب فوراً -->
                        <button class="icon-btn order-now-btn" 
                                data-product-id="${product.actualId}"
                                data-product-type="${product.type}"
                                onclick="orderProductNowCorrect('${product.type}', '${product.actualId}', event)"
                                title="اطلب فوراً"
                                style="width: 42px; height: 42px; border-radius: 50%; background: #25D366; border: 2px solid #25D366; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: white;">
                            <i class="fas fa-bolt"></i>
                        </button>
                        
                        <!-- واتساب -->
                        <button class="icon-btn whatsapp-btn" 
                                onclick="sendWhatsAppCorrect('${product.type}', '${product.actualId}', event)"
                                title="واتساب"
                                style="width: 42px; height: 42px; border-radius: 50%; background: #25D366; border: 2px solid #25D366; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: white;">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        
                        <!-- تفاصيل -->
                        <button class="icon-btn details-btn" 
                                onclick="openCorrectProduct('${product.type}', '${product.actualId}', '${product.source}', event)"
                                title="التفاصيل"
                                style="width: 42px; height: 42px; border-radius: 50%; background: white; border: 2px solid #007bff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: #007bff;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // عرض المنتجات في الحاوية الصحيحة
    function displayProductsCorrectly(products, containerId, productType) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ لم يتم العثور على الحاوية: ${containerId}`);
            return;
        }
        
        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 15px; opacity: 0.6;"></i>
                    <h3>لا توجد منتجات</h3>
                    <p>لم يتم العثور على منتجات ${productType || ''}</p>
                    <button onclick="location.reload()" class="btn-primary" style="margin-top: 15px;">إعادة المحاولة</button>
                </div>
            `;
            return;
        }
        
        // إنشاء HTML للمنتجات
        const productsHTML = products.map((product, index) => 
            createCorrectProductCard(product, index)
        ).join('');
        
        container.innerHTML = productsHTML;
        
        console.log(`✅ تم عرض ${products.length} ${productType || 'منتج'} في ${containerId}`);
        
        // تحديث عداد السلة
        setTimeout(updateCartCounter, 300);
    }
    
    // تحديث عداد السلة
    function updateCartCounter() {
        try {
            const cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const counters = document.querySelectorAll('.cart-counter, .mobile-cart-counter');
            
            counters.forEach(counter => {
                if (counter) {
                    counter.textContent = totalItems;
                    counter.style.display = totalItems > 0 ? 'flex' : 'none';
                }
            });
        } catch (error) {
            console.error('خطأ في تحديث عداد السلة:', error);
        }
    }
    
    // إضافة منتج للسلة بشكل صحيح
    window.addProductToCartCorrect = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        console.log(`🛒 إضافة للسلة - النوع: ${productType}, الID: ${productId}`);
        
        let product = null;
        
        // البحث في الفئة الصحيحة
        if (productType === 'PERFUME') {
            product = perfumesData.find(p => p.actualId === productId);
        } else if (productType === 'WATCH') {
            product = watchesData.find(p => p.actualId === productId);
        }
        
        if (product) {
            const cartItem = {
                id: product.actualId,
                name: product.title,
                price: parseFloat(product.sale_price),
                image: product.image_link,
                type: product.type,
                category: product.category,
                source: product.source,
                url: product.detailsUrl,
                quantity: 1,
                addedAt: new Date().toISOString()
            };
            
            let cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
            const existingIndex = cart.findIndex(item => item.id === product.actualId);
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
                console.log(`➕ زيادة كمية ${product.title}`);
            } else {
                cart.push(cartItem);
                console.log(`✅ تم إضافة ${product.title} للسلة`);
            }
            
            localStorage.setItem('emirates_shopping_cart', JSON.stringify(cart));
            updateCartCounter();
            showSuccessMessage(`تم إضافة "${product.title}" للسلة!`);
        } else {
            console.error(`❌ لم يتم العثور على المنتج: ${productType} - ${productId}`);
            showErrorMessage('خطأ: لم يتم العثور على المنتج');
        }
    };
    
    // طلب منتج فوراً
    window.orderProductNowCorrect = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        console.log(`⚡ طلب فوري - النوع: ${productType}, الID: ${productId}`);
        
        // أولاً أضف للسلة
        window.addProductToCartCorrect(productType, productId, null);
        
        // ثم انتقل للطلب
        setTimeout(() => {
            window.open('./cart.html', '_blank');
        }, 1000);
    };
    
    // إرسال واتساب صحيح
    window.sendWhatsAppCorrect = function(productType, productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        let product = null;
        
        if (productType === 'PERFUME') {
            product = perfumesData.find(p => p.actualId === productId);
        } else if (productType === 'WATCH') {
            product = watchesData.find(p => p.actualId === productId);
        }
        
        if (product) {
            const message = `مرحباً! أريد طلب هذا المنتج:

${product.icon} ${product.title}
💰 ${parseFloat(product.sale_price).toFixed(2)} درهم
📱 من متجر هدايا الإمارات

أريد معرفة تفاصيل الطلب والتوصيل.`;
            
            const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            console.log(`💬 تم إرسال طلب واتساب: ${product.title}`);
        } else {
            console.error(`❌ منتج غير موجود للواتساب: ${productType} - ${productId}`);
        }
    };
    
    // فتح المنتج الصحيح
    window.openCorrectProduct = function(productType, productId, source, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        let product = null;
        
        if (productType === 'PERFUME') {
            product = perfumesData.find(p => p.actualId === productId);
        } else if (productType === 'WATCH') {
            product = watchesData.find(p => p.actualId === productId);
        }
        
        if (product) {
            const correctUrl = product.detailsUrl;
            window.open(correctUrl, '_blank');
            console.log(`🔗 فتح المنتج الصحيح: ${product.title} - ${correctUrl}`);
        } else {
            console.error(`❌ فشل فتح المنتج: ${productType} - ${productId}`);
        }
    };
    
    // تسجيل النقر على المنتج
    window.logProductClick = function(productType, productId) {
        console.log(`👆 نقر على منتج: ${productType} - ${productId}`);
    };
    
    // رسائل النجاح والخطأ
    function showSuccessMessage(message) {
        const existing = document.querySelector('.success-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white; padding: 15px 20px; border-radius: 10px;
            font-weight: 600; font-family: 'Cairo', sans-serif;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
            animation: slideInRight 0.4s ease; max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    function showErrorMessage(message) {
        const existing = document.querySelector('.error-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white; padding: 15px 20px; border-radius: 10px;
            font-weight: 600; font-family: 'Cairo', sans-serif;
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
            animation: slideInRight 0.4s ease; max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    // تحميل الصفحة الرئيسية
    async function loadHomePage() {
        const data = await loadProductData();
        
        console.log('🏠 تحميل منتجات الصفحة الرئيسية مع الفصل الكامل');
        
        // عطور في قسم العطور فقط
        if (document.getElementById('perfumes-grid')) {
            displayProductsCorrectly(data.perfumes.slice(0, 8), 'perfumes-grid', 'عطور');
        }
        
        // ساعات في قسم الساعات فقط
        if (document.getElementById('watches-grid')) {
            displayProductsCorrectly(data.watches.slice(0, 8), 'watches-grid', 'ساعات');
        }
        
        // منتجات مميزة (مختلطة)
        if (document.getElementById('featuredProducts')) {
            const featured = [...data.perfumes.slice(0, 4), ...data.watches.slice(0, 4)];
            displayProductsCorrectly(featured, 'featuredProducts', 'مميزة');
        }
        
        // أفضل العروض
        if (document.getElementById('bestDeals')) {
            const deals = data.all.filter(p => parseFloat(p.price) > parseFloat(p.sale_price)).slice(0, 6);
            displayProductsCorrectly(deals, 'bestDeals', 'عروض');
        }
    }
    
    // تحميل صفحة عرض المنتجات
    async function loadProductsShowcase() {
        const data = await loadProductData();
        
        console.log('🛍️ تحميل صفحة عرض المنتجات الكاملة');
        
        // عرض جميع المنتجات
        displayProductsCorrectly(data.all, 'allProductsGrid', 'جميع المنتجات');
        
        // إعداد الفلاتر
        setupCorrectFiltering(data);
    }
    
    // إعداد فلاتر صحيحة
    function setupCorrectFiltering(data) {
        const categoryFilter = document.getElementById('categoryFilter');
        const searchInput = document.getElementById('searchInput');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                const selectedCategory = this.value;
                
                console.log(`🔍 تطبيق فلتر: ${selectedCategory}`);
                
                if (selectedCategory === 'perfumes') {
                    displayProductsCorrectly(data.perfumes, 'allProductsGrid', 'عطور');
                    console.log(`🌸 عرض ${data.perfumes.length} عطر فقط`);
                } else if (selectedCategory === 'watches') {
                    displayProductsCorrectly(data.watches, 'allProductsGrid', 'ساعات');
                    console.log(`⏰ عرض ${data.watches.length} ساعة فقط`);
                } else {
                    displayProductsCorrectly(data.all, 'allProductsGrid', 'جميع المنتجات');
                    console.log(`🎯 عرض ${data.all.length} منتج (الكل)`);
                }
            });
        }
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = this.value.toLowerCase().trim();
                    
                    if (searchTerm === '') {
                        displayProductsCorrectly(data.all, 'allProductsGrid', 'جميع المنتجات');
                        return;
                    }
                    
                    const filteredProducts = data.all.filter(product => 
                        product.title.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm)
                    );
                    
                    displayProductsCorrectly(filteredProducts, 'allProductsGrid', 'نتائج البحث');
                    console.log(`🔍 نتائج البحث "${searchTerm}": ${filteredProducts.length} منتج`);
                }, 300);
            });
        }
    }
    
    // إضافة CSS للتحسينات
    function addFixedCSS() {
        if (document.querySelector('#fixed-products-css')) return;
        
        const style = document.createElement('style');
        style.id = 'fixed-products-css';
        style.textContent = `
            .correct-product {
                opacity: 0;
                animation: fadeInUp 0.6s ease forwards;
                background: white;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                overflow: hidden;
                transition: all 0.4s ease;
                border: 1px solid rgba(212, 175, 55, 0.15);
                position: relative;
            }
            
            .correct-product:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                border-color: rgba(212, 175, 55, 0.4);
            }
            
            .icon-btn:hover {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 6px 15px rgba(0,0,0,0.2);
            }
            
            .add-cart-btn:hover {
                background: #D4AF37 !important;
                border-color: #D4AF37 !important;
                color: white !important;
            }
            
            .details-btn:hover {
                background: #007bff !important;
                color: white !important;
            }
            
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            /* تحسينات الجوال */
            @media (max-width: 768px) {
                .icon-btn {
                    width: 38px !important;
                    height: 38px !important;
                    font-size: 1rem !important;
                }
                
                .product-actions {
                    gap: 6px !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // تهيئة النظام
    function initialize() {
        console.log('🚀 بدء تهيئة نظام المنتجات المصحح');
        
        addFixedCSS();
        
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === '' || currentPage === 'index.html') {
            loadHomePage();
        } else if (currentPage === 'products-showcase.html') {
            loadProductsShowcase();
        }
        
        updateCartCounter();
        
        console.log('✅ تم تهيئة النظام المصحح بنجاح');
    }
    
    // تصدير عام للوصول الخارجي
    window.FixedProductsLoader = {
        loadProductData,
        loadHomePage,
        loadProductsShowcase,
        displayProductsCorrectly,
        createCorrectProductCard,
        updateCartCounter,
        getPerfumesData: () => perfumesData,
        getWatchesData: () => watchesData,
        getAllProductsData: () => allProductsData
    };
    
    // التهيئة عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    console.log('🎯 نظام المنتجات المصحح: فصل كامل بين العطور والساعات');
    console.log('🔧 المميزات: عرض صحيح، روابط صحيحة، أزرار وظيفية');
    
})();