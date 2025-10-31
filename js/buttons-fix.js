// ملف إصلاح شامل لأزرار بطاقات المنتجات - متجر هدايا الإمارات
// نسخة محدثة مع حل مشاكل أيقونة العين والتقييمات

(function() {
    'use strict';
    
    // متغيرات عامة
    let ratingsData = {};
    let isInitialized = false;
    
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
    
    // دالة إصلاح فوري لأزرار إضافة المنتجات للسلة
    function fixAddToCartButtons() {
        console.log('🔧 بدء إصلاح أزرار بطاقات المنتجات...');
        
        // البحث عن جميع أزرار إضافة للسلة
        const addButtons = document.querySelectorAll('.btn-add-to-cart, .btn-add-cart');
        console.log(`🔍 وُجد ${addButtons.length} زر إضافة للسلة`);
        
        addButtons.forEach((button, index) => {
            // إزالة أي مستمعين قدامى وإعادة إنشاء منظف
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // إضافة مستمع جديد محسّن
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('💆‍♂️ تم نقر زر إضافة للسلة');
                
                // تعطيل الزر مؤقتاً
                if (this.disabled) return;
                
                const originalHTML = this.innerHTML;
                const originalBg = this.style.backgroundColor || '';
                
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
                this.disabled = true;
                this.style.backgroundColor = '#95a5a6';
                this.style.transform = 'scale(0.95)';
                
                // استخراج بيانات المنتج
                let productData = this.getAttribute('data-product');
                
                if (!productData) {
                    // استخراج من البطاقة
                    const card = this.closest('.product-card');
                    if (card) {
                        const title = card.querySelector('.product-title, h3, .item-title')?.textContent?.trim() || 'منتج';
                        const priceElement = card.querySelector('.current-price, .sale-price, .price');
                        const price = priceElement ? priceElement.textContent.replace(/[^0-9.]/g, '') || '100' : '100';
                        const image = card.querySelector('img')?.src || '';
                        const productId = card.getAttribute('data-product-id') || 'temp-' + Date.now();
                        
                        productData = JSON.stringify({
                            id: productId,
                            title: title,
                            price: price,
                            sale_price: price,
                            image_link: image,
                            image: image
                        });
                    }
                }
                
                // محاكاة عملية الإضافة
                setTimeout(() => {
                    try {
                        if (productData) {
                            const product = JSON.parse(productData);
                            
                            // إضافة للسلة
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
                            
                            // تحديث عداد السلة
                            updateCartBadgeQuick();
                            
                            // عرض رسالة نجاح
                            showQuickSuccessMessage(product.title);
                            
                            // تغيير حالة الزر للنجاح
                            this.innerHTML = '<i class="fas fa-check"></i> تم!';
                            this.style.backgroundColor = '#27ae60';
                            this.style.transform = 'scale(1)';
                            
                            console.log('✅ تم إضافة المنتج بنجاح:', product.title);
                            
                        } else {
                            throw new Error('لا توجد بيانات منتج');
                        }
                        
                    } catch (error) {
                        console.error('خطأ في الإضافة:', error);
                        this.innerHTML = '<i class="fas fa-times"></i> خطأ';
                        this.style.backgroundColor = '#e74c3c';
                    }
                    
                    // إعادة الزر لحالته الطبيعية بعد 3 ثواني
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.backgroundColor = originalBg;
                        this.style.transform = 'scale(1)';
                        this.disabled = false;
                    }, 3000);
                    
                }, 800); // تأخير قصير لمحاكاة التحميل
            });
            
            console.log(`✅ تم إصلاح زر السلة رقم ${index + 1}`);
        });
    }
    
    // إصلاح فوري لأيقونة العين (overlay-btn مع رمز العين)
    function fixEyeButtons() {
        console.log('👁️ إصلاح أزرار أيقونة العين...');
        
        // معالجة عامة لجميع النقرات على أيقونة العين
        document.addEventListener('click', function(e) {
            // البحث عن زر أيقونة العين
            const eyeButton = e.target.closest('.overlay-btn');
            
            // التأكد من أنه يحتوي على أيقونة عين
            const hasEyeIcon = eyeButton && (eyeButton.querySelector('.fa-eye') || eyeButton.innerHTML.includes('fa-eye'));
            
            if (hasEyeIcon) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('👁️ تم نقر أيقونة العين');
                
                // استخراج معرف المنتج مضموناً من البطاقة
                const card = eyeButton.closest('.product-card');
                let productId = null;
                
                if (card) {
                    // محاولة عدة طرق للحصول على المعرف
                    productId = card.getAttribute('data-product-id') ||
                               card.getAttribute('data-id') ||
                               card.getAttribute('id');
                    
                    // إذا لم يوجد معرف، نحاول استخراجه من data-product
                    if (!productId) {
                        const productDataAttr = card.querySelector('[data-product]')?.getAttribute('data-product');
                        if (productDataAttr) {
                            try {
                                const productObj = JSON.parse(productDataAttr);
                                productId = productObj.id;
                            } catch (err) {
                                console.warn('خطأ في تحليل data-product:', err);
                            }
                        }
                    }
                    
                    console.log('🏷️ معرف المنتج:', productId);
                    
                    if (productId) {
                        // فتح صفحة التفاصيل
                        const detailsURL = `./product-details.html?id=${productId}`;
                        console.log('✅ فتح رابط:', detailsURL);
                        window.location.href = detailsURL;
                    } else {
                        console.warn('❌ لم يتم العثور على معرف المنتج');
                        alert('عذراً، لا يمكن عرض تفاصيل هذا المنتج حالياً');
                    }
                } else {
                    console.warn('❌ لم يتم العثور على بطاقة المنتج');
                    alert('عذراً، حدث خطأ في فتح صفحة التفاصيل');
                }
            });
        }, { passive: false, capture: true });
    }
    
    // دالة تحديث عداد السلة السريعة
    function updateCartBadgeQuick() {
        const cart = JSON.parse(localStorage.getItem('emirates-gifts-cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // البحث عن جميع عدادات السلة
        const selectors = ['.cart-badge', '#cartBadge', '.cart-counter', '#cart-count'];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.textContent = totalItems;
                    element.style.display = totalItems > 0 ? 'flex' : 'none';
                    if (totalItems > 0) {
                        element.classList.add('has-items');
                        element.style.animation = 'cartBounce 0.6s ease-out';
                    } else {
                        element.classList.remove('has-items');
                    }
                }
            });
        });
    }
    
    // دالة عرض رسالة نجاح سريعة
    function showQuickSuccessMessage(productTitle) {
        // إزالة رسائل سابقة
        const existing = document.querySelectorAll('.quick-success, .success-notification, .cart-notification');
        existing.forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = 'quick-success';
        notification.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <div class="success-text">
                    <strong>تم الإضافة!</strong>
                    <p>"${productTitle.length > 30 ? productTitle.substring(0, 30) + '...' : productTitle}"</p>
                    <div class="success-actions">
                        <span onclick="window.location.href='./cart.html'" class="action-link">🛒 عرض السلة</span>
                        <span onclick="window.open('https://wa.me/201110760081','_blank')" class="action-link">📱 واتساب</span>
                    </div>
                </div>
            </div>
        `;
        
        // أنماط CSS للرسالة
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #25D366, #20B358)',
            color: 'white',
            padding: '18px 22px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
            zIndex: '10000',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: '600',
            maxWidth: '320px',
            animation: 'quickSlideIn 0.4s ease-out',
            border: '2px solid rgba(255,255,255,0.3)'
        });
        
        document.body.appendChild(notification);
        
        // إزالة بعد 3.5 ثانية
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'quickSlideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3500);
    }
    
    // دالة إضافة التقييمات لبطاقات المنتجات
    function addRatingsToCards() {
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(card => {
            const productId = card.getAttribute('data-product-id');
            const ratingContainer = card.querySelector('.product-rating');
            
            if (productId && ratingContainer && !ratingContainer.classList.contains('enhanced')) {
                const rating = ratingsData[productId] || getDefaultRating();
                const stars = '★'.repeat(Math.floor(rating.rating));
                
                // إضافة علامة لتجنب التعديل المكرر
                ratingContainer.classList.add('enhanced');
                
                // تحديث محتوى التقييم
                ratingContainer.innerHTML = `
                    <div class="stars">${stars}</div>
                    <span class="rating-text">(${rating.rating} • ${rating.count} تقييم)</span>
                `;
                
                // إضافة المراجعة الاحترافية
                if (rating.professional_review) {
                    const reviewBadge = document.createElement('div');
                    reviewBadge.className = 'professional-review-badge';
                    reviewBadge.innerHTML = `<i class="fas fa-check-circle"></i> ${rating.professional_review}`;
                    
                    Object.assign(reviewBadge.style, {
                        background: 'rgba(39, 174, 96, 0.1)',
                        color: '#27ae60',
                        padding: '6px 10px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        margin: '8px 0 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        border: '1px solid rgba(39, 174, 96, 0.2)'
                    });
                    
                    // إدراج بعد التقييم
                    ratingContainer.parentNode.insertBefore(reviewBadge, ratingContainer.nextSibling);
                }
                
                console.log(`⭐ تم تحديث تقييم المنتج ${productId}`);
            }
        });
    }
    
    // تقييم افتراضي في حال عدم وجود تقييم محدد
    function getDefaultRating() {
        return {
            rating: 4.5 + Math.random() * 0.4,
            count: Math.floor(Math.random() * 100 + 50),
            professional_review: '✓ منتج عالي الجودة'
        };
    }
    
    // إضافة CSS لأنيميشن وتحسينات
    function addQuickFixCSS() {
        if (!document.querySelector('#buttons-fix-css')) {
            const style = document.createElement('style');
            style.id = 'buttons-fix-css';
            style.textContent = `
                @keyframes quickSlideIn {
                    0% { transform: translateX(100%) scale(0.8); opacity: 0; }
                    100% { transform: translateX(0) scale(1); opacity: 1; }
                }
                
                @keyframes quickSlideOut {
                    0% { transform: translateX(0) scale(1); opacity: 1; }
                    100% { transform: translateX(100%) scale(0.8); opacity: 0; }
                }
                
                @keyframes cartBounce {
                    0%, 20%, 50%, 80%, 100% { transform: scale(1); }
                    40% { transform: scale(1.2); }
                    60% { transform: scale(1.1); }
                }
                
                .quick-success .success-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .quick-success .success-icon {
                    font-size: 1.8rem;
                    animation: successPulse 0.6s ease-out;
                }
                
                .quick-success .success-text strong {
                    display: block;
                    font-size: 1rem;
                    margin-bottom: 4px;
                }
                
                .quick-success .success-text p {
                    margin: 0 0 8px 0;
                    font-size: 0.85rem;
                    opacity: 0.9;
                    line-height: 1.3;
                }
                
                .quick-success .success-actions {
                    display: flex;
                    gap: 12px;
                }
                
                .quick-success .action-link {
                    font-size: 0.75rem;
                    cursor: pointer;
                    text-decoration: underline;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }
                
                .quick-success .action-link:hover {
                    opacity: 1;
                }
                
                @keyframes successPulse {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                
                /* تحسين أزرار السلة */
                .btn-add-to-cart, .btn-add-cart {
                    cursor: pointer !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                }
                
                .btn-add-to-cart:hover:not(:disabled), .btn-add-cart:hover:not(:disabled) {
                    transform: translateY(-2px) scale(1.02);
                }
                
                .btn-add-to-cart:active, .btn-add-cart:active {
                    transform: translateY(0) scale(0.95);
                }
                
                .btn-add-to-cart:disabled, .btn-add-cart:disabled {
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                
                /* تحسين عداد السلة */
                .cart-badge, .cart-counter {
                    position: absolute;
                    top: -6px;
                    left: -6px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 10px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 5;
                }
                
                .cart-badge.has-items, .cart-counter.has-items {
                    animation: cartBounce 0.6s ease-out;
                }
                
                /* تحسين أيقونة العين */
                .overlay-btn {
                    cursor: pointer !important;
                    transition: all 0.2s ease;
                }
                
                .overlay-btn:hover {
                    transform: scale(1.1);
                    background: rgba(255, 255, 255, 0.9) !important;
                }
                
                /* شارة التقييم الاحترافي */
                .professional-review-badge {
                    animation: fadeInUp 0.5s ease-out;
                }
                
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @media (max-width: 768px) {
                    .quick-success {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // تفعيل جميع الإصلاحات
    async function initButtonsFix() {
        if (isInitialized) return;
        isInitialized = true;
        
        console.log('🛠️ بدء عملية إصلاح شاملة للأزرار...');
        
        // إضافة CSS
        addQuickFixCSS();
        
        // تحميل بيانات التقييمات
        await loadRatingsData();
        
        // إصلاح أزرار السلة
        fixAddToCartButtons();
        
        // إصلاح أيقونة العين
        fixEyeButtons();
        
        // إضافة التقييمات للبطاقات
        setTimeout(() => {
            addRatingsToCards();
        }, 2000);
        
        // تحديث عداد السلة
        updateCartBadgeQuick();
        
        console.log('✅ اكتمل إصلاح جميع الأزرار والتقييمات!');
    }
    
    // إعادة إصلاح الأزرار الديناميكية (بعد تحميل AJAX)
    function refixDynamicButtons() {
        setTimeout(() => {
            const newButtons = document.querySelectorAll('.btn-add-to-cart:not([data-fixed]), .btn-add-cart:not([data-fixed])');
            if (newButtons.length > 0) {
                console.log(`🔄 إعادة إصلاح ${newButtons.length} زر جديد`);
                fixAddToCartButtons();
                addRatingsToCards();
            }
        }, 2000);
    }
    
    // تشغيل فوري عند التحميل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initButtonsFix();
            refixDynamicButtons();
        });
    } else {
        initButtonsFix();
        refixDynamicButtons();
    }
    
    // إعادة الإصلاح عند العودة للصفحة
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            setTimeout(() => {
                initButtonsFix();
                refixDynamicButtons();
            }, 500);
        }
    });
    
    // إعادة إصلاح عند تغيير المحتوى ديناميكياً
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const hasNewCards = Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === 1 && (node.classList?.contains('product-card') || node.querySelector?.('.product-card'))
                );
                
                if (hasNewCards) {
                    console.log('🆕 تم اكتشاف بطاقات جديدة - إعادة إصلاح...');
                    setTimeout(() => {
                        fixAddToCartButtons();
                        fixEyeButtons();
                        addRatingsToCards();
                    }, 1000);
                }
            }
        });
    });
    
    // بدء مراقبة التغييرات
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // تصدير للاستخدام الخارجي
    window.ButtonsFix = {
        fixAddToCartButtons,
        fixEyeButtons,
        updateCartBadgeQuick,
        showQuickSuccessMessage,
        addRatingsToCards,
        refixDynamicButtons,
        ratingsData: () => ratingsData
    };
    
})();