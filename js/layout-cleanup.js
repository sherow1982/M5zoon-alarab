/**
 * نظام تنظيف وإصلاح تخطيط متجر هدايا الإمارات
 * يقوم بإزالة العناصر العشوائية وتحسين العرض
 */

(function() {
    'use strict';

    // قائمة بالعناصر الغير مرغوب فيها
    const UNWANTED_SELECTORS = [
        '.random-product-message',
        '.product-description-overlay', 
        '.floating-text',
        '.overlay-text',
        '.random-text',
        '.product-overlay-text',
        '.product-floating-description',
        '.random-product-info',
        '.product-random-text',
        '.overlay-product-info',
        '.floating-product-text'
    ];

    // قائمة بالنصوص الغير مرغوب فيها
    const UNWANTED_TEXTS = [
        'عطر فاخر بتركيبة عالية الجودة وثباته ممتاز وتجاذبية',
        'عطر أو طلب',
        'عالية الجودة وثباته',
        'سعة ورويس'
    ];

    /**
     * إزالة العناصر غير المرغوب فيها
     */
    function removeUnwantedElements() {
        UNWANTED_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.opacity = '0';
                element.remove();
            });
        });
    }

    /**
     * تنظيف النصوص غير المرغوب فيها
     */
    function cleanUnwantedTexts() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.children.length === 0) { // عنصر يحتوي على نص فقط
                const text = element.textContent || element.innerText || '';
                UNWANTED_TEXTS.forEach(unwantedText => {
                    if (text.includes(unwantedText)) {
                        element.style.display = 'none';
                        element.remove();
                    }
                });
            }
        });
    }

    /**
     * إصلاح تخطيط بطاقات المنتجات
     */
    function fixProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // إزالة أي عناصر إضافية غير مرغوب فيها
            const unwantedInCard = card.querySelectorAll(':not(.product-image):not(.product-content):not(.product-actions):not(.product-title):not(.product-price):not(.product-rating)');
            unwantedInCard.forEach(element => {
                if (!element.closest('.product-content') && !element.closest('.product-actions')) {
                    const text = element.textContent || '';
                    if (text.includes('عطر') || text.includes('فاخر') || text.includes('جودع')) {
                        element.remove();
                    }
                }
            });

            // التأكد من وجود العناصر الأساسية
            if (!card.querySelector('.product-actions')) {
                // إضافة أزرار الإجراءات إذا لم تكن موجودة
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'product-actions';
                
                const productId = card.dataset.productId || '1';
                const productTitle = card.querySelector('.product-title')?.textContent || 'عطر مميز';
                
                actionsDiv.innerHTML = `
                    <a href="./product.html?id=${productId}" class="product-action-btn action-view" target="_blank" title="عرض المنتج">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="https://wa.me/201110760081?text=مرحبا، %20أريد%20طلب%20${encodeURIComponent(productTitle)}" 
                       class="product-action-btn action-whatsapp" target="_blank" title="طلب عبر واتساپ">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <button class="product-action-btn action-quick-order" onclick="quickOrder('${productId}', '${productTitle}')" title="طلب سريع">
                        <i class="fas fa-bolt"></i>
                    </button>
                    <button class="product-action-btn action-cart" onclick="addToCart('${productId}', '${productTitle}')" title="إضافة للسلة">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                `;
                
                card.appendChild(actionsDiv);
            }
        });
    }

    /**
     * إزالة العناصر العائمة في مواضع غير مناسبة
     */
    function removeFloatingElements() {
        const floatingElements = document.querySelectorAll('[style*="position: absolute"], [style*="position: fixed"]');
        floatingElements.forEach(element => {
            const text = element.textContent || element.innerText || '';
            const isUnwanted = UNWANTED_TEXTS.some(unwantedText => text.includes(unwantedText));
            
            if (isUnwanted && !element.closest('.header') && !element.closest('.footer') && 
                !element.closest('.notification-buttons') && !element.closest('.back-to-top')) {
                element.remove();
            }
        });
    }

    /**
     * تحسين أداء الموقع
     */
    function improvePerformance() {
        // حذف العناصر المخفية
        const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]');
        hiddenElements.forEach(element => {
            if (!element.classList.contains('mobile-sidebar') && 
                !element.classList.contains('mobile-overlay') &&
                !element.id.includes('modal') &&
                !element.id.includes('popup')) {
                element.remove();
            }
        });
        
        // تحسين الصور
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    /**
     * تنظيف شامل للموقع
     */
    function performFullCleanup() {
        removeUnwantedElements();
        cleanUnwantedTexts();
        fixProductCards();
        removeFloatingElements();
        improvePerformance();
        
        console.log('🧹 تم تنظيف وإصلاح متجر هدايا الإمارات');
    }

    /**
     * مراقب تغييرات DOM
     */
    function setupDOMObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldClean = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const text = node.textContent || node.innerText || '';
                            const isUnwanted = UNWANTED_TEXTS.some(unwantedText => text.includes(unwantedText));
                            
                            if (isUnwanted || UNWANTED_SELECTORS.some(selector => 
                                node.matches && node.matches(selector))) {
                                shouldClean = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldClean) {
                setTimeout(performFullCleanup, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        
        return observer;
    }

    /**
     * بدء نظام التنظيف
     */
    function initialize() {
        // تنظيف أولي
        performFullCleanup();
        
        // إعداد مراقب DOM
        const observer = setupDOMObserver();
        
        // تنظيف دوري
        const cleanupInterval = setInterval(performFullCleanup, 5000);
        
        // تنظيف عند تغيير الصفحة
        window.addEventListener('beforeunload', function() {
            clearInterval(cleanupInterval);
            observer.disconnect();
        });
        
        // تنظيف عند تحميل المحتوى
        window.addEventListener('load', function() {
            setTimeout(performFullCleanup, 1000);
        });
        
        console.log('✨ تم تفعيل نظام تنظيف متجر هدايا الإمارات');
    }

    // بدء النظام عند تحميل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // تصدير الوظائف للاستخدام العام
    window.EmiratesGiftsCleanup = {
        performFullCleanup,
        removeUnwantedElements,
        fixProductCards
    };

})();