// نظام تحميل وعرض المنتجات الديناميكي - متجر هدايا الإمارات
// يحمّل جميع المنتجات من ملفات JSON ويعرضها تلقائياً مع الروابط الجميلة والأزرار والتقييمات

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
    
    // إضافة للسلة
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('emirates-gifts-cart') || '[]');
        const existingIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ 
                ...product, 
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('emirates-gifts-cart', JSON.stringify(cart));
        
        // تحديث شارة السلة
        updateCartBadge();
        
        // رسالة نجاح
        showCartSuccess(product.title);
    }
    
    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('emirates-gifts-cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badges = document.querySelectorAll('.cart-badge, #cartBadge');
        
        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });
    }
    
    function showCartSuccess(productTitle) {
        // إزالة الرسالة السابقة إن وجدت
        const existingMsg = document.querySelector('.cart-success-popup');
        if (existingMsg) existingMsg.remove();
        
        const successMsg = document.createElement('div');
        successMsg.className = 'cart-success-popup';
        successMsg.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white; padding: 15px 20px; border-radius: 12px;
            font-weight: 600; box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
            animation: slideInRight 0.4s ease-out;
            max-width: 300px; font-size: 14px;
        `;
        
        successMsg.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle"></i>
                <span>تم إضافة "${productTitle}" للسلة!</span>
            </div>
            <div style="margin-top: 8px; display: flex; gap: 10px;">
                <a href="./cart.html" style="background: rgba(255,255,255,0.2); color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 0.8rem;">
                    <i class="fas fa-shopping-cart"></i> عرض السلة
                </a>
                <a href="./checkout.html" style="background: rgba(255,255,255,0.2); color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 0.8rem;">
                    <i class="fas fa-credit-card"></i> إتمام الطلب
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
        const whatsappMessage = encodeURIComponent(`مرحباً! أريد طلب "${product.title}" بسعر ${product.sale_price} درهم مع التوصيل المجاني`);
        
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
        
        return `
            <div class="product-card emirates-element" data-product-id="${product.id}" data-category="${product.categoryEn}" style="animation-delay: ${index * 0.1}s;">
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
                    
                    <div class="product-category-badge" style="position: absolute; top: 10px; left: 10px; background: rgba(212, 175, 55, 0.95); color: #2c3e50; padding: 6px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                        ${product.categoryIcon} ${product.category}
                    </div>
                    
                    <div class="product-overlay">
                        <a href="${prettyUrl}" target="_blank" class="overlay-btn eye-link" title="عرض التفاصيل" style="display: flex; align-items: center; justify-content: center; gap: 5px; text-decoration: none; color: white; font-size: 0.9rem; font-weight: 600;">
                            <i class="fas fa-eye"></i>
                            <span>التفاصيل</span>
                        </a>
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-category">${product.categoryIcon} ${product.category}</div>
                    <h3 class="product-title">
                        <a href="${prettyUrl}" target="_blank" class="product-title-link" style="color: inherit; text-decoration: none; font-weight: 700;">
                            ${product.title}
                        </a>
                    </h3>
                    
                    <!-- السعر -->
                    <div class="product-price" style="margin: 12px 0;">
                        <span class="current-price" style="font-size: 1.4rem; font-weight: 900; color: #27ae60;">${parseFloat(product.sale_price).toFixed(2)} د.إ</span>
                        ${hasDiscount ? `<span class="original-price" style="font-size: 1rem; color: #e74c3c; text-decoration: line-through; margin-right: 10px;">${parseFloat(product.price).toFixed(2)} د.إ</span>` : ''}
                    </div>
                    
                    <!-- التقييمات -->
                    <div class="product-rating-display" style="display: flex; align-items: center; gap: 8px; margin: 12px 0; padding: 8px 12px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; border: 1px solid rgba(255, 215, 0, 0.3);">
                        <div class="stars" style="color: #FFD700; font-size: 1rem;">${starsHTML}</div>
                        <span class="rating-number" style="font-weight: bold; color: #D4AF37; font-size: 0.9rem;">${averageRating.toFixed(1)}</span>
                        <span class="reviews-count" style="color: #666; font-size: 0.85rem;">(مراجعة ${totalReviews})</span>
                        <span class="verified-badge" style="background: #25D366; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.7rem; font-weight: 600;">✓ موثق</span>
                    </div>
                    
                    <div class="product-actions" style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; margin-top: 15px;">
                        <button class="btn-add-cart" 
                                onclick="addProductToCart('${product.id}', '${product.title.replace(/'/g, "\\'")}')"
                                style="background: linear-gradient(135deg, #FFD700, #D4AF37); color: #2c3e50; border: none; padding: 12px 15px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 6px; position: relative; overflow: hidden;">
                            <i class="fas fa-shopping-cart"></i>
                            <span>للسلة</span>
                        </button>
                        <a href="https://wa.me/201110760081?text=${whatsappMessage}" 
                           target="_blank"
                           class="btn-whatsapp"
                           style="background: linear-gradient(135deg, #25D366, #20B358); color: white; text-decoration: none; padding: 12px 15px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.3s ease;">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                    
                    <!-- رابط سريع لإتمام الطلب -->
                    <div style="margin-top: 10px; text-align: center;">
                        <a href="./checkout.html" style="color: #D4AF37; text-decoration: none; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 6px 12px; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 6px; transition: all 0.3s ease;">
                            <i class="fas fa-credit-card"></i>
                            اطلب فوراً
                        </a>
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
    
    // دالة إضافة للسلة - عامة
    window.addProductToCart = function(productId, productTitle) {
        const product = allProducts.find(p => p.id.toString() === productId.toString());
        if (product) {
            addToCart(product);
        } else {
            console.error('لم يتم العثور على المنتج:', productId);
        }
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
                    <button onclick="location.reload()" style="background: var(--primary-gold); color: #2c3e50; border: none; padding: 10px 20px; border-radius: 8px; margin-top: 15px; font-weight: 600; cursor: pointer;">
                        إعادة تحميل
                    </button>
                </div>
            `;
            return;
        }
        
        const productsHTML = productsToShow.map((product, index) => 
            createProductCard(product, index)
        ).join('');
        
        container.innerHTML = productsHTML;
        
        // تحديث شارة السلة بعد العرض
        setTimeout(() => {
            updateCartBadge();
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
        
        // timeout احتياطي بعد 5 ثوانِ
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
        
        // انتظار تحميل نظام التقييمات
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
                }
                
                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                    border-color: rgba(212, 175, 55, 0.4);
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
                
                .btn-add-cart:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
                }
                
                .btn-whatsapp:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
                }
                
                .eye-link:hover {
                    background: rgba(212, 175, 55, 0.95) !important;
                    color: #2c3e50 !important;
                }
                
                .discount-badge {
                    background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 3;
                    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
                }
                
                .new-badge {
                    background: linear-gradient(135deg, #27ae60, #229954) !important;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 3;
                    box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
                }
                
                .filter-btn {
                    background: white;
                    border: 2px solid #D4AF37;
                    color: #D4AF37;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Cairo', sans-serif;
                }
                
                .filter-btn.active,
                .filter-btn:hover {
                    background: linear-gradient(135deg, #FFD700, #D4AF37);
                    color: #2c3e50;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
                }
                
                .product-rating-display:hover {
                    background: rgba(255, 215, 0, 0.2);
                    border-color: rgba(255, 215, 0, 0.5);
                }
                
                .product-actions a:hover {
                    opacity: 0.9;
                }
                
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
        updateCartBadge,
        generateStarsHTML
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();