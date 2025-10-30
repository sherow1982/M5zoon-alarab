// وظائف المتجر الرئيسية المحسّنة - متجر هدايا الإمارات

// دالة لتحويل اسم المنتج إلى سلاج عربي
function createArabicSlug(title, id) {
    let slug = title
        .replace(/[^\u0600-\u06FF\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    return slug ? `${slug}-${id}` : `product-${id}`;
}

// دالة حساب نسبة الخصم
function calculateDiscount(originalPrice, salePrice) {
    if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

// دالة إنشاء رابط واتساب
function createWhatsAppLink(productTitle, productPrice) {
    const phoneNumber = "201110760081";
    const message = `مرحباً! أريد أن أستفسر عن هذا المنتج:\n${productTitle}\nبسعر: ${productPrice} درهم إماراتي\n\nمن متجر هدايا الإمارات`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

// دالة الحصول على تقييم المنتج (متكاملة مع reviews-system.js)
function getProductRating(productTitle) {
    // التحقق من وجود نظام التقييمات
    if (window.ReviewsSystem && window.ReviewsSystem.getProductRating) {
        return window.ReviewsSystem.getProductRating(productTitle);
    }
    
    // فولباك محلي
    const slug = productTitle.toLowerCase();
    const ratings = {
        'ariaf': { rating: 4.8, count: 94 },
        'glory': { rating: 4.7, count: 118 },
        'tom-ford': { rating: 4.9, count: 127 },
        'marly': { rating: 4.9, count: 145 },
        'kayali': { rating: 4.6, count: 134 },
        'rolex': { rating: 4.9, count: 234 },
        'audemars': { rating: 4.8, count: 89 },
        'patek': { rating: 4.9, count: 67 },
        'omega': { rating: 4.8, count: 112 }
    };
    
    for (let key in ratings) {
        if (slug.includes(key)) return ratings[key];
    }
    
    return { 
        rating: 4.5 + Math.random() * 0.4, 
        count: Math.floor(Math.random() * 100 + 50) 
    };
}

// دالة إنشاء HTML التقييمات للبطاقات
function createCardRatingHTML(rating, count) {
    const stars = '★'.repeat(Math.floor(rating));
    return `
        <div class="card-rating">
            <span class="stars">${stars}</span>
            <span class="rating-number">${rating.toFixed(1)}</span>
            <span class="reviews-count">(${count})</span>
        </div>
    `;
}

// دالة تصنيف المنتجات بالفئات
function categorizeProducts(products) {
    const categories = {
        'عطور رجالية': [],
        'عطور نسائية': [],
        'ساعات رولكس': [],
        'ساعات فاخرة': [],
        'هدايا مميزة': []
    };
    
    products.forEach(product => {
        const title = product.title.toLowerCase();
        
        if (title.includes('ساعة')) {
            if (title.includes('rolex') || title.includes('رولكس')) {
                categories['ساعات رولكس'].push(product);
            } else {
                categories['ساعات فاخرة'].push(product);
            }
        } else if (title.includes('عطر') || title.includes('tom ford') || title.includes('kayali') || title.includes('marly')) {
            if (title.includes('tom ford') || title.includes('رجالي') || title.includes('سوفاج')) {
                categories['عطور رجالية'].push(product);
            } else {
                categories['عطور نسائية'].push(product);
            }
        } else {
            categories['هدايا مميزة'].push(product);
        }
    });
    
    return categories;
}

// دالة إنشاء بطاقة المنتج مع التقييمات
function createProductCard(product) {
    const discount = calculateDiscount(product.price, product.sale_price);
    const slug = createArabicSlug(product.title, product.id);
    const whatsappLink = createWhatsAppLink(product.title, product.sale_price);
    
    // الحصول على التقييم
    const ratingData = getProductRating(product.title);
    const ratingHTML = createCardRatingHTML(ratingData.rating, ratingData.count);
    
    return `
        <div class="product-card fade-in">
            ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
            <img src="${product.image_link}" alt="${product.title}" class="product-image" loading="lazy">
            <h3 class="product-title">${product.title}</h3>
            ${ratingHTML}
            <div class="product-price">
                <span class="sale-price">${product.sale_price} د.إ</span>
                ${product.price !== product.sale_price ? `<span class="old-price">${product.price} د.إ</span>` : ''}
            </div>
            <div class="product-buttons">
                <button class="btn-add-to-cart" data-product='${JSON.stringify(product)}' data-rating='${JSON.stringify(ratingData)}'>
                    <span>🛒</span> أضف للسلة
                </button>
                <a href="${whatsappLink}" class="btn-whatsapp" target="_blank" rel="noopener noreferrer">
                    <span>📱</span> واتساب
                </a>
                <a href="./products/${slug}.html" class="btn-view-product">
                    <span>🔍</span> شاهد المزيد
                </a>
            </div>
        </div>
    `;
}

// دالة عرض فئة منتجات
function createCategorySection(categoryName, products, maxProducts = 8) {
    if (products.length === 0) return '';
    
    const limitedProducts = products.slice(0, maxProducts);
    
    return `
        <div class="category-section">
            <h2 class="category-title">${categoryName}</h2>
            <div class="products-grid">
                ${limitedProducts.map(product => createProductCard(product)).join('')}
            </div>
        </div>
    `;
}

// دالة إضافة منتج للسلة مع التحويل التلقائي
function addToCart(productData, ratingData) {
    let cart = JSON.parse(localStorage.getItem('emirates-gifts-cart')) || [];
    
    const existingIndex = cart.findIndex(item => item.id === productData.id);
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            ...productData,
            quantity: 1,
            rating: ratingData,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('emirates-gifts-cart', JSON.stringify(cart));
    updateCartCounter();
    showAddToCartNotification(productData.title);
    
    // التوجه لصفحة السلة بعد ثانيتين
    setTimeout(() => {
        window.location.href = './cart.html';
    }, 2000);
}

// دالة تحديث عداد السلة
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('emirates-gifts-cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const counters = document.querySelectorAll('.cart-counter, #cart-count, .cart-badge, #cartBadge');
    counters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
        
        if (totalItems > 0) {
            counter.classList.add('has-items');
        } else {
            counter.classList.remove('has-items');
        }
    });
}

// دالة إظهار رسالة إضافة للسلة
function showAddToCartNotification(productTitle) {
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="success-icon">✅</div>
            <div class="notification-text">
                <strong>تم الإضافة بنجاح!</strong>
                <p>"${productTitle}" أضيف إلى سلة التسوق</p>
                <small>🔄 جاري التحويل للسلة...</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 2500);
}

// دالة تحميل وعرض المنتجات بالفئات
async function loadProductsByCategories() {
    try {
        const perfumesResponse = await fetch('./data/otor.json');
        const perfumes = await perfumesResponse.json();
        
        const watchesResponse = await fetch('./data/sa3at.json');
        const watches = await watchesResponse.json();
        
        const allProducts = [...perfumes, ...watches];
        const categories = categorizeProducts(allProducts);
        
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            let html = '<h2>أجمل العطور والهدايا الفاخرة</h2>';
            
            Object.keys(categories).forEach(categoryName => {
                html += createCategorySection(categoryName, categories[categoryName], 8);
            });
            
            productsContainer.innerHTML = html;
            addCartButtonListeners();
            
            const cards = document.querySelectorAll('.product-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.05}s`;
            });
        }
        
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.innerHTML = '<p style="text-align: center; color: #999; font-size: 1.2rem;">عذراً، حدث خطأ في تحميل المنتجات. يرجى إعادة المحاولة لاحقاً.</p>';
        }
    }
}

// دالة إضافة مستمعي أزرار السلة
function addCartButtonListeners() {
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalHTML = this.innerHTML;
            this.innerHTML = '<span>⏳</span> جاري الإضافة...';
            this.disabled = true;
            this.style.background = '#95a5a6';
            
            const productData = JSON.parse(this.getAttribute('data-product'));
            const ratingData = JSON.parse(this.getAttribute('data-rating') || '{}');
            
            setTimeout(() => {
                addToCart(productData, ratingData);
            }, 800);
        });
    });
}

// دالة زر العودة للأعلى
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            }, 100);
        }, { passive: true });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// دالة إضافة تأثيرات الحركة عند التمرير
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.product-card, .category-section').forEach(element => {
        observer.observe(element);
    });
}

// CSS للتقييمات والسلة (في حال عدم تحميل الملفات المنفصلة)
function addMainCSS() {
    if (!document.querySelector('#main-enhanced-css')) {
        const css = `
            <style id="main-enhanced-css">
            .card-rating {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin: 12px 0;
                padding: 10px;
                background: rgba(255, 215, 0, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(255, 215, 0, 0.2);
            }
            .card-rating .stars {
                color: #FFD700;
                font-size: 16px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .card-rating .rating-number {
                font-weight: bold;
                color: #2c3e50;
                font-size: 15px;
            }
            .card-rating .reviews-count {
                color: #666;
                font-size: 12px;
            }
            .btn-add-to-cart {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                min-height: 44px;
                margin-bottom: 8px;
            }
            .btn-add-to-cart:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            }
            .btn-add-to-cart:disabled {
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            .cart-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(39, 174, 96, 0.3);
                z-index: 10000;
                animation: slideInNotification 0.5s ease-out;
                max-width: 350px;
            }
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 15px;
            }
            .success-icon {
                font-size: 24px;
                margin-top: 2px;
            }
            .notification-text strong {
                font-size: 16px;
                display: block;
                margin-bottom: 5px;
            }
            .notification-text p {
                margin: 0 0 8px 0;
                font-size: 14px;
                opacity: 0.9;
            }
            .notification-text small {
                font-size: 12px;
                opacity: 0.8;
            }
            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @media (max-width: 768px) {
                .cart-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', css);
    }
}

// تشغيل المتجر المحسّن
document.addEventListener('DOMContentLoaded', () => {
    console.log('مرحباً بكم في متجر هدايا الإمارات!');
    
    // إضافة CSS الأساسي
    addMainCSS();
    
    // تحديث عداد السلة
    updateCartCounter();
    
    // تحميل وعرض المنتجات بالفئات
    loadProductsByCategories();
    
    // تفعيل الوظائف التفاعلية
    initBackToTop();
    
    setTimeout(() => {
        initScrollAnimations();
        document.body.classList.add('loaded');
    }, 1000);
});

// تصدير الدوال للاستخدام العام
window.EmiratesGiftsStore = {
    createArabicSlug,
    calculateDiscount,
    createWhatsAppLink,
    createProductCard,
    categorizeProducts,
    addToCart,
    getProductRating,
    updateCartCounter,
    showAddToCartNotification,
    addCartButtonListeners
};