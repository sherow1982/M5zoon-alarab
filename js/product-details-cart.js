/**
 * نظام إضافة المنتج من صفحة التفاصيل للسلة
 * Emirates Gifts Store v2.0
 */

(function() {
    'use strict';
    
    // الانتظار لتحميل بيانات المنتج
    function initializeCartButton() {
        const button = document.getElementById('add-to-cart-btn');
        if (!button) return;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // استخراج بيانات المنتج من الصفحة
            const productData = extractProductData();
            
            if (!productData || !productData.id) {
                if (window.NotificationManager) {
                    window.NotificationManager.error('لم يتم العثور على بيانات المنتج');
                }
                return;
            }
            
            // التعامل مع الزر
            if (window.handleAddToCart) {
                window.handleAddToCart(button, productData);
            }
        });
    }
    
    /**
     * استخراج بيانات المنتج من الصفحة
     */
    function extractProductData() {
        try {
            const titleElement = document.getElementById('product-title');
            const priceElement = document.getElementById('current-price');
            const oldPriceElement = document.getElementById('old-price');
            const imageElement = document.getElementById('product-image');
            const categoryElement = document.getElementById('category-badge');
            
            if (!titleElement || !priceElement) {
                console.error('❌ لم تجد عناصر مطلوبة');
                return null;
            }
            
            // استخراج الرقم من السعر
            const priceText = priceElement.textContent.replace(/[^٠-٩\d]/g, '');
            const oldPriceText = oldPriceElement ? oldPriceElement.textContent.replace(/[^٠-٩\d]/g, '') : priceText;
            
            // الحصول على ID من URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id') || 'product_' + Date.now();
            
            const productData = {
                id: productId,
                title: titleElement.textContent.trim(),
                price: parseFloat(oldPriceText || priceText || '0'),
                sale_price: parseFloat(priceText || '0'),
                image_link: imageElement ? imageElement.src : '',
                category: categoryElement ? categoryElement.textContent.trim() : 'عام',
                type: 'PRODUCT'
            };
            
            console.log('📦 بيانات المنتج:', productData);
            return productData;
        } catch (error) {
            console.error('❌ خطأ في استخراج البيانات:', error);
            return null;
        }
    }
    
    /**
     * تحديث رابط الواتساب
     */
    function setupWhatsAppLink() {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (!whatsappBtn) return;
        
        const productTitle = document.getElementById('product-title');
        const currentPrice = document.getElementById('current-price');
        
        if (productTitle && currentPrice) {
            const message = `أود شراء %3A آ
${encodeURIComponent(productTitle.textContent)}
${encodeURIComponent(currentPrice.textContent)}`;
            
            whatsappBtn.href = `https://wa.me/201110760081?text=${message}`;
        }
    }
    
    /**
     * التهيئة
     */
    function initialize() {
        console.log('🛒 بدء معالجة السلة لصفحة التفاصيل...');
        
        // الانتظار صغير للبيانات التي تحمل عبر product-details.js
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    initializeCartButton();
                    setupWhatsAppLink();
                }, 100);
            });
        } else {
            setTimeout(() => {
                initializeCartButton();
                setupWhatsAppLink();
            }, 100);
        }
    }
    
    // بدء التهيئة
    initialize();
    
    // معالجة الأخطاء
    window.addEventListener('error', function(e) {
        console.error('❌ خطأ عام:', e.error);
    });
})();
