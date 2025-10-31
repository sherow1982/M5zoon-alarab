// نظام إشعارات المبيعات - متجر هدايا الإمارات
// عرض إشعارات المبيعات الحديثة بأسماء وهمية وروابط المنتجات

window.EmiratesSalesNotifications = {
    isActive: true,
    interval: null,
    lastShown: 0,
    DISPLAY_INTERVAL: 20000, // 20 ثانية
    currentIndex: 0,
    
    // بيانات وهمية للعملاء والمشتريات
    salesData: [
        {
            customerName: 'محمد العلي',
            location: 'دبي',
            productName: 'عطر ARIAF اورينتال فاخر',
            productId: '1',
            timeAgo: 'منذ 3 دقائق',
            verified: true
        },
        {
            customerName: 'فاطمة محمد',
            location: 'أبو ظبي',
            productName: 'عطر Kayali Vanilla 28',
            productId: '2',
            timeAgo: 'منذ 7 دقائق',
            verified: true
        },
        {
            customerName: 'عبدالله أحمد',
            location: 'الشارقة',
            productName: 'ساعة Rolex Submariner فاخرة',
            productId: '15',
            timeAgo: 'منذ 12 دقيقة',
            verified: true
        },
        {
            customerName: 'مريم عبدالعزيز',
            location: 'عجمان',
            productName: 'عطر Tom Ford Black Orchid',
            productId: '8',
            timeAgo: 'منذ 15 دقيقة',
            verified: false
        },
        {
            customerName: 'خالد المنصوري',
            location: 'رأس الخيمة',
            productName: 'عطر Marly Delina نسائي راقي',
            productId: '5',
            timeAgo: 'منذ 18 دقيقة',
            verified: true
        },
        {
            customerName: 'نورا الزهراني',
            location: 'الفجيرة',
            productName: 'ساعة Omega Seamaster كلاسيكية',
            productId: '22',
            timeAgo: 'منذ 21 دقيقة',
            verified: true
        },
        {
            customerName: 'سعد العتيبي',
            location: 'دبي',
            productName: 'عطر Arabian Oud Rose فاخر',
            productId: '12',
            timeAgo: 'منذ 25 دقيقة',
            verified: false
        },
        {
            customerName: 'ليلى محمد',
            location: 'أم القيوين',
            productName: 'عطر Lattafa Raghba شرقي',
            productId: '18',
            timeAgo: 'منذ 28 دقيقة',
            verified: true
        }
    ],
    
    // إنشاء إشعار مبيعة
    createSalesNotification() {
        const sale = this.salesData[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.salesData.length;
        
        const notification = document.createElement('div');
        notification.className = 'sales-notification';
        
        // تحديد لون الحدود حسب نوع المنتج
        const borderColor = sale.productName.includes('عطر') ? '#D4AF37' : '#C8102E';
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${sale.productName.includes('عطر') ? '🌿' : '⏰'}
                </div>
                
                <div class="notification-info">
                    <div class="customer-info">
                        <span class="customer-name">${sale.customerName}</span>
                        ${sale.verified ? '<i class="fas fa-check-circle verified-badge" title="عميل موثق"></i>' : ''}
                        <span class="customer-location">مل ${sale.location}</span>
                    </div>
                    
                    <div class="purchase-info">
                        <span class="action-text">اشترى</span>
                        <a href="./product-details.html?id=${sale.productId}" 
                           class="product-link" 
                           target="_blank" 
                           rel="noopener"
                           onclick="EmiratesSalesNotifications.trackClick('${sale.productId}')">
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
    showSalesNotification() {
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
        
        const notification = this.createSalesNotification();
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
    },
    
    // تتبع نقرات الروابط
    trackClick(productId) {
        console.log(`📈 تم النقر على المنتج: ${productId}`);
        
        // إخفاء الإشعار عند النقر
        const notification = document.querySelector('.sales-notification');
        if (notification) {
            notification.style.animation = 'slideOutLeft 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    },
    
    // بدء عرض الإشعارات
    start() {
        if (!this.isActive) return;
        
        // أول عرض بعد 15 ثانية من التحميل
        setTimeout(() => {
            this.showSalesNotification();
        }, 15000);
        
        // عرض دوري كل 20 ثانية
        this.interval = setInterval(() => {
            this.showSalesNotification();
        }, this.DISPLAY_INTERVAL);
        
        console.log('✅ تم بدء نظام إشعارات المبيعات - عرض كل 20 ثانية');
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
                background: linear-gradient(135deg, #D4AF37, #B8941F);
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
            }
            
            .customer-name {
                font-weight: 700;
                color: #2c3e50;
            }
            
            .verified-badge {
                color: #27ae60;
                font-size: 14px;
                filter: drop-shadow(0 1px 2px rgba(39, 174, 96, 0.3));
            }
            
            .customer-location {
                font-size: 0.9rem;
                color: #7f8c8d;
                font-weight: 500;
            }
            
            .purchase-info {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
                flex-wrap: wrap;
            }
            
            .action-text {
                font-size: 0.95rem;
                color: #34495e;
                font-weight: 600;
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
                    flex-direction: column;
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
        
        console.log('🎆 تم تهيئة نظام إشعارات المبيعات بنجاح');
    },
    
    // إضافة مبيعة جديدة (من الخارج)
    addSale(customerName, location, productName, productId) {
        this.salesData.unshift({
            customerName,
            location,
            productName,
            productId,
            timeAgo: 'منذ لحظات',
            verified: Math.random() > 0.3 // 70% موثق
        });
        
        // الاحتفاظ بآخر 10 مبيعات
        if (this.salesData.length > 10) {
            this.salesData = this.salesData.slice(0, 10);
        }
        
        console.log('🆕 تم إضافة مبيعة جديدة:', { customerName, productName });
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