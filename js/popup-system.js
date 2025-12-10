// نظام إشعارات المبيعات الذكي - متجر هدايا الإمارات
// عرض إشعارات مبيعات حديثة بأسماء عملاء حقيقيين مع روابط صحيحة لصفحة المنتجات

window.EmiratesSalesNotifications = {
    isActive: true,
    interval: null,
    lastShown: 0,
    DISPLAY_INTERVAL: 20000, // 20 ثانية
    currentIndex: 0,
    productsData: null,
    
    // أسماء عملاء إماراتيين حقيقيين
    customerNames: [
        { name: 'محمد العلي', location: 'دبي', verified: true },
        { name: 'فاطمة الزهراني', location: 'أبو ظبي', verified: true },
        { name: 'عبدالله أحمد', location: 'الشارقة', verified: false },
        { name: 'مريم عبدالعزيز', location: 'عجمان', verified: true },
        { name: 'خالد المنصوري', location: 'رأس الخيمة', verified: true },
        { name: 'نورا محمد', location: 'الفجيرة', verified: false },
        { name: 'سعد العتيبي', location: 'دبي', verified: true },
        { name: 'ليلى عبدالله', location: 'أم القيوين', verified: true },
        { name: 'عمر المازني', location: 'عجمان', verified: false },
        { name: 'هند القاسمي', location: 'العين', verified: true },
        { name: 'راشد الزعابي', location: 'دبي', verified: true },
        { name: 'عائشة النعيمي', location: 'أبو ظبي', verified: false }
    ],
    
    // أوقات وهمية للمبيعات
    timeOptions: [
        'منذ 3 دقائق', 'منذ 5 دقائق', 'منذ 8 دقائق',
        'منذ 12 دقيقة', 'منذ 15 دقيقة', 'منذ 18 دقيقة',
        'منذ 22 دقيقة', 'منذ 25 دقيقة', 'منذ 30 دقيقة'
    ],
    
    // تحميل بيانات المنتجات
    async loadProductsData() {
        if (this.productsData) return this.productsData;
        
        try {
            const [perfumesResponse, watchesResponse] = await Promise.all([
                fetch('./data/otor.json').catch(() => ({ ok: false })),
                fetch('./data/sa3at.json').catch(() => ({ ok: false }))
            ]);
            
            let products = [];
            
            if (perfumesResponse.ok) {
                const perfumes = await perfumesResponse.json();
                products = [...products, ...perfumes.map(p => ({ ...p, type: 'perfume', category: 'عطور' }))];
            }
            
            if (watchesResponse.ok) {
                const watches = await watchesResponse.json();
                products = [...products, ...watches.map(p => ({ ...p, type: 'watch', category: 'ساعات' }))];
            }
            
            // فلترة وتنظيف البيانات
            this.productsData = products.filter(p => p && p.id && p.title).slice(0, 50);
            
            console.log(`📦 تم تحميل ${this.productsData.length} منتج لإشعارات المبيعات`);
            return this.productsData;
            
        } catch (error) {
            console.error('⚠️ خطأ في تحميل بيانات المنتجات:', error);
            
            // بيانات احتياطية
            this.productsData = [
                { id: 'perfume_1', title: 'عطر كوكو شانيل 100 مل', type: 'perfume', category: 'عطور' },
                { id: 'perfume_2', title: 'عطر جوتشي فلورا', type: 'perfume', category: 'عطور' },
                { id: 'perfume_5', title: 'عطر فرزاتشي ايروس', type: 'perfume', category: 'عطور' }
            ];
            
            return this.productsData;
        }
    },
    
    // توليد إشعار مبيعة عشوائي
    async generateSaleData() {
        await this.loadProductsData();
        
        if (!this.productsData || this.productsData.length === 0) {
            return null;
        }
        
        const randomCustomer = this.customerNames[Math.floor(Math.random() * this.customerNames.length)];
        const randomProduct = this.productsData[Math.floor(Math.random() * this.productsData.length)];
        const randomTime = this.timeOptions[Math.floor(Math.random() * this.timeOptions.length)];
        
        return {
            customerName: randomCustomer.name,
            location: randomCustomer.location,
            verified: randomCustomer.verified,
            productName: randomProduct.title,
            productId: randomProduct.id,
            productType: randomProduct.type,
            timeAgo: randomTime
        };
    },
    
    // إنشاء إشعار مبيعة
    async createSalesNotification() {
        const sale = await this.generateSaleData();
        
        if (!sale) {
            console.warn('⚠️ لا توجد بيانات لإنشاء إشعار مبيعة');
            return null;
        }
        
        const notification = document.createElement('div');
        notification.className = 'sales-notification';
        
        // تحديد الأيقونة واللون حسب نوع المنتج
        const isWatch = sale.productName.includes('ساعة') || sale.productType === 'watch';
        const isPerfume = sale.productName.includes('عطر') || sale.productType === 'perfume';
        
        let icon, borderColor, bgGradient;
        
        if (isWatch) {
            icon = '⏰';
            borderColor = '#C8102E';
            bgGradient = 'linear-gradient(135deg, #C8102E 0%, #A0001C 100%)';
        } else if (isPerfume) {
            icon = '🌿';
            borderColor = '#D4AF37';
            bgGradient = 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)';
        } else {
            icon = '🎁';
            borderColor = '#00A16B';
            bgGradient = 'linear-gradient(135deg, #00A16B 0%, #008055 100%)';
        }
        
        // استخدام رابط صحيح لصفحة المنتجات
        const productUrl = `./products-showcase.html#product-${sale.productId}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon" style="background: ${bgGradient};">
                    ${icon}
                </div>
                
                <div class="notification-info">
                    <div class="customer-info">
                        <span class="customer-name">${sale.customerName}</span>
                        ${sale.verified ? '<i class="fas fa-check-circle verified-badge" title="عميل موثق"></i>' : ''}
                        <span class="customer-location">من ${sale.location}</span>
                    </div>
                    
                    <div class="purchase-info">
                        <span class="action-text">اشترى</span>
                        <a href="${productUrl}" 
                           class="product-link" 
                           target="_blank" 
                           rel="noopener"
                           onclick="EmiratesSalesNotifications.trackClick('${sale.productId}', '${sale.productName}')">
                            ${sale.productName}
                        </a>
                    </div>
                    
                    <div class="time-info">${sale.timeAgo}</div>
                </div>
                
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()" title="إغلاق">
                    ×
                </button>
            </div>
        `;
        
        // إضافة ستايل مخصص
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid ${borderColor};
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-family: 'Cairo', sans-serif;
            max-width: 380px;
            min-width: 300px;
            animation: slideInLeft 0.6s ease-out;
            overflow: hidden;
            cursor: default;
        `;
        
        return notification;
    },
    
    // عرض إشعار مبيعة
    async showSalesNotification() {
        try {
            // إزالة أي إشعار سابق
            const existing = document.querySelector('.sales-notification');
            if (existing) {
                existing.style.animation = 'slideOutLeft 0.5s ease-in';
                setTimeout(() => existing.remove(), 500);
            }
            
            const now = Date.now();
            
            // تحقق من الوقت المنقضي
            if (now - this.lastShown < this.DISPLAY_INTERVAL) {
                return;
            }
            
            const notification = await this.createSalesNotification();
            if (!notification) return;
            
            document.body.appendChild(notification);
            this.lastShown = now;
            
            // إخفاء تلقائي بعد 8 ثواني
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutLeft 0.5s ease-in';
                    setTimeout(() => notification.remove(), 500);
                }
            }, 8000);
            
            console.log('🔔 تم عرض إشعار مبيعة جديد');
            
        } catch (error) {
            console.error('❌ خطأ في عرض إشعار المبيعة:', error);
        }
    },
    
    // تتبع نقرات الروابط
    trackClick(productId, productName) {
        console.log(`📈 تم النقر على المنتج: ${productName} (ID: ${productId})`);
        
        // إخفاء الإشعار عند النقر
        const notification = document.querySelector('.sales-notification');
        if (notification) {
            notification.style.animation = 'slideOutLeft 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
        
        // معلومات إضافية للتحليل
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sales_notification_click', {
                'product_id': productId,
                'product_name': productName
            });
        }
    },
    
    // بدء عرض الإشعارات
    start() {
        if (!this.isActive) return;
        
        // تحميل البيانات أولاً
        this.loadProductsData();
        
        // أول عرض بعد 15 ثانية من التحميل
        setTimeout(() => {
            this.showSalesNotification();
        }, 15000);
        
        // عرض دوري كل 20 ثانية
        this.interval = setInterval(() => {
            this.showSalesNotification();
        }, this.DISPLAY_INTERVAL);
        
        console.log('✅ تم بدء نظام إشعارات المبيعات الذكي - عرض كل 20 ثانية');
    },
    
    // إيقاف النظام
    stop() {
        this.isActive = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        // إزالة أي إشعار موجود
        const notification = document.querySelector('.sales-notification');
        if (notification) {
            notification.remove();
        }
        
        console.log('⏹️ تم إيقاف نظام إشعارات المبيعات');
    },
    
    // إضافة الستايلات
    addStyles() {
        if (document.querySelector('#sales-notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'sales-notification-styles';
        style.textContent = `
            .sales-notification {
                font-family: 'Cairo', sans-serif;
                user-select: none;
                transition: all 0.3s ease;
            }
            
            .sales-notification:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2) !important;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px;
                position: relative;
            }
            
            .notification-icon {
                font-size: 2.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
                flex-shrink: 0;
            }
            
            .notification-info {
                flex: 1;
                line-height: 1.4;
            }
            
            .customer-info {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                font-size: 1rem;
                flex-wrap: wrap;
            }
            
            .customer-name {
                font-weight: 700;
                color: #2c3e50;
                white-space: nowrap;
            }
            
            .verified-badge {
                color: #27ae60;
                font-size: 14px;
                filter: drop-shadow(0 1px 2px rgba(39, 174, 96, 0.3));
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .customer-location {
                font-size: 0.9rem;
                color: #7f8c8d;
                font-weight: 500;
            }
            
            .purchase-info {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-bottom: 6px;
                line-height: 1.3;
            }
            
            .action-text {
                font-size: 0.95rem;
                color: #34495e;
                font-weight: 600;
                flex-shrink: 0;
            }
            
            .product-link {
                color: #D4AF37;
                font-weight: 700;
                text-decoration: none;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                border-bottom: 1px solid transparent;
                line-height: 1.3;
                flex: 1;
                word-break: break-word;
            }
            
            .product-link:hover {
                color: #B8941F;
                border-bottom-color: #B8941F;
                transform: translateX(-2px);
            }
            
            .time-info {
                font-size: 0.8rem;
                color: #95a5a6;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .time-info::before {
                content: '🕰️';
                font-size: 0.9rem;
            }
            
            .notification-close {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 25px;
                height: 25px;
                background: rgba(0, 0, 0, 0.1);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                color: #666;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                opacity: 0.7;
            }
            
            .notification-close:hover {
                background: #e74c3c;
                color: white;
                opacity: 1;
                transform: scale(1.1);
            }
            
            /* انيميشن الدخول والخروج */
            @keyframes slideInLeft {
                from {
                    transform: translateX(-100%) scale(0.9);
                    opacity: 0;
                }
                to {
                    transform: translateX(0) scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutLeft {
                from {
                    transform: translateX(0) scale(1);
                    opacity: 1;
                }
                to {
                    transform: translateX(-100%) scale(0.9);
                    opacity: 0;
                }
            }
            
            /* تصميم متجاوب للجوال */
            @media (max-width: 768px) {
                .sales-notification {
                    left: 10px;
                    right: 10px;
                    max-width: none;
                    min-width: auto;
                    bottom: 10px;
                }
                
                .notification-content {
                    padding: 15px;
                    gap: 12px;
                }
                
                .notification-icon {
                    width: 50px;
                    height: 50px;
                    font-size: 2rem;
                }
                
                .customer-info {
                    font-size: 0.9rem;
                }
                
                .product-link {
                    font-size: 0.85rem;
                }
                
                .purchase-info {
                    align-items: flex-start;
                    gap: 4px;
                }
            }
            
            /* تحسينات إضافية */
            .notification-content::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #D4AF37, #C8102E, #00A16B);
            }
            
            .sales-notification:hover .notification-icon {
                animation: bounce 0.6s ease;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-8px);
                }
                60% {
                    transform: translateY(-4px);
                }
            }
            
            /* تأثير نبضة على الحدود */
            .sales-notification {
                animation: slideInLeft 0.6s ease-out, borderPulse 3s ease-in-out infinite 2s;
            }
            
            @keyframes borderPulse {
                0%, 100% {
                    border-width: 2px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                }
                50% {
                    border-width: 3px;
                    box-shadow: 0 15px 50px rgba(212, 175, 55, 0.2);
                }
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // تهيئة النظام
    init() {
        this.addStyles();
        
        // بدء العرض بعد تحميل الصفحة بالكامل
        if (document.readyState === 'complete') {
            setTimeout(() => this.start(), 2000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.start(), 2000);
            });
        }
        
        console.log('🎆 تم تهيئة نظام إشعارات المبيعات الذكي بنجاح');
    },
    
    // إضافة مبيعة جديدة (من الخارج عند الحاجة)
    addRealtimeSale(customerName, location, productName, productId) {
        // إضافة فورية للعميل وعرض مباشر
        const newSale = {
            customerName,
            location,
            productName,
            productId,
            timeAgo: 'منذ لحظات',
            verified: true,
            productType: productName.includes('عطر') ? 'perfume' : 'watch'
        };
        
        // عرض فوري
        setTimeout(() => {
            this.createAndShowCustomSale(newSale);
        }, 2000);
        
        console.log('🆕 تم إضافة مبيعة فورية:', { customerName, productName });
    },
    
    // عرض مبيعة مخصصة
    async createAndShowCustomSale(saleData) {
        const existing = document.querySelector('.sales-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'sales-notification';
        
        const isPerfume = saleData.productName.includes('عطر') || saleData.productType === 'perfume';
        const isWatch = saleData.productName.includes('ساعة') || saleData.productType === 'watch';
        
        let icon, borderColor, bgGradient;
        if (isWatch) {
            icon = '⏰';
            borderColor = '#C8102E';
            bgGradient = 'linear-gradient(135deg, #C8102E 0%, #A0001C 100%)';
        } else if (isPerfume) {
            icon = '🌿';
            borderColor = '#D4AF37';
            bgGradient = 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)';
        } else {
            icon = '🎁';
            borderColor = '#00A16B';
            bgGradient = 'linear-gradient(135deg, #00A16B 0%, #008055 100%)';
        }
        
        // استخدام الرابط الصحيح لصفحة المنتجات
        const productUrl = `./products-showcase.html#product-${saleData.productId}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon" style="background: ${bgGradient};">
                    ${icon}
                </div>
                
                <div class="notification-info">
                    <div class="customer-info">
                        <span class="customer-name">${saleData.customerName}</span>
                        ${saleData.verified ? '<i class="fas fa-check-circle verified-badge" title="عميل موثق"></i>' : ''}
                        <span class="customer-location">من ${saleData.location}</span>
                    </div>
                    
                    <div class="purchase-info">
                        <span class="action-text">اشترى</span>
                        <a href="${productUrl}" 
                           class="product-link" 
                           target="_blank" 
                           rel="noopener"
                           onclick="EmiratesSalesNotifications.trackClick('${saleData.productId}', '${saleData.productName}')">
                            ${saleData.productName}
                        </a>
                    </div>
                    
                    <div class="time-info">${saleData.timeAgo}</div>
                </div>
                
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()" title="إغلاق">
                    ×
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid ${borderColor};
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            max-width: 380px;
            min-width: 300px;
            animation: slideInLeft 0.6s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutLeft 0.5s ease-in';
                setTimeout(() => notification.remove(), 500);
            }
        }, 8000);
    }
};

// بدء النظام تلقائياً
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EmiratesSalesNotifications.init();
    });
} else {
    EmiratesSalesNotifications.init();
}

// تصدير للاستخدام العام
window.EmiratesPopupSystem = EmiratesSalesNotifications; // موافقة مع النظام القديم