// نظام السلة المحسّن والمُصحح - متجر هدايا الإمارات
// إصدار v2.0 - إصلاح شامل لجميع المشاكل
// تحسينات: الأمان، الأداء، معالجة الأخطاء، UX

(function() {
    'use strict';
    
    // إعدادات النظام
    const CONFIG = {
        STORAGE_KEY: 'emirates_shopping_cart',
        MAX_QUANTITY: 50,
        MAX_CART_SIZE: 100,
        NOTIFICATION_DURATION: 5000,
        PROCESS_DELAY: 800,
        version: '2.0.0'
    };
    
    // وظائف المساعدة
    const Utils = {
        sanitize: (str) => {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        
        validatePrice: (price) => {
            const num = parseFloat(price);
            return isNaN(num) || num < 0 ? 0 : num;
        },
        
        formatPrice: (price) => {
            const validPrice = Utils.validatePrice(price);
            return validPrice.toFixed(2);
        },
        
        generateId: () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },
        
        log: (message, type = 'info') => {
            const emoji = {
                info: 'ℹ️',
                success: '✅',
                warning: '⚠️',
                error: '❌'
            };
            console.log(`${emoji[type]} Cart System: ${message}`);
        }
    };
    
    // إدارة الذاكرة المحلية
    const Storage = {
        get: () => {
            try {
                const data = localStorage.getItem(CONFIG.STORAGE_KEY);
                const cart = data ? JSON.parse(data) : [];
                return Array.isArray(cart) ? cart : [];
            } catch (error) {
                Utils.log('خطأ في قراءة السلة', 'warning');
                return [];
            }
        },
        
        set: (cart) => {
            try {
                const validCart = Array.isArray(cart) ? cart : [];
                const limitedCart = validCart.slice(0, CONFIG.MAX_CART_SIZE);
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(limitedCart));
                return true;
            } catch (error) {
                Utils.log('خطأ في حفظ السلة', 'error');
                return false;
            }
        },
        
        clear: () => {
            try {
                localStorage.removeItem(CONFIG.STORAGE_KEY);
                return true;
            } catch (error) {
                Utils.log('خطأ في محو السلة', 'error');
                return false;
            }
        }
    };
    
    // إدارة الإشعارات
    const Notifications = {
        create: (type, title, message, actions = []) => {
            // إزالة الرسائل السابقة
            document.querySelectorAll('.cart-notification, .success-notification, .error-notification')
                   .forEach(el => el.remove());
            
            const isSuccess = type === 'success';
            const bgColor = isSuccess ? 'linear-gradient(135deg, #25D366, #20B358)' : 'linear-gradient(135deg, #e74c3c, #c0392b)';
            const icon = isSuccess ? '✅' : '❌';
            
            const notification = document.createElement('div');
            notification.className = `${type}-notification cart-notification`;
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 20px 25px;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                font-family: 'Cairo', sans-serif;
                font-weight: 600;
                max-width: 400px;
                animation: slideInNotification 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
            `;
            
            const actionsHTML = actions.length > 0 ? 
                `<div style="display: flex; gap: 10px; margin-top: 15px;">
                    ${actions.map(action => 
                        `<button onclick="${action.onclick}" 
                                 style="${action.style}" 
                                 onmouseover="${action.hoverIn || ''}" 
                                 onmouseout="${action.hoverOut || ''}">
                            ${action.text}
                        </button>`
                    ).join('')}
                </div>` : '';
            
            notification.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="font-size: 2.2rem; animation: iconBounce 0.6s ease-out; flex-shrink: 0;">${icon}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 1.1rem; margin-bottom: 5px; font-weight: 700;">${Utils.sanitize(title)}</div>
                        <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4; margin-bottom: 5px;">
                            ${Utils.sanitize(message)}
                        </div>
                        ${actionsHTML}
                    </div>
                    <button onclick="this.closest('.cart-notification').remove()" 
                            style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.4rem; cursor: pointer; padding: 0; margin: 0; line-height: 1; flex-shrink: 0; transition: color 0.3s;" 
                            onmouseover="this.style.color='white'" 
                            onmouseout="this.style.color='rgba(255,255,255,0.7)'" 
                            title="إغلاق">
                        ×
                    </button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // إزالة تلقائية
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutNotification 0.4s ease-in forwards';
                    setTimeout(() => notification.remove(), 400);
                }
            }, CONFIG.NOTIFICATION_DURATION);
        },
        
        success: (productTitle) => {
            const actions = [
                {
                    text: '🛍️ عرض السلة',
                    onclick: "window.location.href='./cart.html'",
                    style: 'background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.3s; text-decoration: none;',
                    hoverIn: "this.style.background='rgba(255,255,255,0.3)'",
                    hoverOut: "this.style.background='rgba(255,255,255,0.2)'"
                },
                {
                    text: '📱 إتمام الطلب',
                    onclick: "window.location.href='./checkout.html'",
                    style: 'background: rgba(255,255,255,0.9); border: 1px solid white; color: #25D366; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.3s; text-decoration: none;',
                    hoverIn: "this.style.background='white'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'",
                    hoverOut: "this.style.background='rgba(255,255,255,0.9)'; this.style.boxShadow='none'"
                }
            ];
            
            const truncatedTitle = productTitle.length > 35 ? 
                productTitle.substring(0, 35) + '...' : productTitle;
            
            Notifications.create(
                'success',
                'تم الإضافة بنجاح!',
                `"${truncatedTitle}" أُضيف إلى السلة`,
                actions
            );
        },
        
        error: (message) => {
            Notifications.create(
                'error',
                'حدث خطأ!',
                message || 'لم يتم إضافة المنتج. يرجى إعادة المحاولة.'
            );
        }
    };
    
    // عمليات السلة
    const CartOperations = {
        add: (productData) => {
            try {
                if (!productData) {
                    Utils.log('بيانات المنتج مفقودة', 'error');
                    return { success: false, message: 'بيانات المنتج غير صحيحة' };
                }
                
                // تنظيف وتحقق من البيانات
                const cleanProduct = {
                    id: Utils.sanitize(productData.id || Utils.generateId()),
                    title: Utils.sanitize(productData.title || productData.name || 'منتج غير معروف'),
                    price: Utils.formatPrice(productData.price || productData.sale_price || 0),
                    sale_price: Utils.formatPrice(productData.sale_price || productData.price || 0),
                    image_link: Utils.sanitize(productData.image_link || productData.image || './assets/images/placeholder.jpg'),
                    type: Utils.sanitize(productData.type || 'PRODUCT'),
                    category: Utils.sanitize(productData.category || 'عام'),
                    source: Utils.sanitize(productData.source || 'unknown'),
                    url: Utils.sanitize(productData.url || productData.detailsUrl || './'),
                    quantity: 1,
                    addedAt: new Date().toISOString(),
                    store: 'متجر هدايا الإمارات'
                };
                
                const cart = Storage.get();
                
                // تحقق من حجم السلة
                if (cart.length >= CONFIG.MAX_CART_SIZE) {
                    Utils.log('السلة ممتلئة', 'warning');
                    return { success: false, message: 'السلة ممتلئة. يرجى إتمام الطلب أولاً.' };
                }
                
                const existingIndex = cart.findIndex(item => item.id === cleanProduct.id);
                
                if (existingIndex !== -1) {
                    // زيادة الكمية
                    const newQuantity = (cart[existingIndex].quantity || 0) + 1;
                    
                    if (newQuantity > CONFIG.MAX_QUANTITY) {
                        return { success: false, message: `الحد الأقصى للكمية ${CONFIG.MAX_QUANTITY}` };
                    }
                    
                    cart[existingIndex].quantity = newQuantity;
                    cart[existingIndex].updatedAt = new Date().toISOString();
                    
                    Utils.log(`زيادة الكمية: ${cleanProduct.title} - ${newQuantity}`, 'info');
                } else {
                    // إضافة منتج جديد
                    cart.push(cleanProduct);
                    Utils.log(`منتج جديد: ${cleanProduct.title}`, 'success');
                }
                
                const saved = Storage.set(cart);
                if (!saved) {
                    return { success: false, message: 'فشل في حفظ المنتج' };
                }
                
                return { success: true, product: cleanProduct, cart: cart };
                
            } catch (error) {
                Utils.log(`خطأ في إضافة المنتج: ${error.message}`, 'error');
                return { success: false, message: 'خطأ غير متوقع. يرجى إعادة المحاولة.' };
            }
        },
        
        remove: (productId) => {
            try {
                const cart = Storage.get();
                const filteredCart = cart.filter(item => item.id !== productId);
                Storage.set(filteredCart);
                
                Utils.log(`تم حذف المنتج: ${productId}`, 'info');
                return { success: true, cart: filteredCart };
                
            } catch (error) {
                Utils.log(`خطأ في حذف المنتج: ${error.message}`, 'error');
                return { success: false, message: 'فشل في حذف المنتج' };
            }
        },
        
        updateQuantity: (productId, quantity) => {
            try {
                const cart = Storage.get();
                const productIndex = cart.findIndex(item => item.id === productId);
                
                if (productIndex === -1) {
                    return { success: false, message: 'لم يتم العثور على المنتج' };
                }
                
                const validQuantity = Math.max(0, Math.min(quantity, CONFIG.MAX_QUANTITY));
                
                if (validQuantity === 0) {
                    return CartOperations.remove(productId);
                }
                
                cart[productIndex].quantity = validQuantity;
                cart[productIndex].updatedAt = new Date().toISOString();
                
                Storage.set(cart);
                Utils.log(`تم تحديث الكمية: ${productId} - ${validQuantity}`, 'info');
                
                return { success: true, cart: cart };
                
            } catch (error) {
                Utils.log(`خطأ في تحديث الكمية: ${error.message}`, 'error');
                return { success: false, message: 'فشل في تحديث الكمية' };
            }
        },
        
        clear: () => {
            try {
                Storage.clear();
                Utils.log('تم محو السلة', 'info');
                return { success: true };
            } catch (error) {
                Utils.log(`خطأ في محو السلة: ${error.message}`, 'error');
                return { success: false, message: 'فشل في محو السلة' };
            }
        },
        
        getStats: () => {
            const cart = Storage.get();
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const totalValue = cart.reduce((sum, item) => 
                sum + ((parseFloat(item.sale_price) || 0) * (item.quantity || 1)), 0
            );
            
            return {
                items: cart.length,
                totalItems,
                totalValue: totalValue.toFixed(2),
                cart
            };
        }
    };
    
    // تحديث عدادات السلة
    function updateCartCounters() {
        try {
            const stats = CartOperations.getStats();
            const selectors = [
                '.cart-counter', '.cart-badge', '#cart-count', 
                '#cartBadge', '.mobile-cart-counter', '#currentCartCount',
                '#cart-items-count', '.header-cart-count'
            ];
            
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        element.textContent = stats.totalItems;
                        element.style.display = stats.totalItems > 0 ? 'flex' : 'none';
                        element.classList.toggle('has-items', stats.totalItems > 0);
                        
                        // تحديث accessibility
                        element.setAttribute('aria-label', `${stats.totalItems} عنصر في السلة`);
                        
                        // إضافة تأثير بصري
                        if (stats.totalItems > 0) {
                            element.style.animation = 'cartBounce 0.5s ease';
                        }
                    }
                });
            });
            
            // تحديث أيقونة السلة
            const cartIcons = document.querySelectorAll('.cart-icon, .header-cart-icon');
            cartIcons.forEach(icon => {
                if (stats.totalItems > 0) {
                    icon.classList.add('has-items');
                } else {
                    icon.classList.remove('has-items');
                }
            });
            
            Utils.log(`تم تحديث عدادات السلة: ${stats.totalItems} عنصر`, 'success');
            
        } catch (error) {
            Utils.log(`خطأ في تحديث عدادات السلة: ${error.message}`, 'error');
        }
    }
    
    // معالج نقر زر إضافة للسلة
    function handleAddToCartClick(button, productData = null) {
        if (!button) return;
        
        if (button.disabled || button.classList.contains('processing')) {
            Utils.log('الزر معطل أو قيد المعالجة', 'warning');
            return;
        }
        
        Utils.log('بدء معالجة إضافة للسلة', 'info');
        
        // حفظ البيانات الأصلية
        const originalState = {
            html: button.innerHTML,
            style: button.style.cssText,
            disabled: button.disabled,
            className: button.className
        };
        
        // تفعيل وضع المعالجة
        button.classList.add('processing');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارِ الإضافة...';
        button.style.background = '#95a5a6';
        button.style.transform = 'scale(0.95)';
        button.style.pointerEvents = 'none';
        
        setTimeout(() => {
            // استخراج بيانات المنتج
            const extractedData = productData || extractProductData(button);
            
            if (!extractedData) {
                Utils.log('فشل في استخراج بيانات المنتج', 'error');
                restoreButton(button, originalState, 'error');
                Notifications.error('لم يتم العثور على بيانات المنتج');
                return;
            }
            
            // محاولة إضافة المنتج
            const result = CartOperations.add(extractedData);
            
            if (result.success) {
                // نجحت العملية
                button.innerHTML = '<i class="fas fa-check"></i> تم الإضافة!';
                button.style.background = '#25D366';
                button.style.color = 'white';
                button.style.transform = 'scale(1)';
                
                updateCartCounters();
                Notifications.success(extractedData.title);
                
                // عودة الزر للوضع الطبيعي
                setTimeout(() => restoreButton(button, originalState, 'success'), 3000);
                
            } else {
                // فشلت العملية
                restoreButton(button, originalState, 'error');
                Notifications.error(result.message);
            }
            
        }, CONFIG.PROCESS_DELAY);
    }
    
    // استخراج بيانات المنتج
    function extractProductData(button) {
        try {
            // محاولة من data-product
            const dataProduct = button.getAttribute('data-product');
            if (dataProduct) {
                try {
                    return JSON.parse(dataProduct);
                } catch (e) {
                    Utils.log('خطأ في تحليل data-product', 'warning');
                }
            }
            
            // محاولة من attributes
            const productId = button.getAttribute('data-product-id') || 
                           button.getAttribute('data-id');
            
            if (productId) {
                const productType = button.getAttribute('data-product-type') || 'PRODUCT';
                
                return {
                    id: productId,
                    title: `منتج ${productType === 'PERFUME' ? 'عطر' : productType === 'WATCH' ? 'ساعة' : ''} من هدايا الإمارات`,
                    type: productType,
                    price: '99.00',
                    sale_price: '89.00'
                };
            }
            
            // محاولة من البطاقة المحيطة
            const card = button.closest('.product-card, .product-item, [data-product-id]');
            if (card) {
                const title = card.querySelector('.product-title, .title, h3, h2, h4')?.textContent?.trim();
                const priceElement = card.querySelector('.current-price, .sale-price, .price');
                const originalPriceElement = card.querySelector('.original-price, .old-price');
                const imageElement = card.querySelector('img');
                
                const price = priceElement ? 
                    priceElement.textContent.replace(/[^0-9.]/g, '') || '99' : '99';
                const originalPrice = originalPriceElement ? 
                    originalPriceElement.textContent.replace(/[^0-9.]/g, '') || price : price;
                const image = imageElement ? imageElement.src || imageElement.dataset.src : '';
                
                return {
                    id: card.getAttribute('data-product-id') || 
                        card.getAttribute('data-id') || 
                        card.id || 
                        Utils.generateId(),
                    title: title || 'منتج من هدايا الإمارات',
                    price: originalPrice,
                    sale_price: price,
                    image_link: image,
                    type: card.getAttribute('data-product-type') || 'PRODUCT',
                    category: card.getAttribute('data-category') || 'عام',
                    source: card.getAttribute('data-source') || 'manual'
                };
            }
            
            // بيانات افتراضية
            return {
                id: 'default-' + Utils.generateId(),
                title: 'منتج من هدايا الإمارات',
                price: '99.00',
                sale_price: '89.00',
                type: 'PRODUCT',
                category: 'عام'
            };
            
        } catch (error) {
            Utils.log(`خطأ في استخراج بيانات المنتج: ${error.message}`, 'error');
            return null;
        }
    }
    
    // عودة الزر للحالة الأصلية
    function restoreButton(button, originalState, result) {
        if (result === 'success') {
            button.innerHTML = '<i class="fas fa-check"></i> تم الإضافة!';
            button.style.background = '#25D366';
            button.style.color = 'white';
            button.style.transform = 'scale(1)';
            
            setTimeout(() => {
                button.innerHTML = originalState.html;
                button.style.cssText = originalState.style;
                button.disabled = originalState.disabled;
                button.className = originalState.className;
            }, 2500);
            
        } else {
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> حاول مرة أخرى';
            button.style.background = '#e74c3c';
            button.style.color = 'white';
            button.style.transform = 'scale(1)';
            
            setTimeout(() => {
                button.innerHTML = originalState.html;
                button.style.cssText = originalState.style;
                button.disabled = originalState.disabled;
                button.className = originalState.className;
            }, 3000);
        }
    }
    
    // إضافة CSS محسّن
    function addEnhancedCartCSS() {
        if (document.querySelector('#enhanced-cart-css')) return;
        
        const style = document.createElement('style');
        style.id = 'enhanced-cart-css';
        style.textContent = `
            @keyframes slideInNotification {
                from { transform: translateX(100%) scale(0.8); opacity: 0; }
                to { transform: translateX(0) scale(1); opacity: 1; }
            }
            
            @keyframes slideOutNotification {
                from { transform: translateX(0) scale(1); opacity: 1; }
                to { transform: translateX(100%) scale(0.8); opacity: 0; }
            }
            
            @keyframes iconBounce {
                0% { transform: scale(0) rotate(-45deg); }
                50% { transform: scale(1.3) rotate(5deg); }
                100% { transform: scale(1) rotate(0deg); }
            }
            
            @keyframes cartBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            
            .cart-counter, .cart-badge {
                position: absolute;
                top: -8px;
                left: -8px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                min-width: 20px;
                height: 20px;
                font-size: 11px;
                font-weight: bold;
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 2;
                transition: all 0.3s ease;
                padding: 2px 4px;
                line-height: 1;
            }
            
            .cart-counter.has-items, .cart-badge.has-items {
                display: flex !important;
                animation: cartBounce 0.5s ease;
            }
            
            .processing {
                pointer-events: none !important;
                opacity: 0.8 !important;
            }
            
            .cart-icon.has-items {
                animation: cartShake 0.6s ease;
            }
            
            @keyframes cartShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-3px); }
                75% { transform: translateX(3px); }
            }
            
            /* تحسينات الجوال */
            @media (max-width: 768px) {
                .cart-notification {
                    right: 10px !important;
                    left: 10px !important;
                    max-width: none !important;
                    top: 70px !important;
                }
                
                .cart-counter, .cart-badge {
                    font-size: 10px;
                    min-width: 18px;
                    height: 18px;
                }
            }
            
            /* تحسينات الحركة المخفضة */
            @media (prefers-reduced-motion: reduce) {
                .cart-notification {
                    animation: none !important;
                }
                
                .cart-counter.has-items, .cart-badge.has-items {
                    animation: none !important;
                }
                
                .cart-icon.has-items {
                    animation: none !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // تهيئة مستمعي الأحداث
    function initEventListeners() {
        // تفويض الأحداث للأزرار الديناميكية
        document.addEventListener('click', function(e) {
            const button = e.target.closest(
                '.btn-add-to-cart, .btn-add-cart, .add-to-cart-btn, .add-cart-btn, [data-action="add-to-cart"], [onclick*="addToCart"], [onclick*="addProduct"]'
            );
            
            if (button && !button.classList.contains('processing')) {
                e.preventDefault();
                e.stopPropagation();
                
                Utils.log('تم النقر على زر إضافة للسلة', 'info');
                handleAddToCartClick(button);
            }
        }, true);
        
        // دعم لوحة المفاتيح
        document.addEventListener('keydown', function(e) {
            const button = e.target.closest(
                '.btn-add-to-cart, .btn-add-cart, .add-to-cart-btn, .add-cart-btn'
            );
            
            if (button && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleAddToCartClick(button);
            }
        });
        
        Utils.log('تم تفعيل مستمعي الأحداث', 'success');
    }
    
    // تهيئة النظام
    function initCartSystem() {
        Utils.log(`بدء تهيئة نظام السلة v${CONFIG.version}`, 'info');
        
        try {
            addEnhancedCartCSS();
            updateCartCounters();
            initEventListeners();
            
            Utils.log('تم تهيئة نظام السلة بنجاح', 'success');
            
        } catch (error) {
            Utils.log(`خطأ في تهيئة النظام: ${error.message}`, 'error');
        }
    }
    
    // تصدير عام
    window.EmiratesCartSystem = {
        version: CONFIG.version,
        add: CartOperations.add,
        remove: CartOperations.remove,
        clear: CartOperations.clear,
        updateQuantity: CartOperations.updateQuantity,
        getStats: CartOperations.getStats,
        updateCounters: updateCartCounters,
        handleButtonClick: handleAddToCartClick,
        config: CONFIG
    };
    
    // وظائف عامة للاستخدام الخارجي
    window.addToCart = function(productData) {
        const result = CartOperations.add(productData);
        if (result.success) {
            updateCartCounters();
            Notifications.success(productData.title || 'منتج');
        } else {
            Notifications.error(result.message);
        }
        return result.success;
    };
    
    window.updateCartCounter = updateCartCounters;
    window.showSuccessNotification = Notifications.success;
    window.showErrorNotification = Notifications.error;
    
    // تفعيل عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartSystem);
    } else {
        initCartSystem();
    }
    
    // مستمعي إضافيين
    window.addEventListener('storage', function(e) {
        if (e.key === CONFIG.STORAGE_KEY) {
            updateCartCounters();
        }
    });
    
    window.addEventListener('pageshow', function() {
        updateCartCounters();
    });
    
    Utils.log(`نظام السلة v${CONFIG.version} جاهز للعمل`, 'success');
    
})();