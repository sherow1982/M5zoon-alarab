// نظام بطاقات المنتجات المحسن - متجر هدايا الإمارات
// أزرار أيقونية + وظائف متقدمة + فتح في تبويب جديد + أوصاف تلقائية

class EnhancedProductCards {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceExistingCards();
        this.observeNewCards();
        this.addCardStyles();
        console.log('🎴 تم تفعيل نظام بطاقات المنتجات المحسن');
    }

    enhanceExistingCards() {
        document.querySelectorAll('.product-card, .product-item').forEach(card => {
            this.enhanceCard(card);
        });
    }

    observeNewCards() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // تحسين العنصر الجديد
                        if (node.classList?.contains('product-card') || node.classList?.contains('product-item')) {
                            this.enhanceCard(node);
                        }
                        
                        // فحص العناصر الفرعية
                        node.querySelectorAll?.('.product-card, .product-item').forEach(card => {
                            this.enhanceCard(card);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    enhanceCard(card) {
        if (card.dataset.enhanced === 'true') return;
        card.dataset.enhanced = 'true';

        // ضمان وسطية المحتوى
        this.centerCardContent(card);
        
        // ضمان وجود وصف للمنتج
        this.ensureProductDescription(card);
        
        // تحويل الأزرار لأيقونات
        this.convertButtonsToIcons(card);
        
        // إضافة وظيفة فتح في تبويب جديد
        this.addNewTabFunctionality(card);
        
        // تحسين مظهر البطاقة
        this.improveCardAppearance(card);
    }

    centerCardContent(card) {
        card.style.textAlign = 'center';
        
        // وسطية جميع العناصر النصية
        const textElements = card.querySelectorAll('.product-name, .product-title, .product-price, .product-description, .rating-info');
        textElements.forEach(element => {
            element.style.textAlign = 'center';
            element.style.margin = '0 auto';
        });
    }

    ensureProductDescription(card) {
        let description = card.querySelector('.product-description, .product-desc');
        
        if (!description || !description.textContent?.trim()) {
            if (!description) {
                description = document.createElement('div');
                description.className = 'product-description';
                
                // إدراج الوصف في المكان المناسب
                const priceElement = card.querySelector('.product-price, .price');
                if (priceElement) {
                    priceElement.parentNode.insertBefore(description, priceElement);
                } else {
                    card.appendChild(description);
                }
            }
            
            // توليد وصف مناسب حسب نوع المنتج
            const productName = card.querySelector('.product-name, .product-title')?.textContent?.toLowerCase() || '';
            
            if (productName.includes('عطر') || productName.includes('perfume') || productName.includes('cologne')) {
                description.innerHTML = `
                    <p style="font-size: 0.85rem; color: #666; margin: 8px 0; line-height: 1.4;">
                        عطر فاخر بتركيبة عالية الجودة ورائحة مميزة تدوم طويلاً بأناقة وجاذبية
                    </p>
                `;
            } else if (productName.includes('ساعة') || productName.includes('watch')) {
                description.innerHTML = `
                    <p style="font-size: 0.85rem; color: #666; margin: 8px 0; line-height: 1.4;">
                        ساعة عالية الجودة بتصميم أنيق ومواصفات احترافية مناسبة لجميع المناسبات
                    </p>
                `;
            } else if (productName.includes('مجوهرات') || productName.includes('jewelry')) {
                description.innerHTML = `
                    <p style="font-size: 0.85rem; color: #666; margin: 8px 0; line-height: 1.4;">
                        قطعة مجوهرات عالية الجودة بحرفية متقنة وتصميم عصري أنيق
                    </p>
                `;
            } else {
                description.innerHTML = `
                    <p style="font-size: 0.85rem; color: #666; margin: 8px 0; line-height: 1.4;">
                        منتج عالي الجودة بمواصفات ممتازة وتصميم مميز بأفضل الأسعار
                    </p>
                `;
            }
        }
    }

    convertButtonsToIcons(card) {
        // بحث عن حاوي الأزرار أو إنشاؤه
        let actionsContainer = card.querySelector('.card-actions, .product-actions, .buttons-container');
        
        if (!actionsContainer) {
            actionsContainer = document.createElement('div');
            actionsContainer.className = 'card-actions-container';
            card.appendChild(actionsContainer);
        }
        
        // حذف الأزرار القديمة
        const oldButtons = card.querySelectorAll('button, .btn:not(.icon-btn)');
        oldButtons.forEach(btn => {
            if (!btn.classList.contains('icon-btn')) {
                btn.remove();
            }
        });
        
        // إنشاء أزرار أيقونية جديدة
        const iconButtons = this.createIconButtons(card);
        actionsContainer.innerHTML = iconButtons;
        
        // ربط الوظائف
        this.attachButtonFunctions(card);
    }

    createIconButtons(card) {
        const productData = this.extractProductData(card);
        
        return `
            <div class="icon-buttons-row">
                <!-- زر إضافة للسلة -->
                <button class="icon-btn cart-icon-btn add-to-cart-btn" 
                        data-product-id="${productData.id}"
                        data-product-name="${productData.name}"
                        data-product-price="${productData.price}"
                        title="أضف للسلة">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="btn-tooltip">أضف للسلة</span>
                </button>
                
                <!-- زر اطلب فوراً -->
                <button class="icon-btn order-now-icon-btn order-now-btn" 
                        data-product-id="${productData.id}"
                        data-product-name="${productData.name}"
                        data-product-price="${productData.price}"
                        title="اطلب فوراً" 
                        style="background: linear-gradient(135deg, #25D366, #20B358); color: white; border-color: #25D366;">
                    <i class="fas fa-bolt"></i>
                    <span class="btn-tooltip">اطلب فوراً</span>
                </button>
                
                <!-- زر واتساب -->
                <button class="icon-btn whatsapp-icon-btn" 
                        data-product-id="${productData.id}"
                        data-product-name="${productData.name}"
                        data-product-price="${productData.price}"
                        title="طلب عبر واتساب" 
                        style="background: #25D366; color: white; border-color: #25D366;">
                    <i class="fab fa-whatsapp"></i>
                    <span class="btn-tooltip">طلب عبر واتساب</span>
                </button>
                
                <!-- زر عرض تفاصيل -->
                <button class="icon-btn details-icon-btn" 
                        data-product-url="${productData.url}"
                        title="عرض التفاصيل">
                    <i class="fas fa-eye"></i>
                    <span class="btn-tooltip">عرض التفاصيل</span>
                </button>
            </div>
        `;
    }

    extractProductData(card) {
        const nameEl = card.querySelector('.product-name, .product-title, h3, h4');
        const priceEl = card.querySelector('.product-price, .price, .current-price');
        const linkEl = card.querySelector('a[href*="products/"], a[href*="product-"]');
        const imageEl = card.querySelector('.product-image img, img');
        
        const productId = card.dataset?.productId || 
                         linkEl?.href?.split('/').pop()?.replace('.html', '') ||
                         Math.random().toString(36).substr(2, 9);
        
        return {
            id: productId,
            name: nameEl?.textContent?.trim() || 'منتج مميز',
            price: this.extractPrice(priceEl?.textContent || '0'),
            priceText: priceEl?.textContent?.trim() || '0 درهم',
            url: linkEl?.href || '#',
            image: imageEl?.src || '/images/placeholder.jpg'
        };
    }

    extractPrice(priceText) {
        const match = priceText.match(/([\d,]+(?:\.\d+)?)/g);
        return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    }

    attachButtonFunctions(card) {
        // وظيفة إضافة للسلة
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.addToCart(addToCartBtn);
            });
        }
        
        // وظيفة اطلب فوراً
        const orderNowBtn = card.querySelector('.order-now-btn');
        if (orderNowBtn) {
            orderNowBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.orderNow(orderNowBtn);
            });
        }
        
        // وظيفة واتساب
        const whatsappBtn = card.querySelector('.whatsapp-icon-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.sendWhatsAppMessage(whatsappBtn);
            });
        }
        
        // وظيفة عرض تفاصيل
        const detailsBtn = card.querySelector('.details-icon-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.openProductDetails(detailsBtn);
            });
        }
    }

    addNewTabFunctionality(card) {
        // جعل البطاقة قابلة للنقر
        card.style.cursor = 'pointer';
        
        const productLink = card.querySelector('a[href*="products/"], a[href*="product-"]');
        
        if (productLink) {
            productLink.target = '_blank';
            
            // إضافة وظيفة النقر على البطاقة
            card.addEventListener('click', (e) => {
                // تجنب فتح الرابط عند الضغط على الأزرار
                if (e.target.closest('.icon-btn, button, .btn')) {
                    return;
                }
                
                e.preventDefault();
                window.open(productLink.href, '_blank');
            });
            
            // أيضاً عند الضغط على الصورة
            const productImage = card.querySelector('.product-image, img');
            if (productImage) {
                productImage.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(productLink.href, '_blank');
                });
                productImage.style.cursor = 'pointer';
            }
        }
    }

    improveCardAppearance(card) {
        // تحسين مظهر البطاقة
        card.style.cssText += `
            transition: all 0.3s ease;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        `;
        
        // تأثير hover محسن
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
    }

    // وظائف الأزرار
    addToCart(button) {
        const productData = {
            id: button.dataset.productId,
            name: button.dataset.productName,
            price: parseFloat(button.dataset.productPrice) || 0,
            priceText: button.dataset.productPrice + ' درهم',
            image: button.closest('.product-card')?.querySelector('img')?.src || '/images/placeholder.jpg',
            quantity: 1,
            timestamp: new Date().toISOString()
        };
        
        // إضافة للسلة
        if (window.EmiratesCart) {
            window.EmiratesCart.addToCartQuick(productData);
        } else {
            // استخدام النظام التقليدي
            this.addToCartFallback(productData);
        }
        
        // تأثير بصري
        this.animateButton(button, 'success');
    }

    orderNow(button) {
        const productData = {
            id: button.dataset.productId,
            name: button.dataset.productName,
            price: parseFloat(button.dataset.productPrice) || 0,
            priceText: button.dataset.productPrice + ' درهم',
            image: button.closest('.product-card')?.querySelector('img')?.src || '/images/placeholder.jpg',
            quantity: 1,
            timestamp: new Date().toISOString()
        };
        
        if (window.EmiratesCart) {
            window.EmiratesCart.orderNow(productData);
        } else {
            // إضافة للسلة وانتقال
            this.addToCartFallback(productData);
            setTimeout(() => {
                window.open('./cart.html', '_blank');
            }, 1000);
        }
        
        this.animateButton(button, 'order');
    }

    sendWhatsAppMessage(button) {
        const productName = button.dataset.productName;
        const productPrice = button.dataset.productPrice;
        
        const message = `مرحباً! أريد الاستفسار عن هذا المنتج:

🎁 اسم المنتج: ${productName}
💰 السعر: ${productPrice} درهم

أريد معرفة المزيد من التفاصيل وإمكانية الشراء.`;
        
        const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        this.animateButton(button, 'whatsapp');
    }

    openProductDetails(button) {
        const productUrl = button.dataset.productUrl;
        if (productUrl && productUrl !== '#') {
            window.open(productUrl, '_blank');
        }
        
        this.animateButton(button, 'details');
    }

    addToCartFallback(productData) {
        // نظام بديل للسلة
        let cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
        
        const existingIndex = cart.findIndex(item => item.id === productData.id);
        if (existingIndex > -1) {
            cart[existingIndex].quantity++;
        } else {
            cart.push(productData);
        }
        
        localStorage.setItem('emirates_shopping_cart', JSON.stringify(cart));
        
        // تحديث عداد السلة
        this.updateCartCounters();
        
        // إشعار
        this.showNotification(`تم إضافة "${productData.name}" للسلة`);
    }

    updateCartCounters() {
        const cart = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        document.querySelectorAll('.cart-counter, .cart-badge').forEach(counter => {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    animateButton(button, type) {
        const colors = {
            success: '#25D366',
            order: '#D4AF37', 
            whatsapp: '#25D366',
            details: '#007bff'
        };
        
        const originalBg = button.style.background;
        const originalTransform = button.style.transform;
        
        button.style.background = colors[type] || colors.success;
        button.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            button.style.background = originalBg;
            button.style.transform = originalTransform;
        }, 300);
    }

    showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `product-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            </div>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${type === 'success' ? '#25D366' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.4s ease;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, duration);
    }

    addCardStyles() {
        const style = document.createElement('style');
        style.id = 'enhanced-product-cards-styles';
        style.textContent = `
            .card-actions-container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                margin-top: 15px;
                padding: 10px 0;
                flex-wrap: wrap;
            }
            
            .icon-buttons-row {
                display: flex;
                gap: 8px;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .icon-btn {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                border: 2px solid #ddd;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                font-size: 1.2rem;
                color: #666;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .icon-btn:hover {
                background: #D4AF37;
                border-color: #D4AF37;
                color: white;
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
            }
            
            .icon-btn.cart-icon-btn:hover {
                background: #D4AF37;
                border-color: #D4AF37;
            }
            
            .icon-btn.order-now-icon-btn:hover {
                background: linear-gradient(135deg, #20B358, #1e8449) !important;
                border-color: #20B358;
                box-shadow: 0 6px 20px rgba(32, 179, 88, 0.4);
            }
            
            .icon-btn.whatsapp-icon-btn:hover {
                background: #20B358 !important;
                border-color: #20B358;
                box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
            }
            
            .icon-btn.details-icon-btn:hover {
                background: #007bff;
                border-color: #007bff;
                box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
            }
            
            .btn-tooltip {
                position: absolute;
                bottom: -40px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 0.75rem;
                opacity: 0;
                transition: all 0.3s ease;
                white-space: nowrap;
                z-index: 1001;
                font-weight: 600;
                pointer-events: none;
            }
            
            .icon-btn:hover .btn-tooltip {
                opacity: 1;
                bottom: -35px;
            }
            
            .product-card {
                text-align: center !important;
                position: relative;
                overflow: visible;
            }
            
            .product-card .product-name,
            .product-card .product-title,
            .product-card .product-price,
            .product-card .product-description {
                text-align: center !important;
                margin-left: auto;
                margin-right: auto;
            }
            
            .product-description {
                font-size: 0.85rem !important;
                color: #666 !important;
                margin: 8px 0 !important;
                line-height: 1.4 !important;
                text-align: center !important;
                padding: 0 10px;
            }
            
            /* انيميشن الإشعارات */
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-icon {
                font-size: 1.3rem;
                opacity: 0.9;
            }
            
            /* تحسينات للهواتف */
            @media (max-width: 768px) {
                .icon-btn {
                    width: 42px;
                    height: 42px;
                    font-size: 1.1rem;
                }
                
                .card-actions-container {
                    gap: 6px;
                    margin-top: 12px;
                }
                
                .btn-tooltip {
                    font-size: 0.7rem;
                    padding: 4px 8px;
                }
            }
            
            @media (max-width: 480px) {
                .icon-btn {
                    width: 38px;
                    height: 38px;
                    font-size: 1rem;
                }
            }
        `;
        
        if (!document.getElementById('enhanced-product-cards-styles')) {
            document.head.appendChild(style);
        }
    }

    // وظيفة عامة لتحسين جميع البطاقات
    enhanceAllCards() {
        document.querySelectorAll('.product-card, .product-item').forEach(card => {
            card.dataset.enhanced = 'false'; // إعادة تعيين
            this.enhanceCard(card);
        });
        
        console.log('🔄 تم تحسين جميع بطاقات المنتجات');
    }
}

// تفعيل النظام عند تحميل الصفحة
const enhancedProductCards = new EnhancedProductCards();

// تصدير للاستخدام العام
window.EnhancedProductCards = EnhancedProductCards;
window.enhancedProductCards = enhancedProductCards;

// اختصار لوحة مفاتيح للتحسين اليدوي
// Ctrl+Alt+E لتحسين جميع البطاقات
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        enhancedProductCards.enhanceAllCards();
        alert('✅ تم تحسين جميع بطاقات المنتجات!');
    }
});