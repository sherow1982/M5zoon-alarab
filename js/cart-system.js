// نظام السلة المحسّن - متجر هدايا الإمارات
// مصحح ومحسن لعمل أزرار بطاقات المنتجات بشكل سليم

(function(){
    'use strict';
    
    // دالة تحديث عداد السلة المحسّنة
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('emirates-gifts-cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // البحث عن جميع عدادات السلة
        const counters = document.querySelectorAll('.cart-counter, #cart-count, .cart-badge, #cartBadge');
        counters.forEach(counter => {
            if (counter) {
                counter.textContent = totalItems;
                counter.style.display = totalItems > 0 ? 'flex' : 'none';
                
                if (totalItems > 0) {
                    counter.classList.add('has-items');
                } else {
                    counter.classList.remove('has-items');
                }
            }
        });
        
        console.log(`🛒 تم تحديث عداد السلة: ${totalItems} منتج`);
    }

    // دالة إضافة منتج للسلة الآمنة والمحسّنة
    function addToCartSafe(productData) {
        try {
            if (!productData || !productData.id) {
                console.error('بيانات المنتج غير صحيحة');
                return false;
            }
            
            let cart = JSON.parse(localStorage.getItem('emirates-gifts-cart')) || [];
            
            const existingIndex = cart.findIndex(item => item.id === productData.id);
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
            } else {
                // تنظيف بيانات المنتج
                const cleanProduct = {
                    id: productData.id,
                    title: productData.title || 'منتج غير معروف',
                    price: productData.price || productData.sale_price || '0',
                    sale_price: productData.sale_price || productData.price || '0',
                    image_link: productData.image_link || productData.image || '',
                    quantity: 1,
                    addedAt: new Date().toISOString(),
                    store: 'متجر هدايا الإمارات'
                };
                
                cart.push(cleanProduct);
            }
            
            localStorage.setItem('emirates-gifts-cart', JSON.stringify(cart));
            updateCartCounter();
            showSuccessNotification(productData.title);
            
            console.log('✅ تم إضافة المنتج للسلة:', productData.title);
            return true;
            
        } catch (error) {
            console.error('خطأ في إضافة المنتج للسلة:', error);
            alert('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.');
            return false;
        }
    }

    // دالة إظهار رسالة النجاح المحسّنة
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
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(37, 211, 102, 0.4);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            max-width: 350px;
            animation: slideInSuccess 0.5s ease-out;
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 2.2rem; animation: checkmark 0.6s ease-out;">✅</div>
                <div>
                    <div style="font-size: 1.1rem; margin-bottom: 5px; font-weight: 700;">تم الإضافة بنجاح!</div>
                    <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">
                        "${productTitle.length > 40 ? productTitle.substring(0, 40) + '...' : productTitle}" أُضيف إلى السلة
                    </div>
                    <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 8px; display: flex; gap: 15px;">
                        <span onclick="window.location.href='./cart.html'" style="cursor: pointer; text-decoration: underline;">🛒 عرض السلة</span>
                        <span onclick="window.open('https://wa.me/201110760081', '_blank')" style="cursor: pointer; text-decoration: underline;">📱 طلب واتساب</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إزالة الرسالة بعد 4 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutSuccess 0.4s ease-in';
                setTimeout(() => notification.remove(), 400);
            }
        }, 4000);
        
        // إضافة انيميشن CSS إذا لم يكن موجود
        if (!document.querySelector('#success-animations')) {
            const style = document.createElement('style');
            style.id = 'success-animations';
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
            `;
            document.head.appendChild(style);
        }
    }

    // دالة معالجة نقرة زر إضافة للسلة
    function handleAddToCartClick(button) {
        if (button.disabled) return;
        
        const originalHTML = button.innerHTML;
        const originalBg = button.style.background;
        
        // تغيير حالة الزر
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
        button.disabled = true;
        button.style.background = '#95a5a6';
        button.style.transform = 'scale(0.95)';
        
        let productData = null;
        
        try {
            // محاولة استخراج بيانات المنتج من data-product
            const dataProduct = button.getAttribute('data-product');
            if (dataProduct) {
                productData = JSON.parse(dataProduct);
            } else {
                // استخراج البيانات من البطاقة
                const card = button.closest('.product-card');
                if (card) {
                    const title = card.querySelector('.product-title, .item-title')?.textContent?.trim();
                    const priceElement = card.querySelector('.current-price, .sale-price');
                    const price = priceElement ? priceElement.textContent.replace(/[^0-9.]/g, '') : '0';
                    const image = card.querySelector('.product-image, img')?.src;
                    const productId = card.getAttribute('data-product-id') || Date.now().toString();
                    
                    productData = {
                        id: productId,
                        title: title || 'منتج غير معروف',
                        price: price,
                        sale_price: price,
                        image_link: image || '',
                        image: image || ''
                    };
                }
            }
            
            if (productData) {
                setTimeout(() => {
                    if (addToCartSafe(productData)) {
                        button.innerHTML = '<i class="fas fa-check"></i> تم الإضافة!';
                        button.style.background = '#27ae60';
                        button.style.transform = 'scale(1)';
                        
                        setTimeout(() => {
                            button.innerHTML = originalHTML;
                            button.style.background = originalBg;
                            button.disabled = false;
                        }, 2000);
                    } else {
                        // إعادة الزر لحالته الأصلية في حال الخطأ
                        button.innerHTML = originalHTML;
                        button.style.background = originalBg;
                        button.disabled = false;
                    }
                }, 800);
            } else {
                throw new Error('لم يتم العثور على بيانات المنتج');
            }
            
        } catch (error) {
            console.error('خطأ في معالجة النقرة:', error);
            
            // إعادة الزر لحالته الأصلية
            button.innerHTML = originalHTML;
            button.style.background = originalBg;
            button.disabled = false;
            button.style.transform = 'scale(1)';
            
            alert('عذراً، حدث خطأ في إضافة المنتج. يرجى المحاولة مرة أخرى.');
        }
    }

    // دالة تفعيل مستمعي الأزرار الشاملة
    function initCartButtonListeners() {
        // استخدام تفويض الأحداث للأزرار الديناميكية
        document.addEventListener('click', function(e) {
            const addButton = e.target.closest('.btn-add-to-cart, .btn-add-cart');
            if (addButton) {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCartClick(addButton);
            }
        });
        
        console.log('✅ تم تفعيل مستمعي أزرار السلة');
    }

    // إضافة CSS نظام السلة
    function addCartSystemCSS() {
        if (!document.querySelector('#cart-system-css')) {
            const style = document.createElement('style');
            style.id = 'cart-system-css';
            style.textContent = `
                .cart-badge, .cart-counter {
                    position: absolute;
                    top: -8px;
                    left: -8px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    font-size: 11px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                }
                
                .cart-badge.has-items, .cart-counter.has-items {
                    animation: cartPulse 1.5s infinite;
                }
                
                @keyframes cartPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                .btn-add-to-cart, .btn-add-cart {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    will-change: transform, background-color;
                }
                
                .btn-add-to-cart:hover, .btn-add-cart:hover {
                    transform: translateY(-2px) scale(1.02);
                }
                
                .btn-add-to-cart:active, .btn-add-cart:active {
                    transform: translateY(0) scale(0.98);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // التهيئة الرئيسية
    function initCartSystem() {
        console.log('🛒 تهيئة نظام السلة المحسّن...');
        
        addCartSystemCSS();
        updateCartCounter();
        initCartButtonListeners();
        
        console.log('✅ نظام السلة جاهز للعمل');
    }

    // تصدير للاستخدام الخارجي
    window.addToCart = addToCartSafe;
    window.updateCartCounter = updateCartCounter;
    window.CartSystem = {
        addToCart: addToCartSafe,
        updateCartCounter,
        showSuccessNotification,
        handleAddToCartClick,
        initCartButtonListeners
    };

    // تشغيل النظام
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartSystem);
    } else {
        initCartSystem();
    }
    
})();