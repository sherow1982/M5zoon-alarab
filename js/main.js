// وضاـف المتجر الرئيسية المحسّنة - متجر هدايا الإمارات
// متوافق مع التصميم الجديد المستوحى من دخون الإماراتية
// مع دعم صفحات تفاصيل المنتجات الديناميكية

// متغيرات عامة
let cart = JSON.parse(localStorage.getItem('emirates-gifts-cart') || '[]');
let isLoading = false;

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
    const message = `مرحباً! أريد الاستفسار عن هذا المنتج:\n${productTitle}\nبسعر: ${productPrice} درهم إماراتي\n\nمن متجر هدايا الإمارات`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

// دالة الحصول على تقييم المنتج
function getProductRating(productTitle) {
    // التحقق من وجود نظام التقييمات
    if (typeof window !== 'undefined' && window.ReviewsSystem && window.ReviewsSystem.getProductRating) {
        return window.ReviewsSystem.getProductRating(productTitle);
    }
    
    // فولباك محلي مع تقييمات واقعية
    const slug = productTitle.toLowerCase();
    const ratings = {
        'ariaf': { rating: 4.8, count: 94, professionalReview: 'عطر فاخر عالي الجودة' },
        'glory': { rating: 4.7, count: 118, professionalReview: 'عطر مميز بثبات طويل' },
        'tom ford': { rating: 4.9, count: 127, professionalReview: 'عطر ماركة عالمية' },
        'kayali': { rating: 4.6, count: 134, professionalReview: 'عطر عصري مميز' },
        'rolex': { rating: 4.9, count: 234, professionalReview: 'ساعة فاخرة مقاومة للماء' },
        'omega': { rating: 4.8, count: 112, professionalReview: 'ساعة راقية دقيقة' }
    };
    
    for (let key in ratings) {
        if (slug.includes(key)) return ratings[key];
    }
    
    return { 
        rating: 4.5 + Math.random() * 0.4, 
        count: Math.floor(Math.random() * 100 + 50),
        professionalReview: 'منتج عالي الجودة'
    };
}

// دالة إضافة منتج للسلة مع تأكيد مرئي
window.addToCart = function(productData) {
    if (isLoading) return;
    
    try {
        const existingIndex = cart.findIndex(item => item.id === productData.id);
        
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            // إضافة بيانات إضافية
            const ratingData = getProductRating(productData.title);
            cart.push({
                ...productData,
                quantity: 1,
                rating: ratingData,
                store: 'متجر هدايا الإمارات',
                addedAt: new Date().toISOString()
            });
        }
        
        // حفظ في التخزين المحلي
        localStorage.setItem('emirates-gifts-cart', JSON.stringify(cart));
        
        // تحديث عداد السلة
        updateCartBadge();
        
        // إظهار رسالة تأكيد محسّنة
        showSuccessNotification(productData.title);
        
        console.log('تم إضافة المنتج للسلة:', productData.title);
        
    } catch (error) {
        console.error('خطأ في إضافة المنتج للسلة:', error);
        alert('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.');
    }
};

// دالة تحديث عداد السلة
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // البحث عن جميع عدادات السلة
    const badges = document.querySelectorAll('.cart-badge, #cartBadge, .cart-counter, #cart-count');
    
    badges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'flex';
            badge.classList.add('has-items');
        } else {
            badge.style.display = 'none';
            badge.classList.remove('has-items');
        }
    });
}

// دالة إظهار رسالة نجاح محسّنة
function showSuccessNotification(productTitle) {
    // إزالة أي رسالة سابقة
    const existing = document.querySelector('.success-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #25D366, #128C7E);
        color: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(37, 211, 102, 0.3);
        z-index: 10000;
        font-family: 'Cairo', sans-serif;
        font-weight: 600;
        max-width: 350px;
        animation: slideInRight 0.4s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 2rem;">✅</div>
            <div>
                <div style="font-size: 1.1rem; margin-bottom: 5px;">تم الإضافة بنجاح!</div>
                <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">
                    "${productTitle.length > 30 ? productTitle.substring(0, 30) + '...' : productTitle}" أُضيف إلى السلة
                </div>
                <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 5px;">
                    🛍️ عرض السلة | 📱 طلب عبر واتساب
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة بعد مدة
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.4s ease-in';
            setTimeout(() => notification.remove(), 400);
        }
    }, 3500);
    
    // إضافة انيميشن CSS إذا لم تكن موجودة
    if (!document.querySelector('#notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// دالة إنشاء بطاقة منتج محسّنة مع رابط تفاصيل
function createProductCard(product, categoryType = 'general') {
    const discount = calculateDiscount(product.price, product.sale_price);
    const whatsappLink = createWhatsAppLink(product.title, product.sale_price);
    const ratingData = getProductRating(product.title);
    
    const hasDiscount = product.price !== product.sale_price;
    const stars = '★'.repeat(Math.floor(ratingData.rating));
    
    // تصحيح بيانات المنتج للJSON
    const safeProductData = {
        id: product.id,
        title: product.title,
        price: product.price,
        sale_price: product.sale_price,
        image_link: product.image_link,
        image: product.image_link
    };
    
    return `
        <div class="product-card emirates-element" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image_link}" 
                     alt="${product.title} - متجر هدايا الإمارات" 
                     class="product-image lazyload" 
                     loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=هدايا+الإمارات'">
                ${hasDiscount ? 
                    `<div class="product-badge discount-badge">خصم ${discount}%</div>` : 
                    `<div class="product-badge new-badge">جديد</div>`
                }
                <div class="product-overlay">
                    <a href="./product-details.html?id=${product.id}" class="overlay-btn quick-view-btn" title="عرض التفاصيل">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="overlay-btn wishlist-btn" title="إضافة للمفضلة" onclick="addToWishlist('${product.id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="overlay-btn share-btn" title="مشاركة" onclick="shareProduct('${product.id}', '${product.title}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${categoryType === 'perfume' ? 'عطور فاخرة' : categoryType === 'watch' ? 'ساعات فاخرة' : 'هدايا مميزة'}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-text">(${ratingData.rating.toFixed(1)} • ${ratingData.count} تقييم)</span>
                </div>
                ${ratingData.professionalReview ? `
                    <div class="professional-review">
                        <i class="fas fa-check-circle"></i>
                        ${ratingData.professionalReview}
                    </div>
                ` : ''}
                <div class="product-price">
                    <span class="current-price">${product.sale_price} د.إ</span>
                    ${hasDiscount ? `<span class="original-price">${product.price} د.إ</span>` : ''}
                    ${hasDiscount ? `<span class="discount-percent">-${discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${JSON.stringify(safeProductData).replace(/"/g, '&quot;')})">
                        <i class="fas fa-shopping-cart"></i>
                        إضافة للسلة
                    </button>
                    <a href="${whatsappLink}" class="btn-whatsapp" target="_blank" rel="noopener noreferrer" title="طلب عبر واتساب">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="./product-details.html?id=${product.id}" class="btn-view-product" title="عرض التفاصيل">
                        <i class="fas fa-info-circle"></i>
                        التفاصيل
                    </a>
                </div>
            </div>
        </div>
    `;
}

// وظائف إضافية للتفاعل
window.addToWishlist = function(productId) {
    alert(`تم إضافة المنتج ${productId} للمفضلة - قريباً سيتم تفعيل هذه الميزة`);
};

window.shareProduct = function(productId, productTitle) {
    const productURL = `${window.location.origin}/product-details.html?id=${productId}`;
    
    if (navigator.share) {
        navigator.share({
            title: productTitle,
            text: `شاهد هذا المنتج الرائع من متجر هدايا الإمارات`,
            url: productURL
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // فولباك للمتصفحات القديمة
        if (navigator.clipboard) {
            navigator.clipboard.writeText(productURL).then(() => {
                alert('تم نسخ رابط المنتج!');
            }).catch(() => {
                prompt('انسخ الرابط:', productURL);
            });
        } else {
            prompt('انسخ الرابط:', productURL);
        }
    }
};

// دالة تحميل وعرض المنتجات الرئيسية
async function loadMainProducts() {
    if (isLoading) return;
    isLoading = true;
    
    try {
        // عرض رسالة تحميل
        const loadingElements = document.querySelectorAll('.loading-message');
        loadingElements.forEach(el => {
            el.innerHTML = '⏳ جارِ تحميل منتجات متجر هدايا الإمارات...';
        });
        
        // تحميل بيانات المنتجات
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('./data/otor.json').catch(err => {
                console.warn('لم يتم العثور على بيانات العطور:', err);
                return { ok: false };
            }),
            fetch('./data/sa3at.json').catch(err => {
                console.warn('لم يتم العثور على بيانات الساعات:', err);
                return { ok: false };
            })
        ]);
        
        let perfumes = [], watches = [];
        
        if (perfumesResponse.ok) {
            perfumes = await perfumesResponse.json();
            console.log(`تم تحميل ${perfumes.length} عطر`);
        }
        
        if (watchesResponse.ok) {
            watches = await watchesResponse.json();
            console.log(`تم تحميل ${watches.length} ساعة`);
        }
        
        // عرض العطور
        const perfumesGrid = document.getElementById('perfumes-grid');
        if (perfumesGrid && perfumes.length > 0) {
            perfumesGrid.innerHTML = perfumes.slice(0, 8)
                .map(product => createProductCard(product, 'perfume'))
                .join('');
        } else if (perfumesGrid) {
            perfumesGrid.innerHTML = '<div class="no-products">عذراً، لا توجد عطور متاحة حالياً</div>';
        }
        
        // عرض الساعات
        const watchesGrid = document.getElementById('watches-grid');
        if (watchesGrid && watches.length > 0) {
            watchesGrid.innerHTML = watches.slice(0, 8)
                .map(product => createProductCard(product, 'watch'))
                .join('');
        } else if (watchesGrid) {
            watchesGrid.innerHTML = '<div class="no-products">عذراً، لا توجد ساعات متاحة حالياً</div>';
        }
        
        // تحديث عداد السلة
        updateCartBadge();
        
        // تفعيل الانيميشن للبطاقات
        setTimeout(() => {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 200);
        
        // تفعيل lazy loading للصور
        initLazyLoading();
        
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        
        const grids = document.querySelectorAll('#perfumes-grid, #watches-grid');
        grids.forEach(grid => {
            if (grid) {
                grid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        عذراً، حدث خطأ في تحميل المنتجات
                        <br><small>يرجى إعادة تحميل الصفحة</small>
                        <br><button onclick="location.reload()" style="margin-top: 15px; background: var(--primary-gold); color: var(--deep-blue); border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">إعادة التحميل</button>
                    </div>
                `;
            }
        });
    } finally {
        isLoading = false;
    }
}

// دالة تفعيل lazy loading للصور
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazyload');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.remove('lazyload');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // فولباك للمتصفحات القديمة
        lazyImages.forEach(img => {
            img.classList.remove('lazyload');
            img.classList.add('loaded');
        });
    }
}

// دالة تفعيل التنقل السلس للروابط الداخلية
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.getAttribute('target') !== '_blank') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // إغلاق القائمة الجانبية إن كانت مفتوحة
                    const sidebar = document.getElementById('mobileSidebar');
                    const overlay = document.getElementById('mobileOverlay');
                    if (sidebar && sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                        overlay?.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    
                    // التنقل السلس
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            });
        }
    });
}

// دالة تفعيل أزرار القائمة الجانبية
function initMobileSidebar() {
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    const openSidebar = () => {
        sidebar?.classList.add('open');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeSidebar = () => {
        sidebar?.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    openBtn?.addEventListener('click', openSidebar);
    closeBtn?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);
    
    // إغلاق بزر Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
            closeSidebar();
        }
    });
}

// دالة تفعيل شريط التقدم وزر العودة للأعلى
function initScrollFeatures() {
    const progressBar = document.getElementById('progressBar');
    const backToTopBtn = document.getElementById('backToTop');
    const header = document.getElementById('header');
    
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            
            // شريط التقدم
            if (progressBar) {
                progressBar.style.width = `${Math.min(scrollPercent * 100, 100)}%`;
            }
            
            // تأثير الهيدر
            if (header) {
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            // زر العودة للأعلى
            if (backToTopBtn) {
                if (scrollTop > 500) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            }
        }, 16); // ~60fps
    }, { passive: true });
    
    // زر العودة للأعلى
    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// دالة إضافة CSS إضافي للتحسينات
function addEnhancedCSS() {
    if (!document.querySelector('#enhanced-main-css')) {
        const style = document.createElement('style');
        style.id = 'enhanced-main-css';
        style.textContent = `
            .product-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .product-card.loaded {
                opacity: 1;
                transform: translateY(0);
            }
            
            .no-products, .error-message {
                text-align: center;
                padding: 40px 20px;
                color: #666;
                font-size: 1.1rem;
                background: #f8f9fa;
                border-radius: 12px;
                border: 2px dashed #ddd;
            }
            
            .error-message {
                color: #e74c3c;
                background: #fff5f5;
                border-color: #e74c3c;
            }
            
            .error-message i {
                font-size: 2rem;
                margin-bottom: 15px;
                display: block;
            }
            
            .professional-review {
                background: rgba(39, 174, 96, 0.1);
                color: #27ae60;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                margin: 10px 0;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .professional-review i {
                font-size: 0.9rem;
            }
            
            .btn-view-product {
                background: var(--light-blue);
                color: var(--deep-blue);
                padding: 8px 12px;
                border-radius: var(--border-radius-small);
                text-decoration: none;
                font-size: 0.85rem;
                font-weight: 600;
                transition: var(--transition);
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .btn-view-product:hover {
                background: var(--primary-gold);
                color: var(--white);
                transform: translateY(-1px);
            }
            
            /* تحسينات الأداء */
            .product-card {
                contain: layout style paint;
                will-change: transform, opacity;
            }
            
            .product-image {
                will-change: transform;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: optimize-contrast;
            }
            
            /* تحسينات للجوال */
            @media (max-width: 768px) {
                .success-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .product-actions {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .btn-add-cart {
                    width: 100%;
                }
                
                .btn-whatsapp {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// تفعيل جميع الميزات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تم تحميل متجر هدايا الإمارات بنجاح!');
    
    // إضافة CSS محسّن
    addEnhancedCSS();
    
    // تحديث عداد السلة
    updateCartBadge();
    
    // تحميل المنتجات
    loadMainProducts();
    
    // تفعيل الميزات التفاعلية
    initMobileSidebar();
    initScrollFeatures();
    initSmoothScrolling();
    
    // تأخير بسيط لتفعيل الانيميشن
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 500);
});

// تفعيل إعادة تحميل المنتجات في حالة الرجوع للصفحة
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // الصفحة محمّلة من الذاكرة
        updateCartBadge();
    }
});

// تصدير الدوال الرئيسية للاستخدام الخارجي
if (typeof window !== 'undefined') {
    window.EmiratesGiftsStore = {
        createArabicSlug,
        calculateDiscount,
        createWhatsAppLink,
        createProductCard,
        addToCart: window.addToCart,
        getProductRating,
        updateCartBadge,
        showSuccessNotification,
        loadMainProducts,
        cart: () => cart
    };
}