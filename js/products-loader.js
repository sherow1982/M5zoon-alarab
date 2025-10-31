// نظام تحميل وعرض المنتجات الديناميكي - متجر هدايا الإمارات
// يحمّل جميع المنتجات من ملفات JSON ويعرضها تلقائياً

(function() {
    'use strict';
    
    let allProducts = [];
    let ratingsData = {};
    let isLoading = false;
    
    // تحميل بيانات التقييمات
    async function loadRatingsData() {
        try {
            const response = await fetch('./data/ratings.json');
            if (response.ok) {
                const ratings = await response.json();
                ratings.forEach(rating => {
                    ratingsData[rating.id.toString()] = rating;
                });
                console.log('✅ تم تحميل بيانات التقييمات');
            }
        } catch (error) {
            console.warn('خطأ في تحميل التقييمات:', error);
        }
    }
    
    // تحميل جميع المنتجات
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
                    categoryIcon: '⌚',
                    type: 'watch'
                }));
                allProducts.push(...watchesWithCategory);
                console.log(`✅ تم تحميل ${watches.length} ساعة`);
            }
            
            console.log(`🎯 إجمالي المنتجات المحملة: ${allProducts.length}`);
            
        } catch (error) {
            console.error('خطأ في تحميل المنتجات:', error);
        }
        
        isLoading = false;
        return allProducts;
    }
    
    // إنشاء HTML لبطاقة المنتج
    function createProductCard(product, index = 0) {
        const hasDiscount = product.price !== product.sale_price;
        const discountPercentage = hasDiscount ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;
        const rating = ratingsData[product.id.toString()] || getDefaultRating(product);
        const stars = '★'.repeat(Math.floor(rating.rating));
        const productJSON = JSON.stringify(product).replace(/"/g, '&quot;');
        
        return `
            <div class="product-card emirates-element" data-product-id="${product.id}" style="animation-delay: ${index * 0.1}s;">
                <div class="product-image-container">
                    <img src="${product.image_link}" 
                         alt="${product.title}" 
                         class="product-image"
                         onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=هدايا+الإمارات'">
                    
                    ${hasDiscount ? 
                        `<div class="product-badge discount-badge">خصم ${discountPercentage}%</div>` : 
                        `<div class="product-badge new-badge">جديد</div>`
                    }
                    
                    <div class="product-category-badge">${product.categoryIcon} ${product.category}</div>
                    
                    <div class="product-overlay">
                        <div class="overlay-btn eye-link" title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                        </div>
                    </div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    
                    <div class="product-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">(${rating.rating.toFixed(1)} • ${rating.count} تقييم)</span>
                    </div>
                    
                    ${rating.professional_review ? 
                        `<div class="professional-review-badge">
                            <i class="fas fa-check-circle"></i> ${rating.professional_review}
                        </div>` : ''
                    }
                    
                    <div class="product-price">
                        <span class="current-price">${product.sale_price} د.إ</span>
                        ${hasDiscount ? `<span class="original-price">${product.price} د.إ</span>` : ''}
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-add-cart" data-product="${productJSON}">
                            <i class="fas fa-shopping-cart"></i>
                            إضافة للسلة
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // تقييم افتراضي
    function getDefaultRating(product) {
        const baseRating = product.type === 'perfume' ? 4.6 : 4.7;
        return {
            rating: baseRating + Math.random() * 0.3,
            count: Math.floor(Math.random() * 150 + 50),
            professional_review: product.type === 'perfume' ? 
                '✓ عطر عالي الجودة' : '✓ ساعة فاخرة موثوقة'
        };
    }
    
    // عرض المنتجات في حاوية محددة
    function displayProducts(products, containerId, limit = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`لم يتم العثور على الحاوية: ${containerId}`);
            return;
        }
        
        const productsToShow = limit ? products.slice(0, limit) : products;
        
        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 20px;"></i>
                    <h3>لا توجد منتجات</h3>
                    <p>عذراً، لا توجد منتجات متاحة حالياً.</p>
                </div>
            `;
            return;
        }
        
        const productsHTML = productsToShow.map((product, index) => 
            createProductCard(product, index)
        ).join('');
        
        container.innerHTML = productsHTML;
        
        // تفعيل الأزرار بعد إنشاء HTML
        setTimeout(() => {
            if (window.ButtonsFix) {
                window.ButtonsFix.fixAddToCartButtons();
                window.ButtonsFix.fixEyeButtons();
                window.ButtonsFix.addRatingsToCards();
            }
        }, 100);
        
        console.log(`✅ تم عرض ${productsToShow.length} منتج في ${containerId}`);
    }
    
    // عرض المنتجات للصفحة الرئيسية
    async function loadHomePageProducts() {
        await Promise.all([loadRatingsData(), loadAllProducts()]);
        
        // أحدث العطور (8 منتجات)
        const latestPerfumes = allProducts
            .filter(p => p.type === 'perfume')
            .slice(0, 8);
        displayProducts(latestPerfumes, 'latestPerfumes', 8);
        
        // أحدث الساعات (8 منتجات)
        const latestWatches = allProducts
            .filter(p => p.type === 'watch')
            .slice(0, 8);
        displayProducts(latestWatches, 'latestWatches', 8);
        
        // منتجات مميزة مختلطة (12 منتج)
        const featuredProducts = allProducts
            .sort(() => 0.5 - Math.random())
            .slice(0, 12);
        displayProducts(featuredProducts, 'featuredProducts', 12);
        
        // أفضل العروض
        const bestDeals = allProducts
            .filter(p => p.price !== p.sale_price)
            .sort((a, b) => (b.price - b.sale_price) - (a.price - a.sale_price))
            .slice(0, 6);
        displayProducts(bestDeals, 'bestDeals', 6);
    }
    
    // عرض المنتجات لصفحة عرض المنتجات
    async function loadProductsShowcase() {
        await Promise.all([loadRatingsData(), loadAllProducts()]);
        
        displayProducts(allProducts, 'allProductsGrid');
        
        // إعداد الفلترة
        setupFiltering();
        setupSorting();
    }
    
    // إعداد نظام الفلترة
    function setupFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('searchInput');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // تحديث الأزرار النشطة
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // فلترة المنتجات
                let filteredProducts = allProducts;
                
                if (filter === 'perfumes') {
                    filteredProducts = allProducts.filter(p => p.type === 'perfume');
                } else if (filter === 'watches') {
                    filteredProducts = allProducts.filter(p => p.type === 'watch');
                }
                
                displayProducts(filteredProducts, 'allProductsGrid');
            });
        });
        
        // البحث
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const filteredProducts = allProducts.filter(product => 
                    product.title.toLowerCase().includes(searchTerm)
                );
                displayProducts(filteredProducts, 'allProductsGrid');
            });
        }
    }
    
    // إعداد نظام الترتيب
    function setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const sortType = this.value;
                let sortedProducts = [...allProducts];
                
                switch (sortType) {
                    case 'price-low':
                        sortedProducts.sort((a, b) => a.sale_price - b.sale_price);
                        break;
                    case 'price-high':
                        sortedProducts.sort((a, b) => b.sale_price - a.sale_price);
                        break;
                    case 'rating':
                        sortedProducts.sort((a, b) => {
                            const ratingA = ratingsData[a.id.toString()]?.rating || 4.5;
                            const ratingB = ratingsData[b.id.toString()]?.rating || 4.5;
                            return ratingB - ratingA;
                        });
                        break;
                    case 'newest':
                    default:
                        // الترتيب الافتراضي
                        break;
                }
                
                displayProducts(sortedProducts, 'allProductsGrid');
            });
        }
    }
    
    // إضافة CSS للبطاقات
    function addProductsCSS() {
        if (!document.querySelector('#products-loader-css')) {
            const style = document.createElement('style');
            style.id = 'products-loader-css';
            style.textContent = `
                .product-card {
                    opacity: 0;
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .product-category-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(212, 175, 55, 0.9);
                    color: var(--deep-blue);
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    z-index: 2;
                }
                
                .professional-review-badge {
                    background: rgba(39, 174, 96, 0.1);
                    color: #27ae60;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin: 5px 0;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    border: 1px solid rgba(39, 174, 96, 0.2);
                }
                
                .discount-badge {
                    background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
                }
                
                .new-badge {
                    background: linear-gradient(135deg, #27ae60, #229954) !important;
                }
                
                .no-products {
                    text-align: center;
                    padding: 60px 20px;
                    color: var(--text-light);
                }
                
                .no-products h3 {
                    margin: 10px 0;
                    color: var(--deep-blue);
                }
                
                .filter-controls {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    align-items: center;
                }
                
                .filter-btn {
                    background: var(--white);
                    border: 2px solid var(--primary-gold);
                    color: var(--primary-gold);
                    padding: 10px 20px;
                    border-radius: var(--border-radius-small);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .filter-btn.active,
                .filter-btn:hover {
                    background: var(--gradient-gold);
                    color: var(--deep-blue);
                    transform: translateY(-2px);
                }
                
                .search-input {
                    flex: 1;
                    max-width: 300px;
                    padding: 12px 15px;
                    border: 2px solid var(--light-gray);
                    border-radius: var(--border-radius-small);
                    font-family: 'Cairo', sans-serif;
                    font-size: 1rem;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: var(--primary-gold);
                }
                
                .sort-select {
                    padding: 10px 15px;
                    border: 2px solid var(--light-gray);
                    border-radius: var(--border-radius-small);
                    background: var(--white);
                    font-family: 'Cairo', sans-serif;
                    font-size: 0.9rem;
                }
                
                @media (max-width: 768px) {
                    .filter-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .search-input {
                        max-width: 100%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // التهيئة الرئيسية
    function init() {
        addProductsCSS();
        
        // تحديد نوع الصفحة وتحميل المنتجات المناسبة
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === '' || currentPage === 'index.html') {
            // الصفحة الرئيسية
            loadHomePageProducts();
        } else if (currentPage === 'products-showcase.html') {
            // صفحة عرض المنتجات
            loadProductsShowcase();
        }
    }
    
    // تصدير الوظائف للاستخدام الخارجي
    window.ProductsLoader = {
        loadAllProducts,
        loadHomePageProducts,
        loadProductsShowcase,
        displayProducts,
        createProductCard,
        setupFiltering,
        setupSorting,
        getAllProducts: () => allProducts,
        getRatingsData: () => ratingsData
    };
    
    // تشغيل عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();