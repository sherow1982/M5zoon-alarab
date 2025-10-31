// نظام واتساب محسّن مع نماذج الطلب المتقدمة

class EnhancedWhatsAppSystem {
    constructor() {
        this.phoneNumber = "201110760081";
        this.storeReply = "تلقينا طلبك .. انتظر مكالمة هاتفية للتاكيد\nشكرا لك ❤️";
        this.isProcessing = false;
    }

    // إنشاء رابط واتساب مع نموذج الطلب
    createOrderFormLink(productTitle, productPrice, productImage = '') {
        const orderForm = `🎆 **طلب جديد من متجر هدايا الإمارات** 🎆

🛍️ **المنتج المطلوب:**
"${productTitle}"
السعر: ${productPrice} درهم إماراتي

📄 **يرجى ملء البيانات التالية:**

👤 الاسم:
_______________________

🏠 العنوان:
_______________________

🔢 عدد القطع المطلوبة:
_______________________

📱 رقم جوال بديل إن أمكن:
_______________________

✨ **معلومات مهمة:**
✅ التوصيل مجاني في جميع إمارات الدولة
💳 الدفع عند الاستلام
⏰ مدة التوصيل: 24-48 ساعة`;

        return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(orderForm)}`;
    }

    // إنشاء رابط واتساب لسلة مقترنة بنموذج
    createCartOrderLink() {
        const cart = JSON.parse(localStorage.getItem('emirates-gifts-cart') || '[]');
        
        if (cart.length === 0) {
            return this.createGeneralInquiryLink();
        }

        let orderForm = `🎆 **طلب جديد من متجر هدايا الإمارات** 🎆

🛍️ **المنتجات المطلوبة:**

`;

        let totalCost = 0;
        cart.forEach((item, index) => {
            const itemPrice = parseFloat(item.sale_price || item.price || '0');
            const itemTotal = itemPrice * item.quantity;
            totalCost += itemTotal;

            orderForm += `${index + 1}. "${item.title}"
   • السعر: ${itemPrice.toFixed(2)} د.إ
   • الكمية: ${item.quantity}
   • الإجمالي: ${itemTotal.toFixed(2)} د.إ

`;
        });

        orderForm += `💰 **إجمالي الطلب: ${totalCost.toFixed(2)} درهم إماراتي**

📄 **يرجى ملء البيانات التالية:**

👤 الاسم:
_______________________

🏠 العنوان:
_______________________

🔢 عدد القطع المطلوبة:
_______________________

📱 رقم جوال بديل إن أمكن:
_______________________

✨ **معلومات مهمة:**
✅ التوصيل مجاني في جميع إمارات الدولة
💳 الدفع عند الاستلام
⏰ مدة التوصيل: 24-48 ساعة`;

        return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(orderForm)}`;
    }

    // رابط استفسار عام
    createGeneralInquiryLink() {
        const inquiryForm = `مرحباً بك في متجر هدايا الإمارات! 🎆

أريد الاستفسار عن منتجاتكم الفاخرة

📄 **يرجى ملء البيانات التالية:**

👤 الاسم:
_______________________

🏠 العنوان:
_______________________

🔢 عدد القطع المطلوبة:
_______________________

📱 رقم جوال بديل إن أمكن:
_______________________

✨ نحن هنا لخدمتكم في جميع إمارات الدولة!`;

        return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(inquiryForm)}`;
    }

    // معالجة طلب منتج واحد مع نموذج
    handleSingleProductOrder(productTitle, productPrice, productId) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // عرض مودال تأكيد
        this.showOrderModal({
            title: productTitle,
            price: productPrice,
            id: productId,
            type: 'single'
        });

        this.isProcessing = false;
    }

    // عرض مودال تأكيد الطلب
    showOrderModal(orderData) {
        // إزالة أي مودال سابق
        const existingModal = document.querySelector('.whatsapp-order-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'whatsapp-order-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease-out;
            backdrop-filter: blur(5px);
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                padding: 35px;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 90%;
                overflow-y: auto;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                position: relative;
                animation: slideInUp 0.4s ease-out;
            ">
                <button class="close-modal" onclick="this.closest('.whatsapp-order-modal').remove()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: transparent;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">
                    ×
                </button>
                
                <div style="margin-bottom: 25px;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">📦</div>
                    <h3 style="color: #2c3e50; margin-bottom: 10px; font-size: 1.4rem;">تأكيد طلب المنتج</h3>
                    <p style="color: #666; font-size: 0.95rem; line-height: 1.5;">سيتم فتح واتساب مع نموذج طلب معد مسبقاً</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: right;">
                    <h4 style="color: #2c3e50; margin-bottom: 10px;">🌟 ${orderData.title}</h4>
                    <div style="color: #27ae60; font-weight: bold; font-size: 1.2rem;">السعر: ${orderData.price} د.إ</div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.enhancedWhatsApp.proceedToWhatsApp('${orderData.type}', ${JSON.stringify(orderData).replace(/"/g, '&quot;')})" style="
                        background: linear-gradient(135deg, #25D366, #20B358);
                        color: white;
                        padding: 15px 25px;
                        border: none;
                        border-radius: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        font-size: 1rem;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(37, 211, 102, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(37, 211, 102, 0.3)'">
                        <i class="fab fa-whatsapp"></i>
                        فتح واتساب
                    </button>
                    
                    <button onclick="this.closest('.whatsapp-order-modal').remove()" style="
                        background: transparent;
                        color: #666;
                        padding: 15px 25px;
                        border: 2px solid #ddd;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.borderColor='#999'; this.style.color='#333'" onmouseout="this.style.borderColor='#ddd'; this.style.color='#666'">
                        إلغاء
                    </button>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(37, 211, 102, 0.1); border-radius: 10px; color: #2c3e50; font-size: 0.9rem; line-height: 1.5;">
                    ✅ توصيل مجاني داخل الإمارات<br>
                    💳 دفع عند الاستلام<br>
                    ⏰ توصيل خلال 24-48 ساعة
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // منع التمرير في الخلفية
        document.body.style.overflow = 'hidden';
        
        // إغلاق بالنقر خارج المحتوى
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    // المتابعة إلى واتساب
    proceedToWhatsApp(orderType, orderData) {
        let whatsappLink;
        
        if (orderType === 'single') {
            whatsappLink = this.createOrderFormLink(orderData.title, orderData.price);
        } else {
            whatsappLink = this.createCartOrderLink();
        }

        // فتح واتساب
        window.open(whatsappLink, '_blank');
        
        // إغلاق المودال
        const modal = document.querySelector('.whatsapp-order-modal');
        if (modal) {
            this.closeModal(modal);
        }
        
        // عرض رسالة الرد التلقائي
        setTimeout(() => {
            this.showAutoReply();
        }, 2000);
    }

    // عرض رسالة الرد التلقائي
    showAutoReply() {
        const replyModal = document.createElement('div');
        replyModal.className = 'auto-reply-modal';
        replyModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            animation: fadeIn 0.3s ease-out;
        `;

        replyModal.innerHTML = `
            <div class="reply-content" style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                max-width: 450px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: bounceIn 0.5s ease-out;
                position: relative;
            ">
                <div style="font-size: 4rem; margin-bottom: 20px; animation: pulse 2s infinite;">📱</div>
                <h3 style="color: #25D366; margin-bottom: 15px; font-size: 1.5rem; font-weight: 800;">رد تلقائي من المتجر</h3>
                
                <div style="background: #f0f8f0; padding: 20px; border-radius: 12px; margin: 20px 0; color: #2c3e50; line-height: 1.6; font-size: 1.1rem; border-left: 4px solid #25D366;">
                    "${this.storeReply}"
                </div>
                
                <div style="color: #666; font-size: 0.9rem; margin-bottom: 25px;">
                    ⏰ سيتم التواصل معك في أقرب وقت لتأكيد طلبك
                </div>
                
                <button onclick="this.closest('.auto-reply-modal').remove(); document.body.style.overflow = '';" style="
                    background: linear-gradient(135deg, #25D366, #20B358);
                    color: white;
                    padding: 12px 25px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1rem;
                    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
                ">
                    تم فهم الرسالة ✓
                </button>
            </div>
        `;

        document.body.appendChild(replyModal);
        document.body.style.overflow = 'hidden';

        // إغلاق تلقائي بعد 8 ثوانِ
        setTimeout(() => {
            if (replyModal.parentNode) {
                this.closeModal(replyModal);
            }
        }, 8000);

        this.addModalAnimations();
    }

    // إغلاق المودال
    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // إضافة انيميشن CSS
    addModalAnimations() {
        if (!document.querySelector('#whatsapp-modal-css')) {
            const style = document.createElement('style');
            style.id = 'whatsapp-modal-css';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes slideInUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(50px) scale(0.9); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
                
                @keyframes bounceIn {
                    0% { 
                        opacity: 0; 
                        transform: scale(0.3) translateY(50px); 
                    }
                    50% { 
                        opacity: 1; 
                        transform: scale(1.05) translateY(0); 
                    }
                    70% { 
                        transform: scale(0.95) translateY(0); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: scale(1) translateY(0); 
                    }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // تحديث جميع أزرار الواتساب في الموقع
    updateAllWhatsAppButtons() {
        // أزرار المنتجات الفردية
        document.querySelectorAll('.btn-whatsapp').forEach(button => {
            const productCard = button.closest('.product-card');
            if (productCard) {
                const productTitle = productCard.querySelector('.product-title, h3')?.textContent?.trim();
                const productPrice = productCard.querySelector('.current-price, .sale-price')?.textContent?.trim();
                const productId = productCard.getAttribute('data-product-id');
                
                if (productTitle && productPrice) {
                    button.onclick = (e) => {
                        e.preventDefault();
                        this.handleSingleProductOrder(productTitle, productPrice, productId);
                    };
                }
            }
        });

        // زر واتساب السلة
        document.querySelectorAll('.btn-cart-whatsapp, .cart-whatsapp-btn').forEach(button => {
            button.onclick = (e) => {
                e.preventDefault();
                const whatsappLink = this.createCartOrderLink();
                window.open(whatsappLink, '_blank');
                
                setTimeout(() => {
                    this.showAutoReply();
                }, 2000);
            };
        });

        // أزرار واتساب عامة
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            if (!link.hasAttribute('data-enhanced')) {
                const originalHref = link.getAttribute('href');
                
                // إذا كان يحتوي على نص معد مسبقاً
                if (originalHref.includes('text=')) {
                    link.onclick = (e) => {
                        e.preventDefault();
                        window.open(originalHref, '_blank');
                        
                        setTimeout(() => {
                            this.showAutoReply();
                        }, 2000);
                    };
                } else {
                    // رابط عام بدون نص
                    link.onclick = (e) => {
                        e.preventDefault();
                        const generalLink = this.createGeneralInquiryLink();
                        window.open(generalLink, '_blank');
                        
                        setTimeout(() => {
                            this.showAutoReply();
                        }, 2000);
                    };
                }
                
                link.setAttribute('data-enhanced', 'true');
            }
        });
    }

    // تهيئة النظام
    init() {
        this.addModalAnimations();
        
        // تحديث الأزرار عند التحميل
        this.updateAllWhatsAppButtons();
        
        // إعادة تحديث الأزرار بعد تحميل المنتجات
        setTimeout(() => {
            this.updateAllWhatsAppButtons();
        }, 3000);
        
        // مراقبة التغييرات في DOM
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(() => {
                setTimeout(() => {
                    this.updateAllWhatsAppButtons();
                }, 500);
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        console.log('✅ تم تفعيل نظام واتساب المحسّن');
    }
}

// تفعيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.enhancedWhatsApp = new EnhancedWhatsAppSystem();
    window.enhancedWhatsApp.init();
});

// تفعيل إضافي بعد تحميل الصفحة بالكامل
window.addEventListener('load', function() {
    setTimeout(() => {
        if (window.enhancedWhatsApp) {
            window.enhancedWhatsApp.updateAllWhatsAppButtons();
        }
    }, 1000);
});