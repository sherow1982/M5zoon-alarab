// نظام تحميل وعرض المنتجات الديناميكي المحسن - متجر هدايا الإمارات
// أزرار أيقونية + وظائف متقدمة + فتح في تبويب جديد + أوصاف تلقائية

(function() {
    'use strict';
    
    let allProducts = [];
    let isLoading = false;
    
    // توليد slug عربي آمن
    function arabicSlugify(text) {
        if (!text) return '';
        return text
            .replace(/[\u0617-\u061A\u064B-\u0652]/g, '') // إزالة التشكيل
            .replace(/[\u200B-\u200F\uFEFF]/g, '')     // مسافات صفرية
            .replace(/["'`^~!@#$%&*()+=\[\]{}|;:,.<>?\\\/]/g, ' ') // رموز
            .replace(/\s+/g, ' ').trim() // مسافات متكررة
            .replace(/[^\w\s-]/g, '') // إبقاء الأحرف والأرقام فقط
            .replace(/\s+/g, '-') // استبدال المسافات بشرطات
            .replace(/-+/g, '-'); // معالجة شرطات متعددة
    }
    
    // إنشاء رابط المسار الجميل
    function buildPrettyURL(product) {
        const slug = arabicSlugify(product.title);
        return `./product-details.html?id=${product.id}&category=${product.categoryEn}&slug=${encodeURIComponent(slug)}`;
    }
    
    // إضافة للسلة مع النظام المحسن
    function addToCart(product) {
        const productData = {
            id: product.id,
            name: product.title,
            price: parseFloat(product.sale_price),
            priceText: product.sale_price + ' درهم',
            image: product.image_link,
            url: buildPrettyURL(product),
            quantity: 1,
            timestamp: new Date().toISOString()
        };
        
        if (window.EmiratesCart) {
            window.EmiratesCart.addToCartQuick(productData);
        } else {
            // نظام بديل
            let cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
            const existingIndex = cart.findIndex(item => item.id === product.id);
            
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push(productData);
            }
            
            localStorage.setItem('emirates_shopping_cart', JSON.stringify(cart));
            updateCartBadge();
            showCartSuccess(product.title);
        }
    }
    
    // طلب فوري مع النظام المحسن
    function orderNow(product) {
        const productData = {
            id: product.id,
            name: product.title,
            price: parseFloat(product.sale_price),
            priceText: product.sale_price + ' درهم',
            image: product.image_link,
            url: buildPrettyURL(product),
            quantity: 1,
            timestamp: new Date().toISOString()
        };
        
        if (window.EmiratesCart) {
            window.EmiratesCart.orderNow(productData);
        } else {
            // نظام بديل: إضافة للسلة ثم انتقال
            addToCart(product);
            setTimeout(() => {
                window.open('./cart.html', '_blank');
            }, 1500);
        }
    }
    
    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const badges = document.querySelectorAll('.cart-counter, .cart-badge, #cartBadge');
        
        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });
    }
    
    function showCartSuccess(productTitle) {
        if (window.EmiratesCart) return; // النظام المحسن يتولى الإشعارات
        
        const existingMsg = document.querySelector('.cart-success-popup');
        if (existingMsg) existingMsg.remove();
        
        const successMsg = document.createElement('div');
        successMsg.className = 'cart-success-popup';
        successMsg.style.cssText = `
            position: fixed; top: 90px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white; padding: 15px 20px; border-radius: 12px;
            font-weight: 600; box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
            animation: slideInRight 0.4s ease-out;
            max-width: 300px; font-size: 14px;
            font-family: 'Cairo', sans-serif;
        `;
        
        successMsg.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <i class="fas fa-check-circle"></i>
                <span>تم إضافة "${productTitle}" للسلة!</span>
            </div>
            <div style="display: flex; gap: 8px;">
                <a href="./cart.html" target="_blank" style="background: rgba(255,255,255,0.2); color: white; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 600;">
                    <i class="fas fa-shopping-cart"></i> السلة
                </a>
                <a href="./checkout.html" target="_blank" style="background: rgba(255,255,255,0.2); color: white; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 600;">
                    <i class="fas fa-credit-card"></i> اطلب فوراً
                </a>
            </div>
        `;
        
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 5000);
    }
    
    async function loadAllProducts() {
        if (isLoading) return allProducts;
        isLoading = true;
        
        try {
            console.log('🔄 بدء تحميل جميع المنتجات...');
            
            const [perfumesResponse, watchesResponse] = await Promise.all([
                fetch('./data/otor.json').catch(() => ({ ok: false })),
                fetch('./data/sa3at.json').catch(() => ({ ok: false }))
            ]);
            
            allProducts = [];
            
            if (perfumesResponse.ok) {
                const perfumes = await perfumesResponse.json();
                const perfumesWithCategory = perfumes.map(p => ({
                    ...p,
                    category: 'عطور',
                    categoryEn: 'perfume',
                    categoryIcon: '🌸',
                    type: 'perfume'
                }));
                allProducts.push(...perfumesWithCategory);
                console.log(`✅ تم تحميل ${perfumes.length} عطر`);
            }
            
            if (watchesResponse.ok) {
                const watches = await watchesResponse.json();
                const watchesWithCategory = watches.map(p => ({
                    ...p,
                    category: 'ساعات',
                    categoryEn: 'watch',
                    categoryIcon: '⏰',
                    type: 'watch'
                }));
                allProducts.push(...watchesWithCategory);
                console.log(`✅ تم تحميل ${watches.length} ساعة`);
            }
            
            console.log(`🎆 إجمالي المنتجات المحملة: ${allProducts.length}`);
            
        } catch (error) {
            console.error('خطأ في تحميل المنتجات:', error);
        }
        
        isLoading = false;
        return allProducts;
    }
    
    function createProductCard(product, index = 0) {
        const hasDiscount = parseFloat(product.price) !== parseFloat(product.sale_price);
        const discountPercentage = hasDiscount ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100) : 0;
        const prettyUrl = buildPrettyURL(product);
        
        // الحصول على التقييمات من النظام الثابت
        let averageRating = 4.5;
        let totalReviews = 0;
        let starsHTML = '★★★★☆';
        
        if (window.persistentReviews) {
            const productReviews = window.persistentReviews.getProductReviews(product.id);
            if (productReviews) {
                averageRating = parseFloat(productReviews.averageRating);
                totalReviews = productReviews.totalCount;
                starsHTML = generateStarsHTML(averageRating);
            }
        }
        
        // وصف تلقائي مناسب لنوع المنتج
        let productDescription = '';
        if (product.type === 'perfume') {
            productDescription = 'عطر فاخر بتركيبة عالية الجودة ورائحة مميزة تدوم طويلاً بأناقة وجاذبية';
        } else if (product.type === 'watch') {
            productDescription = 'ساعة عالية الجودة بتصميم أنيق ومواصفات احترافية مناسبة لجميع المناسبات';
        } else {
            productDescription = 'منتج عالي الجودة بمواصفات ممتازة وتصميم مميز بأفضل الأسعار';
        }
        
        return `
            <div class="product-card emirates-element" 
                 data-product-id="${product.id}" 
                 data-category="${product.categoryEn}" 
                 data-product-name="${product.title.replace(/'/g, "\'")}"
                 data-product-price="${product.sale_price}"
                 style="animation-delay: ${index * 0.1}s; text-align: center; cursor: pointer;"
                 onclick="openProductInNewTab('${prettyUrl}', event)">
                 
                <div class="product-image-container">
                    <img src="${product.image_link}" 
                         alt="${product.title}" 
                         class="product-image"
                         loading="${index < 6 ? 'eager' : 'lazy'}"
                         onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=هدايا+الإمارات'">
                    
                    ${hasDiscount ? 
                        `<div class="product-badge discount-badge">خصم ${discountPercentage}%</div>` : 
                        `<div class="product-badge new-badge">جديد</div>`
                    }
                    
                    <div class="product-category-badge">
                        ${product.categoryIcon} ${product.category}
                    </div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">
                        <a href="${prettyUrl}" target="_blank" class="product-title-link">
                            ${product.title}
                        </a>
                    </h3>
                    
                    <!-- الوصف التلقائي -->
                    <div class="product-description" style="font-size: 0.85rem; color: #666; margin: 8px 0; line-height: 1.4; text-align: center; padding: 0 10px;">
                        ${productDescription}
                    </div>
                    
                    <!-- السعر -->
                    <div class="product-price" style="margin: 12px 0; text-align: center;">
                        <span class="current-price" style="font-size: 1.4rem; font-weight: 900; color: #27ae60;">${parseFloat(product.sale_price).toFixed(2)} د.إ</span>
                        ${hasDiscount ? `<span class="original-price" style="font-size: 1rem; color: #e74c3c; text-decoration: line-through; margin-right: 10px;">${parseFloat(product.price).toFixed(2)} د.إ</span>` : ''}
                    </div>
                    
                    <!-- التقييمات -->
                    <div class="product-rating-display" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0; padding: 8px 12px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; border: 1px solid rgba(255, 215, 0, 0.3);">
                        <div class="stars" style="color: #FFD700; font-size: 1rem;">${starsHTML}</div>
                        <span class="rating-number" style="font-weight: bold; color: #D4AF37; font-size: 0.9rem;">${averageRating.toFixed(1)}</span>
                        <span class="reviews-count" style="color: #666; font-size: 0.85rem;">(${totalReviews})</span>
                        <span class="verified-badge" style="background: #25D366; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.7rem; font-weight: 600;">✓ موثق</span>
                    </div>
                    
                    <!-- الأزرار الأيقونية الجديدة -->
                    <div class="card-actions-container" style="display: flex; justify-content: center; gap: 8px; margin-top: 15px; flex-wrap: wrap;">
                        <!-- زر إضافة للسلة -->
                        <button class="icon-btn cart-icon-btn add-to-cart-btn" 
                                data-product-id="${product.id}"
                                onclick="addProductToCart('${product.id}', event)"
                                title="أضف للسلة">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="btn-tooltip">أضف للسلة</span>
                        </button>
                        
                        <!-- زر اطلب فوراً -->
                        <button class="icon-btn order-now-icon-btn order-now-btn" 
                                data-product-id="${product.id}"
                                onclick="orderProductNow('${product.id}', event)"
                                title="اطلب فوراً" 
                                style="background: linear-gradient(135deg, #25D366, #20B358); color: white; border-color: #25D366;">
                            <i class="fas fa-bolt"></i>
                            <span class="btn-tooltip">اطلب فوراً</span>
                        </button>
                        
                        <!-- زر واتساب -->
                        <button class="icon-btn whatsapp-icon-btn" 
                                onclick="sendWhatsAppOrder('${product.id}', event)"
                                title="طلب عبر واتساب" 
                                style="background: #25D366; color: white; border-color: #25D366;">
                            <i class="fab fa-whatsapp"></i>
                            <span class="btn-tooltip">واتساب</span>
                        </button>
                        
                        <!-- زر عرض تفاصيل -->
                        <button class="icon-btn details-icon-btn" 
                                onclick="openProductInNewTab('${prettyUrl}', event)"
                                title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                            <span class="btn-tooltip">التفاصيل</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // توليد نجوم التقييم
    function generateStarsHTML(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        
        if (hasHalfStar) {
            stars += '☆';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }
        
        return stars;
    }
    
    // وظائف عامة للأزرار
    window.addProductToCart = function(productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        const product = allProducts.find(p => p.id.toString() === productId.toString());
        if (product) {
            addToCart(product);
        }
    };
    
    window.orderProductNow = function(productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        const product = allProducts.find(p => p.id.toString() === productId.toString());
        if (product) {
            orderNow(product);
        }
    };
    
    window.sendWhatsAppOrder = function(productId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        const product = allProducts.find(p => p.id.toString() === productId.toString());
        if (product) {
            const message = `مرحباً! أريد طلب هذا المنتج:

🎁 ${product.title}
💰 ${product.sale_price} درهم

أريد معرفة تفاصيل الطلب والتوصيل.`;
            const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };
    
    window.openProductInNewTab = function(url, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        window.open(url, '_blank');
    };
    
    function displayProducts(products, containerId, limit = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`لم يتم العثور على الحاوية: ${containerId}`);
            return;
        }
        
        const productsToShow = limit ? products.slice(0, limit) : products;
        
        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; display: block; opacity: 0.6;"></i>
                    <h3 style="margin: 10px 0; color: #2c3e50;">لا توجد منتجات مطابقة</h3>
                    <p>عذراً، لا توجد منتجات مطابقة لبحثك.</p>
                    <button onclick="location.reload()" class="btn-primary">إعادة تحميل</button>
                </div>
            `;
            return;
        }
        
        const productsHTML = productsToShow.map((product, index) => 
            createProductCard(product, index)
        ).join('');
        
        container.innerHTML = productsHTML;
        
        // تطبيق التحسينات على البطاقات الجديدة
        setTimeout(() => {
            updateCartBadge();
            if (window.enhancedProductCards) {
                window.enhancedProductCards.enhanceAllCards();
            }
        }, 300);
        
        console.log(`✅ تم عرض ${productsToShow.length} منتج في ${containerId}`);
    }
    
    async function loadHomePageProducts() {
        await loadAllProducts();
        
        // انتظار تحميل نظام التقييمات قبل العرض
        const waitForReviews = setInterval(() => {
            if (window.persistentReviews && window.persistentReviews.isInitialized) {
                clearInterval(waitForReviews);
                displayHomeProducts();
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForReviews);
            displayHomeProducts();
        }, 5000);
        
        function displayHomeProducts() {
            // أحدث العطور (8 منتجات)
            const latestPerfumes = allProducts
                .filter(p => p.type === 'perfume')
                .slice(0, 8);
            displayProducts(latestPerfumes, 'perfumes-grid', 8);
            
            // أحدث الساعات (8 منتجات)
            const latestWatches = allProducts
                .filter(p => p.type === 'watch')
                .slice(0, 8);
            displayProducts(latestWatches, 'watches-grid', 8);
            
            // منتجات مميزة مختلطة (12 منتج)
            const featuredProducts = allProducts
                .sort(() => 0.5 - Math.random())
                .slice(0, 12);
            displayProducts(featuredProducts, 'featuredProducts', 12);
            
            // أفضل العروض
            const bestDeals = allProducts
                .filter(p => parseFloat(p.price) !== parseFloat(p.sale_price))
                .sort((a, b) => (parseFloat(b.price) - parseFloat(b.sale_price)) - (parseFloat(a.price) - parseFloat(a.sale_price)))
                .slice(0, 6);
            displayProducts(bestDeals, 'bestDeals', 6);
            
            console.log('🎆 تم عرض جميع منتجات الصفحة الرئيسية');
        }
    }
    
    async function loadProductsShowcase() {
        await loadAllProducts();
        
        const waitForReviews = setInterval(() => {
            if (window.persistentReviews && window.persistentReviews.isInitialized) {
                clearInterval(waitForReviews);
                displayProducts(allProducts, 'allProductsGrid');
                setupFiltering();
                setupSorting();
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForReviews);
            displayProducts(allProducts, 'allProductsGrid');
            setupFiltering();
            setupSorting();
        }, 5000);
    }
    
    function setupFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('searchInput');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                let filteredProducts = allProducts;
                
                if (filter === 'perfumes') {
                    filteredProducts = allProducts.filter(p => p.type === 'perfume');
                } else if (filter === 'watches') {
                    filteredProducts = allProducts.filter(p => p.type === 'watch');
                }
                
                displayProducts(filteredProducts, 'allProductsGrid');
            });
        });
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = this.value.toLowerCase().trim();
                    if (searchTerm === '') {
                        displayProducts(allProducts, 'allProductsGrid');
                        return;
                    }
                    
                    const filteredProducts = allProducts.filter(product => 
                        product.title.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm)
                    );
                    displayProducts(filteredProducts, 'allProductsGrid');
                }, 300);
            });
        }
    }
    
    function setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const sortType = this.value;
                let sortedProducts = [...allProducts];
                
                switch (sortType) {
                    case 'price-low':
                        sortedProducts.sort((a, b) => parseFloat(a.sale_price) - parseFloat(b.sale_price));
                        break;
                    case 'price-high':
                        sortedProducts.sort((a, b) => parseFloat(b.sale_price) - parseFloat(a.sale_price));
                        break;
                    case 'rating':
                        sortedProducts.sort((a, b) => {
                            const ratingA = window.persistentReviews ? 
                                parseFloat(window.persistentReviews.getProductReviews(a.id)?.averageRating || 4.5) : 4.5;
                            const ratingB = window.persistentReviews ? 
                                parseFloat(window.persistentReviews.getProductReviews(b.id)?.averageRating || 4.5) : 4.5;
                            return ratingB - ratingA;
                        });
                        break;
                    case 'newest':
                    default:
                        break;
                }
                
                displayProducts(sortedProducts, 'allProductsGrid');
            });
        }
    }
    
    function addProductsCSS() {
        if (!document.querySelector('#products-loader-css')) {
            const style = document.createElement('style');
            style.id = 'products-loader-css';
            style.textContent = `
                .product-card {
                    opacity: 0;
                    animation: fadeInUp 0.6s ease-out forwards;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                    transition: all 0.4s ease;
                    border: 1px solid rgba(212, 175, 55, 0.15);
                    position: relative;
                    cursor: pointer;
                    text-align: center;
                }
                
                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                    border-color: rgba(212, 175, 55, 0.4);
                }
                
                .product-category-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(212, 175, 55, 0.95);
                    color: #2c3e50;
                    padding: 6px 10px;
                    border-radius: 15px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    z-index: 2;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                
                .icon-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: 2px solid #ddd;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    font-size: 1.2rem;
                    color: #666;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .icon-btn:hover {
                    background: #D4AF37;
                    border-color: #D4AF37;
                    color: white;
                    transform: translateY(-3px) scale(1.1);
                    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
                }
                
                .icon-btn.order-now-icon-btn:hover {
                    background: linear-gradient(135deg, #20B358, #1e8449) !important;
                    border-color: #20B358;
                    box-shadow: 0 6px 20px rgba(32, 179, 88, 0.4);
                }
                
                .icon-btn.whatsapp-icon-btn:hover {
                    background: #20B358 !important;
                    border-color: #20B358;
                    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
                }
                
                .icon-btn.details-icon-btn:hover {
                    background: #007bff;
                    border-color: #007bff;
                    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
                }
                
                .btn-tooltip {
                    position: absolute;
                    bottom: -40px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.9);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    opacity: 0;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    z-index: 1001;
                    font-weight: 600;
                    pointer-events: none;
                }
                
                .icon-btn:hover .btn-tooltip {
                    opacity: 1;
                    bottom: -35px;
                }
                
                .product-description {
                    font-size: 0.85rem !important;
                    color: #666 !important;
                    margin: 8px 0 !important;
                    line-height: 1.4 !important;
                    text-align: center !important;
                    padding: 0 10px;
                }
                
                .card-actions-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    margin-top: 15px;
                    padding: 10px 0;
                    flex-wrap: wrap;
                }
                
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideInRight {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                
                .product-title-link:hover {
                    color: var(--primary-gold) !important;
                    transition: color 0.3s ease;
                }
                
                /* تحسينات للهواتف */
                @media (max-width: 768px) {
                    .product-actions {
                        grid-template-columns: 1fr !important;
                        gap: 8px !important;
                    }
                    
                    .filter-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .product-card {
                        margin-bottom: 20px;
                    }
                    
                    .icon-btn {
                        width: 42px;
                        height: 42px;
                        font-size: 1.1rem;
                    }
                    
                    .card-actions-container {
                        gap: 6px;
                        margin-top: 12px;
                    }
                    
                    .btn-tooltip {
                        font-size: 0.7rem;
                        padding: 4px 8px;
                    }
                }
                
                @media (max-width: 480px) {
                    .icon-btn {
                        width: 38px;
                        height: 38px;
                        font-size: 1rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function init() {
        addProductsCSS();
        
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === '' || currentPage === 'index.html') {
            loadHomePageProducts();
        } else if (currentPage === 'products-showcase.html') {
            loadProductsShowcase();
        }
        
        // تحديث شارة السلة في البداية
        updateCartBadge();
    }
    
    // تصدير الوظائف عالمياً
    window.ProductsLoader = {
        loadAllProducts,
        loadHomePageProducts,
        loadProductsShowcase,
        displayProducts,
        createProductCard,
        setupFiltering,
        setupSorting,
        getAllProducts: () => allProducts,
        arabicSlugify,
        buildPrettyURL,
        addToCart,
        orderNow,
        updateCartBadge,
        generateStarsHTML
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();