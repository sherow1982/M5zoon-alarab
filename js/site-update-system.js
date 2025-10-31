// نظام تحديث الموقع الشامل - متجر هدايا الإمارات
// إزالة كلمة "أصلي" + تصحيح التقييمات + أزرار ايقونية + تحسينات الشحن والإرجاع

class SiteUpdateSystem {
    constructor() {
        this.init();
    }

    init() {
        // إزالة كلمات "أصلي" من النصوص
        this.removeOriginalWords();
        
        // تحسين بطاقات المنتجات 
        this.enhanceProductCards();
        
        // تحديث معلومات الشحن والإرجاع
        this.updateShippingReturns();
        
        // إضافة مفتاح تشغيل إشعارات المبيعات
        this.setupSalesNotificationToggle();
        
        // تصحيح التقييمات حسب فئة المنتج
        this.fixProductReviewsMapping();
        
        // تحسين وسطية المحتوى في البطاقات
        this.centerProductCardContent();
        
        // إضافة وظائف الفتح في تبويب جديد
        this.addNewTabFunctionality();
        
        // تثبيت أوصاف المنتجات
        this.ensureProductDescriptions();
    }

    // إزالة كلمات "أصلي" من جميع النصوص
    removeOriginalWords() {
        const elementsToCheck = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'div', 'a', 'button',
            '.product-title', '.product-description', 
            '.product-name', '.breadcrumb'
        ];

        elementsToCheck.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (element.textContent && element.textContent.includes('أصلي')) {
                    element.textContent = element.textContent.replace(/\bأصلي\b/g, 'عالي الجودة');
                    element.innerHTML = element.innerHTML.replace(/\bأصلي\b/g, 'عالي الجودة');
                }
                
                // تحديث الروابط التي تحتوي على "أصلي"
                if (element.href && element.href.includes('أصلي')) {
                    element.href = element.href.replace(/أصلي/g, 'عالي-الجودة');
                }
            });
        });

        // تحديث عناوين الصفحات
        if (document.title.includes('أصلي')) {
            document.title = document.title.replace(/\bأصلي\b/g, 'عالي الجودة');
        }

        // تحديث الـ meta descriptions
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && metaDesc.content.includes('أصلي')) {
            metaDesc.content = metaDesc.content.replace(/\bأصلي\b/g, 'عالي الجودة');
        }
    }

    // تحسين بطاقات المنتجات مع أزرار ايقونية
    enhanceProductCards() {
        document.querySelectorAll('.product-card, .product-item').forEach(card => {
            // تحسين الأزرار لتصبح ايقونية
            this.convertButtonsToIcons(card);
            
            // إضافة وظيفة النقر على البطاقة كاملة
            this.makeCardClickable(card);
            
            // تحسين التخطيط والمحتوى
            this.improveCardLayout(card);
        });
    }

    convertButtonsToIcons(card) {
        // تحويل زر "اطلب فوراً" إلى أيقونة سلة التسوق
        const orderBtn = card.querySelector('.order-btn, .buy-now-btn, .quick-order');
        if (orderBtn) {
            orderBtn.innerHTML = `
                <i class="fas fa-shopping-cart" title="أضف للسلة"></i>
                <span class="btn-tooltip">أضف للسلة</span>
            `;
            orderBtn.classList.add('icon-btn', 'cart-icon-btn');
            
            // إضافة وظيفة إضافة للسلة ثم الانتقال
            orderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addToCartAndRedirect(card);
            });
        }

        // تحويل زر "عرض التفاصيل" إلى أيقونة عين
        const viewBtn = card.querySelector('.view-details-btn, .details-btn');
        if (viewBtn) {
            viewBtn.innerHTML = `
                <i class="fas fa-eye" title="عرض التفاصيل"></i>
                <span class="btn-tooltip">عرض التفاصيل</span>
            `;
            viewBtn.classList.add('icon-btn', 'view-icon-btn');
        }

        // تحويل زر "إضافة للمفضلة" إلى أيقونة قلب
        const wishBtn = card.querySelector('.wishlist-btn, .favorite-btn');
        if (wishBtn) {
            wishBtn.innerHTML = `
                <i class="fas fa-heart" title="إضافة للمفضلة"></i>
                <span class="btn-tooltip">إضافة للمفضلة</span>
            `;
            wishBtn.classList.add('icon-btn', 'wish-icon-btn');
        }

        // تحويل زر "مقارنة" إلى أيقونة مقارنة
        const compareBtn = card.querySelector('.compare-btn');
        if (compareBtn) {
            compareBtn.innerHTML = `
                <i class="fas fa-balance-scale" title="إضافة للمقارنة"></i>
                <span class="btn-tooltip">مقارنة</span>
            `;
            compareBtn.classList.add('icon-btn', 'compare-icon-btn');
        }
    }

    addToCartAndRedirect(card) {
        const productData = this.extractProductData(card);
        
        // إضافة للسلة
        this.addToCart(productData);
        
        // عرض إشعار نجاح
        this.showSuccessNotification('تم إضافة المنتج للسلة بنجاح!');
        
        // الانتقال للسلة بعد ثانيتين
        setTimeout(() => {
            window.open('cart.html', '_blank');
        }, 1500);
    }

    extractProductData(card) {
        return {
            id: card.dataset.productId || Math.random().toString(36),
            name: card.querySelector('.product-name, .product-title')?.textContent?.trim() || 'منتج',
            price: card.querySelector('.product-price, .price')?.textContent?.trim() || '0',
            image: card.querySelector('.product-image img')?.src || '',
            quantity: 1
        };
    }

    addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('shopping_cart') || '[]');
        
        // البحث عن المنتج في السلة
        const existingIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('shopping_cart', JSON.stringify(cart));
        
        // تحديث عداد السلة
        this.updateCartCounter();
    }

    updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('shopping_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-counter, .cart-count').forEach(counter => {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    makeCardClickable(card) {
        const productLink = card.querySelector('a[href*="products/"], .product-link');
        if (!productLink) return;
        
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            // تجنب التفعيل عند النقر على الأزرار
            if (e.target.closest('button, .btn, .icon-btn')) return;
            
            // فتح صفحة المنتج في تبويب جديد
            window.open(productLink.href, '_blank');
        });
    }

    improveCardLayout(card) {
        // التأكد من وسطية المحتوى
        card.style.textAlign = 'center';
        
        // تحسين تنسيق العناصر الداخلية
        const productName = card.querySelector('.product-name, .product-title');
        if (productName) {
            productName.style.textAlign = 'center';
            productName.style.margin = '10px auto';
        }
        
        const productPrice = card.querySelector('.product-price, .price');
        if (productPrice) {
            productPrice.style.textAlign = 'center';
            productPrice.style.fontWeight = 'bold';
        }
        
        // تجميع الأزرار في حاوية مرنة
        const buttons = card.querySelectorAll('.icon-btn');
        if (buttons.length > 0) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'card-actions-container';
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 15px;
                flex-wrap: wrap;
            `;
            
            buttons.forEach(btn => {
                buttonContainer.appendChild(btn.cloneNode(true));
                btn.remove();
            });
            
            card.appendChild(buttonContainer);
        }
    }

    // تحديث معلومات الشحن والإرجاع في كامل الموقع
    updateShippingReturns() {
        // تحديث نصوص الشحن
        const shippingElements = document.querySelectorAll(
            '.shipping-info, .delivery-info, [data-shipping], .shipping-text'
        );
        
        shippingElements.forEach(element => {
            let text = element.textContent;
            
            // تحديث مدة الشحن
            text = text.replace(/خلال \d+(-\d+)? (يوم|أيام)/g, 'خلال 1-3 أيام عمل');
            text = text.replace(/التسليم في \d+(-\d+)? (يوم|أيام)/g, 'التسليم خلال 1-3 أيام عمل');
            text = text.replace(/شحن في \d+(-\d+)? (يوم|أيام)/g, 'شحن خلال 1-3 أيام عمل');
            
            element.textContent = text;
        });

        // تحديث نصوص الإرجاع
        const returnElements = document.querySelectorAll(
            '.return-info, .refund-info, [data-return], .return-text'
        );
        
        returnElements.forEach(element => {
            let text = element.textContent;
            
            // تحديث مدة الإرجاع ومصاريف الشحن
            text = text.replace(/إرجاع خلال \d+ (يوم|أيام)/g, 'إرجاع خلال 14 يوم + مصاريف الشحن');
            text = text.replace(/ضمان الإرجاع \d+ (يوم|أيام)/g, 'ضمان الإرجاع 14 يوم + مصاريف الشحن');
            text = text.replace(/استرداد في \d+ (يوم|أيام)/g, 'استرداد خلال 14 يوم + مصاريف الشحن');
            
            element.textContent = text;
        });

        // إنشاء عناصر جديدة للشحن والإرجاع إذا لم توجد
        this.createShippingReturnInfo();
    }

    createShippingReturnInfo() {
        // إضافة معلومات الشحن والإرجاع للمنتجات
        document.querySelectorAll('.product-card, .product-item').forEach(card => {
            if (!card.querySelector('.shipping-return-info')) {
                const infoDiv = document.createElement('div');
                infoDiv.className = 'shipping-return-info';
                infoDiv.innerHTML = `
                    <div class="shipping-info">
                        <i class="fas fa-shipping-fast"></i>
                        <span>شحن خلال 1-3 أيام عمل</span>
                    </div>
                    <div class="return-info">
                        <i class="fas fa-undo"></i>
                        <span>إرجاع خلال 14 يوم + مصاريف الشحن</span>
                    </div>
                `;
                infoDiv.style.cssText = `
                    font-size: 0.8rem;
                    margin-top: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    color: #666;
                `;
                
                card.appendChild(infoDiv);
            }
        });
    }

    // إعداد مفتاح تشغيل/إيقاف إشعارات المبيعات للـ A/B Testing
    setupSalesNotificationToggle() {
        // إنشاء واجهة التحكم
        if (!document.querySelector('.sales-notification-toggle')) {
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'sales-notification-toggle';
            toggleContainer.innerHTML = `
                <div class="admin-controls" style="
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 10px;
                    border-radius: 8px;
                    z-index: 10000;
                    display: none;
                ">
                    <label>
                        <input type="checkbox" id="salesNotificationToggle" ${this.getSalesNotificationStatus() ? 'checked' : ''}>
                        تفعيل إشعارات المبيعات (A/B Test)
                    </label>
                </div>
            `;
            
            document.body.appendChild(toggleContainer);
            
            // إظهار لوحة التحكم عند الضغط على Ctrl+Alt+S
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.altKey && e.key === 's') {
                    const adminControls = document.querySelector('.admin-controls');
                    adminControls.style.display = adminControls.style.display === 'none' ? 'block' : 'none';
                }
            });
            
            // حفظ الإعدادات عند التغيير
            document.getElementById('salesNotificationToggle').addEventListener('change', (e) => {
                localStorage.setItem('sales_notifications_enabled', e.target.checked);
                this.toggleSalesNotifications(e.target.checked);
            });
        }
        
        // تطبيق الإعدادات الحالية
        this.toggleSalesNotifications(this.getSalesNotificationStatus());
    }

    getSalesNotificationStatus() {
        return localStorage.getItem('sales_notifications_enabled') !== 'false';
    }

    toggleSalesNotifications(enabled) {
        if (enabled) {
            this.startSalesNotifications();
        } else {
            this.stopSalesNotifications();
        }
    }

    startSalesNotifications() {
        // بدء إشعارات المبيعات كل 15-30 ثانية
        if (!this.salesNotificationInterval) {
            this.salesNotificationInterval = setInterval(() => {
                this.showSalesNotification();
            }, Math.random() * 15000 + 15000); // 15-30 ثانية
        }
    }

    stopSalesNotifications() {
        if (this.salesNotificationInterval) {
            clearInterval(this.salesNotificationInterval);
            this.salesNotificationInterval = null;
        }
    }

    showSalesNotification() {
        const notifications = [
            '🛍️ أحمد من دبي اشترى ساعة رولكس قبل 3 دقائق',
            '🎁 فاطمة من أبوظبي اشترت عطر شانيل قبل 5 دقائق', 
            '⌚ محمد من الشارقة اشترى ساعة أوميغا قبل دقيقتين',
            '💎 نورا من العين اشترت مجوهرات ذهبية قبل 4 دقائق',
            '🌹 عائشة من رأس الخيمة اشترت عطر توم فورد قبل 6 دقائق'
        ];
        
        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        this.showSuccessNotification(notification, 5000);
    }

    // تصحيح ربط التقييمات بفئات المنتجات الصحيحة
    fixProductReviewsMapping() {
        document.querySelectorAll('.product-card, .product-item').forEach(card => {
            const productCategory = this.detectProductCategory(card);
            const reviewsContainer = card.querySelector('.product-reviews, .reviews-section');
            
            if (reviewsContainer && productCategory) {
                // تحديث التقييمات حسب فئة المنتج
                this.updateReviewsForCategory(reviewsContainer, productCategory);
            }
        });
    }

    detectProductCategory(card) {
        const productName = card.querySelector('.product-name, .product-title')?.textContent?.toLowerCase() || '';
        const productImage = card.querySelector('.product-image img')?.alt?.toLowerCase() || '';
        const productText = (productName + ' ' + productImage).toLowerCase();
        
        if (productText.includes('ساعة') || productText.includes('watch')) {
            return 'watches';
        } else if (productText.includes('عطر') || productText.includes('perfume') || productText.includes('fragrance')) {
            return 'perfumes';
        } else if (productText.includes('مجوهرات') || productText.includes('jewelry')) {
            return 'jewelry';
        } else if (productText.includes('أكسسوار') || productText.includes('accessory')) {
            return 'accessories';
        }
        
        return 'general';
    }

    updateReviewsForCategory(reviewsContainer, category) {
        // قوائم التقييمات المناسبة لكل فئة
        const categoryReviews = {
            watches: [
                { name: 'أحمد المنصوري', rating: 5, comment: 'ساعة رائعة والجودة ممتازة، التوصيل سريع' },
                { name: 'فاطمة الكعبي', rating: 4, comment: 'تصميم أنيق ومناسب للمناسبات الرسمية' },
                { name: 'محمد الشامسي', rating: 5, comment: 'دقة في الوقت وخامات عالية الجودة' }
            ],
            perfumes: [
                { name: 'نورا العلي', rating: 5, comment: 'رائحة عطرة وتدوم طوال اليوم، أنصح بشرائه' },
                { name: 'عائشة البلوشي', rating: 4, comment: 'عطر مميز ورائحة جذابة للغاية' },
                { name: 'سالم الخوري', rating: 5, comment: 'من أفضل العطور التي جربتها' }
            ],
            jewelry: [
                { name: 'مريم الزعابي', rating: 5, comment: 'قطعة مجوهرات رائعة ولمعان مميز' },
                { name: 'خديجة الرئيسي', rating: 4, comment: 'تصميم عصري وجودة ممتازة' },
                { name: 'هند المرر', rating: 5, comment: 'أعجبني التصميم كثيراً ومناسب للهدايا' }
            ],
            general: [
                { name: 'عبدالله السويدي', rating: 4, comment: 'منتج جيد وخدمة عملاء ممتازة' },
                { name: 'لطيفة الحمادي', rating: 5, comment: 'راضية عن المنتج والجودة فوق التوقعات' },
                { name: 'يوسف الطنيجي', rating: 4, comment: 'يستحق التجربة والسعر مناسب' }
            ]
        };
        
        const reviews = categoryReviews[category] || categoryReviews.general;
        
        // تحديث التقييمات المعروضة
        reviewsContainer.innerHTML = this.generateReviewsHTML(reviews);
    }

    generateReviewsHTML(reviews) {
        return `
            <div class="reviews-summary">
                <div class="average-rating">4.6</div>
                <div class="stars-display">★★★★☆</div>
                <div class="total-reviews">(${reviews.length} تقييم)</div>
            </div>
            <div class="reviews-items">
                ${reviews.map(review => `
                    <div class="review-item">
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                        <div class="review-comment">${review.comment}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ضمان وسطية المحتوى في بطاقات المنتجات
    centerProductCardContent() {
        const style = document.createElement('style');
        style.textContent = `
            .product-card, .product-item {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
            }
            
            .product-card .product-name,
            .product-card .product-title,
            .product-item .product-name,
            .product-item .product-title {
                text-align: center;
                width: 100%;
                margin: 10px 0;
            }
            
            .product-card .product-price,
            .product-item .product-price {
                text-align: center;
                font-weight: bold;
                margin: 8px 0;
            }
            
            .card-actions-container {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: auto;
                padding-top: 15px;
                width: 100%;
            }
            
            .icon-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #ddd;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .icon-btn:hover {
                background: #D4AF37;
                border-color: #D4AF37;
                color: white;
                transform: translateY(-2px);
            }
            
            .btn-tooltip {
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.7rem;
                opacity: 0;
                transition: opacity 0.3s;
                white-space: nowrap;
                z-index: 1000;
            }
            
            .icon-btn:hover .btn-tooltip {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // إضافة وظيفة فتح الروابط في تبويب جديد
    addNewTabFunctionality() {
        // فتح روابط المنتجات في تبويب جديد
        document.querySelectorAll('a[href*="products/"]').forEach(link => {
            link.target = '_blank';
        });
        
        // فتح روابط صفحات المنتجات
        document.querySelectorAll('.product-link, .view-product').forEach(link => {
            link.target = '_blank';
        });
    }

    // ضمان وجود وصف لكل منتج
    ensureProductDescriptions() {
        document.querySelectorAll('.product-card, .product-item').forEach(card => {
            let description = card.querySelector('.product-description, .product-summary');
            
            if (!description || !description.textContent.trim()) {
                const productName = card.querySelector('.product-name, .product-title')?.textContent || '';
                const category = this.detectProductCategory(card);
                
                if (!description) {
                    description = document.createElement('div');
                    description.className = 'product-description';
                    card.appendChild(description);
                }
                
                description.textContent = this.generateProductDescription(productName, category);
                description.style.cssText = `
                    font-size: 0.85rem;
                    color: #666;
                    margin: 10px 0;
                    line-height: 1.4;
                    text-align: center;
                `;
            }
        });
    }

    generateProductDescription(productName, category) {
        const descriptions = {
            watches: 'ساعة عالية الجودة بتصميم أنيق ومواصفات احترافية مناسبة لجميع المناسبات',
            perfumes: 'عطر فاخر برائحة مميزة وثبات عالي يدوم طوال اليوم بتركيبة أصيلة',
            jewelry: 'قطعة مجوهرات أنيقة بتصميم عصري وخامات فاخرة مناسبة كهدية مميزة',
            accessories: 'إكسسوار عملي وأنيق بجودة عالية وتصميم عصري يناسب جميع الأوقات',
            general: 'منتج عالي الجودة بمواصفات ممتازة وتصميم مميز بأفضل الأسعار'
        };
        
        return descriptions[category] || descriptions.general;
    }

    // عرض إشعار نجاح
    showSuccessNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #25D366;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            max-width: 350px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, duration);
        
        // إضافة CSS للحركة
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new SiteUpdateSystem();
});

// تشغيل النظام أيضاً إذا كان DOM محمل بالفعل
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SiteUpdateSystem());
} else {
    new SiteUpdateSystem();
}