// نظام الإشعارات المنبثقة - إشعارات المبيعات الوهمية
class SalesNotifications {
    constructor() {
        this.customerNames = [
            'أحمد المنصوري', 'محمد النقبي', 'سالم الشامسي', 'خالد البلوشي', 'راشد الكعبي',
            'عبدالله الزعابي', 'سعيد المهيري', 'فيصل العتيبة', 'مجد المرر', 'طارق الطاير',
            'حمدان بن راشد', 'زايد الشرقي', 'ماجد النيادي', 'جاسم الحوسني', 'عمر الحمادي',
            'يوسف المطروشي', 'نايف السويدي', 'حاتم الظاهري', 'بدر الجابري', 'سلطان الكتبي',
            'فاطمة النعيمي', 'عائشة الشحي', 'مريم البدواوي', 'نورا الطنيجي', 'سارة القبيسي',
            'شما المزروعي', 'هند الرميثي', 'لطيفة الشرهان', 'أميرة الحوسني', 'رنا المطوع',
            'سلامة الهاشمي', 'إيمان الكندي', 'آمنة العليا', 'شيخة الراشد', 'موزة البوسميط',
            'نجلاء الحربي', 'رقية الجنيبي', 'صفية الدرعي', 'خولة السرقال', 'ميثاء الشحي',
            'علي الأحبابي', 'منصور الفلاسي', 'سعود النعيمي', 'ناصر المزيد', 'عيسى الحمادي',
            'عبدالرحمن الكتبي', 'سيف القاسمي', 'نهيان المنصوري', 'عدنان الطاير', 'محمود الملا',
            'أسماء الشامسي', 'نادية البلوشي', 'منى الطنيجي', 'شيماء الدرعي', 'عبير النعيمي',
            'ريم الزعابي', 'نوال المرر', 'زينب الحمادي', 'غادة السويدي', 'نور الفلاسي',
            'سلمى الشحي', 'حليمة المهيري', 'أمل الحوسني', 'وردة القبيسي', 'لولوة العتيبة',
            'جواهر المنصوري', 'لاتيفا الكعبي', 'ميرا النقبي', 'دانة الطاير', 'سالي الظاهري',
            'عبدالعزيز الشرقي', 'مبارك الحمادي', 'سلمان الكتبي', 'عوض المزروعي', 'بطي الفلاسي',
            'عبدالله الأحبابي', 'محمد الرميثي', 'خليفة الدرعي', 'حمد الطنيجي', 'مطر الشامسي',
            'عذراء المنصوري', 'حنان النعيمي', 'فريدة الكعبي', 'مها الحوسني', 'سمية المهيري',
            'أزهار البلوشي', 'زهراء الشحي', 'عفراء القبيسي', 'سحر الزعابي', 'جميلة المرر',
            'عثمان الفلاسي', 'كمال الحمادي', 'صقر النيادي', 'فهد الطاير', 'بندر الكتبي',
            'جاسمين الشامسي', 'ليلى النقبي', 'نسرين الدرعي', 'سارة الطنيجي', 'رشا الحوسني'
        ];
        
        this.isActive = true;
        this.notificationElement = null;
        this.currentTimeout = null;
    }

    getRandomCustomerName() {
        return this.customerNames[Math.floor(Math.random() * this.customerNames.length)];
    }

    async getRandomProductName() {
        // محاولة الحصول على منتج عشوائي من البيانات المحملة
        if (window.ProductsLoader && typeof window.ProductsLoader.getAllProducts === 'function') {
            const products = window.ProductsLoader.getAllProducts();
            if (products.length > 0) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                return randomProduct.title;
            }
        }
        
        // قائمة احتياطية من أسماء المنتجات
        const fallbackProducts = [
            'عطر أرياف الفاخر للرجال',
            'عطر غلوري الشرقي النسائي', 
            'ساعة رولكس كلاسيكية',
            'عطر توم فورد الأسود',
            'ساعة أوميغا سبورت',
            'عطر كايالي الوردي',
            'ساعة كارتييه الذهبية',
            'عطر عود ملكي فاخر',
            'ساعة تاغ هوير رياضية',
            'عطر شانيل رقم 5',
            'ساعة برايتلينغ للطيران',
            'عطر ديور سوفاج',
            'ساعة باتيك فيليب',
            'عطر كريد افينتوس',
            'ساعة أوديمار بيغه',
            'عطر مايزون مارجيلا',
            'ساعة جيجر لوكولتر',
            'عطر بايريدو الاسكندنافي',
            'ساعة فاشيرون كونستانتين',
            'عطر أمواج الإماراتي'
        ];
        
        return fallbackProducts[Math.floor(Math.random() * fallbackProducts.length)];
    }

    async createNotification() {
        const customerName = this.getRandomCustomerName();
        const productName = await this.getRandomProductName();
        
        // إزالة الإشعار السابق إن وجد
        if (this.notificationElement) {
            this.hideNotification();
        }

        this.notificationElement = document.createElement('div');
        this.notificationElement.className = 'sales-notification';
        this.notificationElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #25D366, #20B358);
            color: white;
            padding: 18px 25px;
            border-radius: 15px;
            box-shadow: 0 8px 30px rgba(37, 211, 102, 0.4);
            z-index: 9999;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            font-size: 0.95rem;
            max-width: 350px;
            animation: slideInLeft 0.5s ease-out;
            cursor: pointer;
            border: 2px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        `;

        this.notificationElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="flex-shrink: 0;">
                    <div style="width: 45px; height: 45px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        🛍️
                    </div>
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 2px;">اشترى العميل:</div>
                    <div style="font-weight: 700; margin-bottom: 3px; color: #FFD700;">${customerName}</div>
                    <div style="font-size: 0.9rem; line-height: 1.3; opacity: 0.95;">اشترى المنتج: "${productName}"</div>
                </div>
                <div style="flex-shrink: 0; opacity: 0.8;">
                    <i class="fas fa-times" style="cursor: pointer; font-size: 1.2rem; padding: 5px;" onclick="this.closest('.sales-notification').remove()"></i>
                </div>
            </div>
        `;

        // إضافة حدث النقر للانتقال لصفحة المنتجات
        this.notificationElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('fa-times')) {
                window.open('./products-showcase.html', '_blank');
            }
        });

        document.body.appendChild(this.notificationElement);

        // إخفاء بعد 8 ثوانٍ
        setTimeout(() => {
            this.hideNotification();
        }, 8000);
    }

    hideNotification() {
        if (this.notificationElement && this.notificationElement.parentNode) {
            this.notificationElement.style.animation = 'slideOutLeft 0.4s ease-in forwards';
            setTimeout(() => {
                if (this.notificationElement && this.notificationElement.parentNode) {
                    this.notificationElement.remove();
                    this.notificationElement = null;
                }
            }, 400);
        }
    }

    start() {
        if (!this.isActive) return;

        // عرض أول إشعار بعد 5 ثوانِ من تحميل الصفحة
        setTimeout(() => {
            this.createNotification();
        }, 5000);

        // تكرار كل 15 ثانية
        this.currentTimeout = setInterval(() => {
            if (this.isActive) {
                this.createNotification();
            }
        }, 15000);
    }

    stop() {
        this.isActive = false;
        if (this.currentTimeout) {
            clearInterval(this.currentTimeout);
            this.currentTimeout = null;
        }
        this.hideNotification();
    }

    addAnimationCSS() {
        if (!document.querySelector('#sales-notifications-css')) {
            const style = document.createElement('style');
            style.id = 'sales-notifications-css';
            style.textContent = `
                @keyframes slideInLeft {
                    from { 
                        transform: translateX(-100%); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateX(0); 
                        opacity: 1; 
                    }
                }
                
                @keyframes slideOutLeft {
                    from { 
                        transform: translateX(0); 
                        opacity: 1; 
                    }
                    to { 
                        transform: translateX(-100%); 
                        opacity: 0; 
                    }
                }
                
                .sales-notification:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 40px rgba(37, 211, 102, 0.5);
                }
                
                @media (max-width: 768px) {
                    .sales-notification {
                        left: 10px !important;
                        right: 10px !important;
                        max-width: none !important;
                        bottom: 10px !important;
                        padding: 15px 20px !important;
                        font-size: 0.9rem !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', function() {
    const salesNotifications = new SalesNotifications();
    salesNotifications.addAnimationCSS();
    
    // تشغيل الإشعارات بعد تحميل الصفحة بالكامل
    window.addEventListener('load', () => {
        setTimeout(() => {
            salesNotifications.start();
        }, 2000);
    });
    
    // إيقاف الإشعارات عند إغلاق النافذة
    window.addEventListener('beforeunload', () => {
        salesNotifications.stop();
    });
    
    // جعل النظام متاحاً عالمياً
    window.SalesNotifications = salesNotifications;
});