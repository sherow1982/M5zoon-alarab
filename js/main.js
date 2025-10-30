// وظائف المتجر الرئيسية - مخزون العرب

// دالة لتحويل اسم المنتج إلى سلاج عربي
function createArabicSlug(title, id) {
    // إزالة العلامات الخاصة والمسافات الزائدة 
    let slug = title
        .replace(/[^\u0600-\u06FF\w\s-]/g, '') // إبقاء العربية واللاتينية والأرقام
        .replace(/\s+/g, '-') // استبدال المسافات بشرطات
        .replace(/-+/g, '-') // دمج الشرطات المتعددة
        .replace(/^-+|-+$/g, '') // إزالة الشرطات في البداية والنهاية
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
    const phoneNumber = "201110760081"; // رقم الواتساب
    const message = `مرحباً! أريد أن أستفسر عن هذا المنتج:\n${productTitle}\nبسعر: ${productPrice} درهم إماراتي\n\nمن متجر مخزون العرب`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
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
                <a href="./product/${slug}.html" class="btn-view-product" target="_blank" rel="noopener noreferrer">
                    <span>🔍</span> شاهد المزيد
                </a>
            </div>
        </div>
    `;
}

// دالة تحميل المنتجات
async function loadProducts() {
    try {
        // تحميل منتجات العطور
        const perfumesResponse = await fetch('./data/otor.json');
        const perfumes = await perfumesResponse.json();
        
        // تحميل منتجات الساعات
        const watchesResponse = await fetch('./data/sa3at.json');
        const watches = await watchesResponse.json();
        
        // دمج جميع المنتجات
        const allProducts = [...perfumes, ...watches];
        
        // خلط المنتجات عشوائياً
        const shuffledProducts = allProducts.sort(() => Math.random() - 0.5);
        
        // عرض أول 30 منتج
        const productsToShow = shuffledProducts.slice(0, 30);
        
        const productsContainer = document.getElementById('products-grid');
        if (productsContainer) {
            productsContainer.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
            
            // إضافة تأثيرات الحركة
            const cards = document.querySelectorAll('.product-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }
        
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        const productsContainer = document.getElementById('products-grid');
        if (productsContainer) {
            productsContainer.innerHTML = '<p style="text-align: center; color: #999; font-size: 1.2rem;">عذراً، حدث خطأ في تحميل المنتجات. يرجى إعادة المحاولِ لاحقاً.</p>';
        }
    }
}

// دالة زر العودة للأعلى
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // إظهار وإخفاء الزر حسب موقع التمرير
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        // عملية التمرير للأعلى
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
    
    // مراقبة بطاقات المنتجات
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// دالة إضافة تأثيرات بصرية متقدمة
function initVisualEffects() {
    // تأثير الفارة على بطاقات المنتجات
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

// تشغيل المتجر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('مرحباً بكم في مخزون العرب - المتجر الإماراتي الموثوق!');
    
    // تحميل وعرض المنتجات
    loadProducts();
    
    // تفعيل زر العودة للأعلى
    initBackToTop();
    
    // تفعيل تأثيرات الحركة
    setTimeout(() => {
        initScrollAnimations();
        initVisualEffects();
    }, 1000);
    
    // إضافة تأثير loading للصفحة
    document.body.classList.add('loaded');
});

// تصدير الدوال للاستخدام في ملفات أخرى
window.M5zoonStore = {
    createArabicSlug,
    calculateDiscount,
    createWhatsAppLink,
    createProductCard
};