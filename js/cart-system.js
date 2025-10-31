// نظام السلة المحسّن والمُصحح - متجر هدايا الإمارات
// إصلاح مشاكل إضافة المنتجات والتنقل للسلة

(function(){
    'use strict';
    
    const CART_STORAGE_KEY = 'emirates_shopping_cart';
    
    // دالة إضافة منتج للسلة - مُحسنة ومُصححة
    function addToCartSafe(productData) {
        try {
            console.log('🔄 محاولة إضافة منتج للسلة:', productData);
            
            // تنظيف وتحقق من بيانات المنتج
            if (!productData) {
                console.error('❌ بيانات المنتج مفقودة');
                showErrorNotification('بيانات المنتج غير صحيحة');
                return false;
            }
            
            // تنظيف البيانات وإضافة قيم افتراضية
            const cleanProduct = {
                id: productData.id || Date.now().toString(),
                title: productData.title || productData.name || 'منتج غير معروف',
                price: productData.price || productData.sale_price || '0',
                sale_price: productData.sale_price || productData.price || '0',
                image_link: productData.image_link || productData.image || 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=هدايا+الإمارات',
                quantity: 1,
                addedAt: new Date().toISOString(),
                store: 'متجر هدايا الإمارات'
            };
            
            console.log('✅ بيانات المنتج المنظفة:', cleanProduct);
            
            // قراءة السلة الحالية
            let cart = [];
            try {
                const cartData = localStorage.getItem(CART_STORAGE_KEY);
                cart = cartData ? JSON.parse(cartData) : [];
            } catch (e) {
                console.warn('⚠️ خطأ في قراءة السلة، إنشاء سلة جديدة:', e);
                cart = [];
            }
            
            // البحث عن المنتج في السلة
            const existingIndex = cart.findIndex(item => item.id === cleanProduct.id);
            
            if (existingIndex !== -1) {
                // زيادة الكمية للمنتج الموجود
                cart[existingIndex].quantity = (cart[existingIndex].quantity || 0) + 1;
                console.log('📊 تم زيادة كمية المنتج:', cart[existingIndex]);
            } else {
                // إضافة منتج جديد
                cart.push(cleanProduct);
                console.log('🆕 تم إضافة منتج جديد للسلة');
            }
            
            // حفظ السلة
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
                console.log('💾 تم حفظ السلة بنجاح');
            } catch (e) {
                console.error('❌ خطأ في حفظ السلة:', e);
                showErrorNotification('فشل في حفظ المنتج');
                return false;
            }
            
            // تحديث العداد وإظهار الرسالة
            updateCartCounter();
            showSuccessNotification(cleanProduct.title);
            
            return true;
            
        } catch (error) {
            console.error('❌ خطأ عام في إضافة المنتج:', error);
            showErrorNotification('حدث خطأ غير متوقع. يرجى إعادة المحاولة.');
            return false;
        }
    }
    
    // دالة تحديث عداد السلة - محسّنة
    function updateCartCounter() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            
            // تحديث جميع العدادات
            const selectors = [
                '.cart-counter', '.cart-badge', '#cart-count', 
                '#cartBadge', '.mobile-cart-counter', '#currentCartCount'
            ];
            
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        element.textContent = totalItems;
                        element.style.display = totalItems > 0 ? 'flex' : 'none';
                        
                        if (totalItems > 0) {
                            element.classList.add('has-items');
                        } else {
                            element.classList.remove('has-items');
                        }
                    }
                });
            });
            
            console.log(`🛒 تم تحديث عداد السلة: ${totalItems} منتج`);
            
        } catch (error) {
            console.error('❌ خطأ في تحديث العداد:', error);
        }
    }
    
    // دالة عرض رسالة النجاح - محسّنة مع رابط السلة
    function showSuccessNotification(productTitle) {
        // إزالة الرسائل السابقة
        document.querySelectorAll('.success-notification, .error-notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(37, 211, 102, 0.4);
            z-index: 10001;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            max-width: 380px;
            animation: slideInSuccess 0.5s ease-out;
            border: 2px solid rgba(255, 255, 255, 0.2);
            cursor: default;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 15px;">
                <div style="font-size: 2.2rem; animation: checkmark 0.6s ease-out; flex-shrink: 0;">✅</div>
                <div style="flex: 1;">
                    <div style="font-size: 1.1rem; margin-bottom: 5px; font-weight: 700;">تم الإضافة بنجاح!</div>
                    <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4; margin-bottom: 10px;">
                        "${productTitle.length > 30 ? productTitle.substring(0, 30) + '...' : productTitle}" أُضيف إلى السلة
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 12px;">
                        <button onclick="window.location.href='./cart.html'" 
                                style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: all 0.3s;" 
                                onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                                onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                            🛍️ عرض السلة
                        </button>
                        <button onclick="window.location.href='./checkout.html'" 
                                style="background: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,1); color: #25D366; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: all 0.3s;" 
                                onmouseover="this.style.background='white'" 
                                onmouseout="this.style.background='rgba(255,255,255,0.9)'">
                            📱 إتمام الطلب
                        </button>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.2rem; cursor: pointer; padding: 0; margin: 0; line-height: 1; flex-shrink: 0;" 
                        title="إغلاق">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إزالة تلقائية بعد 6 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutSuccess 0.4s ease-in';
                setTimeout(() => notification.remove(), 400);
            }
        }, 6000);
        
        addNotificationStyles();
    }
    
    // دالة عرض رسالة الخطأ - جديدة
    function showErrorNotification(message) {
        // إزالة الرسائل السابقة
        document.querySelectorAll('.success-notification, .error-notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(231, 76, 60, 0.4);
            z-index: 10001;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            max-width: 350px;
            animation: slideInSuccess 0.5s ease-out;
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 15px;">
                <div style="font-size: 2rem; flex-shrink: 0;">❌</div>
                <div style="flex: 1;">
                    <div style="font-size: 1.1rem; margin-bottom: 5px; font-weight: 700;">حدث خطأ!</div>
                    <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">
                        ${message}
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.2rem; cursor: pointer; padding: 0; margin: 0; line-height: 1; flex-shrink: 0;" 
                        title="إغلاق">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutSuccess 0.4s ease-in';
                setTimeout(() => notification.remove(), 400);
            }
        }, 5000);
        
        addNotificationStyles();
    }
    
    // دالة معالجة نقرة زر إضافة للسلة - محسّنة
    function handleAddToCartClick(button) {
        if (button.disabled || button.classList.contains('processing')) return;
        
        console.log('🔄 معالجة نقرة زر السلة');
        
        // تأمين الزر
        button.classList.add('processing');
        const originalHTML = button.innerHTML;
        const originalStyle = button.style.cssText;
        
        // تحديث مظهر الزر
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
        button.disabled = true;
        button.style.background = '#95a5a6';
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'all 0.3s ease';
        
        // استخراج بيانات المنتج
        let productData = null;
        
        try {
            // الطريقة الأولى: من data-product
            const dataProduct = button.getAttribute('data-product');
            if (dataProduct) {
                try {
                    productData = JSON.parse(dataProduct);
                    console.log('📦 بيانات من data-product:', productData);
                } catch (e) {
                    console.warn('⚠️ خطأ في تحليل data-product:', e);
                }
            }
            
            // الطريقة الثانية: من البطاقة المحيطة
            if (!productData) {
                const card = button.closest('.product-card, .product-item, .item, [data-product-id]');
                if (card) {
                    const title = card.querySelector('.product-title, .item-title, .title, h3, h2')?.textContent?.trim();
                    const priceElement = card.querySelector('.current-price, .sale-price, .price, .cost');
                    const originalPriceElement = card.querySelector('.original-price, .old-price');
                    const imageElement = card.querySelector('.product-image, .item-image, img');
                    
                    const price = priceElement ? priceElement.textContent.replace(/[^0-9.]/g, '') || '0' : '0';
                    const originalPrice = originalPriceElement ? originalPriceElement.textContent.replace(/[^0-9.]/g, '') || price : price;
                    const image = imageElement ? imageElement.src || imageElement.getAttribute('data-src') : '';
                    const productId = card.getAttribute('data-product-id') || 
                                    card.getAttribute('data-id') || 
                                    card.id ||
                                    Date.now().toString();
                    
                    productData = {
                        id: productId,
                        title: title || 'منتج غير معروف',
                        price: originalPrice,
                        sale_price: price,
                        image_link: image,
                        image: image
                    };
                    
                    console.log('📦 بيانات من البطاقة:', productData);
                }
            }
            
            // الطريقة الثالثة: بيانات افتراضية
            if (!productData || !productData.title) {
                productData = {
                    id: 'unknown-' + Date.now(),
                    title: 'منتج من متجر هدايا الإمارات',
                    price: '99',
                    sale_price: '89',
                    image_link: 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=هدايا+الإمارات',
                    image: 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=هدايا+الإمارات'
                };
                
                console.log('📦 بيانات افتراضية:', productData);
            }
            
        } catch (error) {
            console.error('❌ خطأ في استخراج بيانات المنتج:', error);
        }
        
        // محاولة إضافة المنتج للسلة
        setTimeout(() => {
            const success = addToCartSafe(productData);
            
            if (success) {
                // نجحت العملية
                button.innerHTML = '<i class="fas fa-check"></i> تم الإضافة!';
                button.style.background = '#27ae60';
                button.style.color = 'white';
                button.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.cssText = originalStyle;
                    button.disabled = false;
                    button.classList.remove('processing');
                }, 2500);
                
            } else {
                // فشلت العملية
                button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> حاول مرة أخرى';
                button.style.background = '#e74c3c';
                button.style.color = 'white';
                button.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.cssText = originalStyle;
                    button.disabled = false;
                    button.classList.remove('processing');
                }, 3000);
            }
        }, 1000); // تأخير لمحاكاة معالجة
    }
    
    // دالة إضافة انيميشن CSS
    function addNotificationStyles() {
        if (!document.querySelector('#cart-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'cart-notification-styles';
            style.textContent = `
                @keyframes slideInSuccess {
                    from { transform: translateX(100%) scale(0.8); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
                @keyframes slideOutSuccess {
                    from { transform: translateX(0) scale(1); opacity: 1; }
                    to { transform: translateX(100%) scale(0.8); opacity: 0; }
                }
                @keyframes checkmark {
                    0% { transform: scale(0) rotate(-45deg); }
                    50% { transform: scale(1.2) rotate(0deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                
                .cart-badge, .cart-counter {
                    position: absolute;
                    top: -8px;
                    left: -8px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 11px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                    transition: all 0.3s ease;
                }
                
                .cart-badge.has-items, .cart-counter.has-items {
                    animation: cartPulse 2s infinite;
                }
                
                @keyframes cartPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                
                .btn-add-cart, .btn-add-to-cart, .add-to-cart-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    position: relative;
                }
                
                .btn-add-cart:hover, .btn-add-to-cart:hover, .add-to-cart-btn:hover {
                    transform: translateY(-2px) scale(1.02) !important;
                }
                
                .btn-add-cart:active, .btn-add-to-cart:active, .add-to-cart-btn:active {
                    transform: translateY(0) scale(0.98) !important;
                }
                
                .btn-add-cart.processing, .btn-add-to-cart.processing, .add-to-cart-btn.processing {
                    pointer-events: none;
                }
                
                @media (max-width: 768px) {
                    .success-notification, .error-notification {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                        top: 70px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // دالة تفعيل مستمعي الأزرار
    function initCartButtonListeners() {
        // تفويض الأحداث للأزرار الديناميكية
        document.addEventListener('click', function(e) {
            const addButton = e.target.closest(
                '.btn-add-to-cart, .btn-add-cart, .add-to-cart-btn, [onclick*="addToCart"]'
            );
            
            if (addButton && !addButton.classList.contains('processing')) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🎯 تم النقر على زر السلة:', addButton);
                handleAddToCartClick(addButton);
            }
        });
        
        console.log('✅ تم تفعيل مستمعي أزرار السلة');
    }
    
    // دالة التهيئة الرئيسية
    function initCartSystem() {
        console.log('🛍️ تهيئة نظام السلة المُصحح...');
        
        addNotificationStyles();
        updateCartCounter();
        initCartButtonListeners();
        
        console.log('✅ نظام السلة المُصحح جاهز للعمل');
    }
    
    // تصدير للاستخدام الخارجي
    window.addToCart = addToCartSafe;
    window.updateCartCounter = updateCartCounter;
    window.showSuccessNotification = showSuccessNotification;
    window.showErrorNotification = showErrorNotification;
    window.CartSystem = {
        addToCart: addToCartSafe,
        updateCartCounter,
        showSuccessNotification,
        showErrorNotification,
        handleAddToCartClick,
        initCartButtonListeners,
        CART_STORAGE_KEY
    };
    
    // تشغيل النظام
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartSystem);
    } else {
        initCartSystem();
    }
    
    // إضافة مستمع تحديث تلقائي للعداد
    window.addEventListener('storage', function(e) {
        if (e.key === CART_STORAGE_KEY) {
            updateCartCounter();
        }
    });
    
    // إضافة مستمع لتحديث العداد عند العودة للصفحة
    window.addEventListener('pageshow', function(event) {
        updateCartCounter();
    });
    
})();