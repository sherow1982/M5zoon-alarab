// وظائف المتجر الرئيسية - متجر هدايا الإمارات

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

// دالة تصنيف المنتجات بالفئات
function categorizeProducts(products) {
    const categories = {
        'عطور رجالية': [],
        'عطور نسائية': [],
        'ساعات رولكس': [],
        'ساعات أوميغا': [],
        'هدايا فاخرة': []
    };
    
    products.forEach(product => {
        const title = product.title.toLowerCase();
        
        if (title.includes('ساعة')) {
            if (title.includes('rolex') || title.includes('رولكس')) {
                categories['ساعات رولكس'].push(product);
            } else if (title.includes('omega') || title.includes('أوميغا')) {
                categories['ساعات أوميغا'].push(product);
            } else {
                categories['هدايا فاخرة'].push(product);
            }
        } else if (title.includes('عطر') || title.includes('tom ford') || title.includes('kayali') || title.includes('marly') || title.includes('penhaligons')) {
            // تصنيف بناءً على العلامة أو طبيعة العطر
            if (title.includes('tom ford') || title.includes('رجالي') || title.includes('سوفاج') || title.includes('ايروس')) {
                categories['عطور رجالية'].push(product);
            } else {
                categories['عطور نسائية'].push(product);
            }
        } else {
            categories['هدايا فاخرة'].push(product);
        }
    });
    
    return categories;
}

// دالة إنشاء بطاقة المنتج
function createProductCard(product) {
    const discount = calculateDiscount(product.price, product.sale_price);
    const slug = createArabicSlug(product.title, product.id);
    const whatsappLink = createWhatsAppLink(product.title, product.sale_price);
    
    return `
        <div class="product-card fade-in">
            ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
            <img src="${product.image_link}" alt="${product.title}" class="product-image" loading="lazy">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">
                <span class="sale-price">${product.sale_price} د.إ</span>
                ${product.price !== product.sale_price ? `<span class="old-price">${product.price} د.إ</span>` : ''}
            </div>
            <div class="product-buttons">
                <a href="${whatsappLink}" class="btn-whatsapp" target="_blank" rel="noopener noreferrer">
                    <span>📱</span> اشتري عبر واتساب
                </a>
                <a href="./products/${slug}.html" class="btn-view-product" target="_blank" rel="noopener noreferrer">
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

// دالة تحميل وعرض المنتجات بالفئات
async function loadProductsByCategories() {
    try {
        // تحميل عطور
        const perfumesResponse = await fetch('./data/otor.json');
        const perfumes = await perfumesResponse.json();
        
        // تحميل ساعات
        const watchesResponse = await fetch('./data/sa3at.json');
        const watches = await watchesResponse.json();
        
        // دمج وتصنيف المنتجات
        const allProducts = [...perfumes, ...watches];
        const categories = categorizeProducts(allProducts);
        
        // عرض الفئات
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            let html = '<h2>أجمل العطور والهدايا الفاخرة في الإمارات</h2>';
            
            // إضافة كل فئة بحد أقصى 8 منتجات
            Object.keys(categories).forEach(categoryName => {
                html += createCategorySection(categoryName, categories[categoryName], 8);
            });
            
            productsContainer.innerHTML = html;
            
            // إضافة تأثيرات الحركة
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

// دالة زر العودة للأعلى
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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

// دالة إضافة تأثيرات بصرية
function initVisualEffects() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            }
        });
    });
}

// تشغيل المتجر
document.addEventListener('DOMContentLoaded', () => {
    console.log('مرحباً بكم في متجر هدايا الإمارات!');
    
    // تحميل وعرض المنتجات بالفئات
    loadProductsByCategories();
    
    // تفعيل الوظائف التفاعلية
    initBackToTop();
    
    setTimeout(() => {
        initScrollAnimations();
        initVisualEffects();
    }, 1000);
    
    document.body.classList.add('loaded');
});

// تصدير الدوال
window.EmiratesGiftsStore = {
    createArabicSlug,
    calculateDiscount,
    createWhatsAppLink,
    createProductCard,
    categorizeProducts
};