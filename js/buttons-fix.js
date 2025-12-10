// ملف إصلاح شامل لأزرار بطاقات المنتجات - متجر هدايا الإمارات
// نسخة مصححة نحوياً مع حل مشاكل أيقونة العين والتقييمات

(function() {
    'use strict';
    
    let ratingsData = {};
    let isInitialized = false;
    
    async function loadRatingsData() {
        try {
            const response = await fetch('./data/ratings.json');
            if (response.ok) {
                const ratings = await response.json();
                ratings.forEach(rating => {
                    ratingsData[rating.id.toString()] = rating;
                });
                console.log('✅ تم تحميل بيانات التقييمات');
            }
        } catch (error) {
            console.warn('خطأ في تحميل التقييمات:', error);
        }
    }
    
    function fixAddToCartButtons() {
        const addButtons = document.querySelectorAll('.btn-add-to-cart, .btn-add-cart');
        
        addButtons.forEach((button, index) => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.disabled) return;
                
                const originalHTML = this.innerHTML;
                const originalBg = this.style.backgroundColor || '';
                
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
                this.disabled = true;
                this.style.backgroundColor = '#95a5a6';
                this.style.transform = 'scale(0.95)';
                
                let productData = this.getAttribute('data-product');
                
                if (!productData) {
                    const card = this.closest('.product-card');
                    if (card) {
                        const title = card.querySelector('.product-title, h3, .item-title')?.textContent?.trim() || 'منتج';
                        const priceElement = card.querySelector('.current-price, .sale-price, .price');
                        const price = priceElement ? priceElement.textContent.replace(/[^0-9.]/g, '') || '100' : '100';
                        const image = card.querySelector('img')?.src || '';
                        const productId = card.getAttribute('data-product-id') || 'temp-' + Date.now();
                        
                        productData = JSON.stringify({
                            id: productId,
                            title: title,
                            price: price,
                            sale_price: price,
                            image_link: image,
                            image: image
                        });
                    }
                }
                
                setTimeout(() => {
                    try {
                        if (productData) {
                            const product = JSON.parse(productData);
                            let cart = JSON.parse(localStorage.getItem('emirates-gifts-cart') || '[]');
                            
                            const existingIndex = cart.findIndex(item => item.id === product.id);
                            if (existingIndex !== -1) {
                                cart[existingIndex].quantity += 1;
                            } else {
                                cart.push({
                                    ...product,
                                    quantity: 1,
                                    addedAt: new Date().toISOString()
                                });
                            }
                            
                            localStorage.setItem('emirates-gifts-cart', JSON.stringify(cart));
                            updateCartBadgeQuick();
                            showQuickSuccessMessage(product.title);
                            
                            this.innerHTML = '<i class="fas fa-check"></i> تم!';
                            this.style.backgroundColor = '#27ae60';
                            this.style.transform = 'scale(1)';
                        } else {
                            throw new Error('لا توجد بيانات منتج');
                        }
                    } catch (error) {
                        console.error('خطأ في الإضافة:', error);
                        this.innerHTML = '<i class="fas fa-times"></i> خطأ';
                        this.style.backgroundColor = '#e74c3c';
                    }
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.backgroundColor = originalBg;
                        this.style.transform = 'scale(1)';
                        this.disabled = false;
                    }, 3000);
                }, 800);
            });
        });
    }
    
    function fixEyeButtons() {
        document.addEventListener('click', function(e) {
            const eyeButton = e.target.closest('.overlay-btn');
            const hasEyeIcon = eyeButton && (eyeButton.querySelector('.fa-eye') || eyeButton.innerHTML.includes('fa-eye'));
            
            if (hasEyeIcon) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = eyeButton.closest('.product-card');
                let productId = null;
                let category = null;
                
                if (card) {
                    productId = card.getAttribute('data-product-id') || card.getAttribute('data-id');
                    
                    // استنتاج الفئة من نص البطاقة أو العنوان
                    const titleText = card.querySelector('.product-title')?.textContent || '';
                    const catText = card.querySelector('.product-category')?.textContent || '';
                    const badgeText = card.querySelector('.category-badge, .product-category-badge')?.textContent || '';
                    const allText = `${titleText} ${catText} ${badgeText}`.toLowerCase();
                    
                    if (/ساعات|ساعة|watch|rolex|omega|patek|audemars|cartier|breitling|burberry|emporio|versace/i.test(allText)) {
                        category = 'watch';
                    } else if (/عطور|عطر|perfume|fragrance|فرانشي|بيتر/i.test(allText)) {
                        category = 'perfume';
                    } else {
                        // تخمين ذكي: إذا كان العنوان يحتوي على أسماء ماركات ساعات مشهورة
                        if (/Rolex|ROLEX|rolex|Omega|OMEGA|omega|GMT|Datejust|Submariner|Daytona|Ultra/i.test(titleText)) {
                            category = 'watch';
                        } else {
                            category = 'perfume'; // افتراضي
                        }
                    }
                    
                    console.log(`🔍 تم استنتاج الفئة: ${category} للمنتج: ${titleText}`);
                    
                    if (!productId) {
                        const productDataAttr = card.querySelector('[data-product]')?.getAttribute('data-product');
                        if (productDataAttr) {
                            try {
                                const productObj = JSON.parse(productDataAttr);
                                productId = productObj.id;
                            } catch (err) {
                                console.warn('خطأ في parsing:', err);
                            }
                        }
                    }
                    
                    if (productId) {
                        const detailsURL = `./product-details.html?id=${productId}&category=${category}`;
                        console.log(`✅ فتح رابط: ${detailsURL}`);
                        window.location.href = detailsURL;
                    } else {
                        console.warn('❌ لم يتم العثور على معرف المنتج');
                        alert('عذراً، لا يمكن عرض تفاصيل هذا المنتج حالياً');
                    }
                } else {
                    console.warn('❌ لم يتم العثور على بطاقة المنتج');
                    alert('عذراً، حدث خطأ في فتح صفحة التفاصيل');
                }
            }
        }, { passive: false, capture: true });
    }
    
    function updateCartBadgeQuick() {
        const cart = JSON.parse(localStorage.getItem('emirates-gifts-cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const selectors = ['.cart-badge', '#cartBadge', '.cart-counter', '#cart-count'];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.textContent = totalItems;
                    element.style.display = totalItems > 0 ? 'flex' : 'none';
                    if (totalItems > 0) {
                        element.classList.add('has-items');
                        element.style.animation = 'cartBounce 0.6s ease-out';
                    } else {
                        element.classList.remove('has-items');
                    }
                }
            });
        });
    }
    
    function showQuickSuccessMessage(productTitle) {
        const existing = document.querySelectorAll('.quick-success, .success-notification, .cart-notification');
        existing.forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = 'quick-success';
        notification.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <div class="success-text">
                    <strong>تم الإضافة!</strong>
                    <p>"${productTitle.length > 30 ? productTitle.substring(0, 30) + '...' : productTitle}"</p>
                </div>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed', top: '20px', right: '20px', background: 'linear-gradient(135deg, #25D366, #20B358)', color: 'white', padding: '18px 22px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)', zIndex: '10000', fontFamily: 'Cairo, sans-serif', fontWeight: '600', maxWidth: '320px', animation: 'quickSlideIn 0.4s ease-out', border: '2px solid rgba(255,255,255,0.3)'
        });
        
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'quickSlideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3500);
    }
    
    function addRatingsToCards() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const productId = card.getAttribute('data-product-id');
            const ratingContainer = card.querySelector('.product-rating');
            if (productId && ratingContainer && !ratingContainer.classList.contains('enhanced')) {
                const rating = ratingsData[productId] || getDefaultRating();
                const stars = '★'.repeat(Math.floor(rating.rating));
                ratingContainer.classList.add('enhanced');
                ratingContainer.innerHTML = `
                    <div class="stars">${stars}</div>
                    <span class="rating-text">(${rating.rating.toFixed(1)} • ${rating.count} تقييم)</span>
                `;
                if (rating.professional_review) {
                    const reviewBadge = document.createElement('div');
                    reviewBadge.className = 'professional-review-badge';
                    reviewBadge.innerHTML = `<i class="fas fa-check-circle"></i> ${rating.professional_review}`;
                    Object.assign(reviewBadge.style, { background: 'rgba(39, 174, 96, 0.1)', color: '#27ae60', padding: '6px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: '600', margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(39, 174, 96, 0.2)' });
                    ratingContainer.parentNode.insertBefore(reviewBadge, ratingContainer.nextSibling);
                }
            }
        });
    }
    
    function getDefaultRating() {
        return { rating: 4.5 + Math.random() * 0.4, count: Math.floor(Math.random() * 100 + 50), professional_review: '✓ منتج عالي الجودة' };
    }
    
    function addQuickFixCSS() {
        if (!document.querySelector('#buttons-fix-css')) {
            const style = document.createElement('style');
            style.id = 'buttons-fix-css';
            style.textContent = `
                @keyframes quickSlideIn { 0% { transform: translateX(100%) scale(0.8); opacity: 0; } 100% { transform: translateX(0) scale(1); opacity: 1; } }
                @keyframes quickSlideOut { 0% { transform: translateX(0) scale(1); opacity: 1; } 100% { transform: translateX(100%) scale(0.8); opacity: 0; } }
                @keyframes cartBounce { 0%, 20%, 50%, 80%, 100% { transform: scale(1); } 40% { transform: scale(1.2); } 60% { transform: scale(1.1); } }
                .quick-success .success-content { display: flex; align-items: flex-start; gap: 12px; }
                .btn-add-to-cart, .btn-add-cart { cursor: pointer !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
                .overlay-btn { cursor: pointer !important; transition: all 0.2s ease; }
                .cart-badge, .cart-counter { position: absolute; top: -6px; left: -6px; background: #e74c3c; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; z-index: 5; }
                .professional-review-badge { animation: fadeInUp 0.5s ease-out; }
                @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
            `;
            document.head.appendChild(style);
        }
    }
    
    async function initButtonsFix() {
        if (isInitialized) return;
        isInitialized = true;
        addQuickFixCSS();
        await loadRatingsData();
        fixAddToCartButtons();
        fixEyeButtons();
        setTimeout(() => { addRatingsToCards(); }, 2000);
        updateCartBadgeQuick();
    }
    
    function refixDynamicButtons() {
        setTimeout(() => {
            const newButtons = document.querySelectorAll('.btn-add-to-cart:not([data-fixed]), .btn-add-cart:not([data-fixed])');
            if (newButtons.length > 0) {
                fixAddToCartButtons();
                addRatingsToCards();
            }
        }, 2000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { initButtonsFix(); refixDynamicButtons(); });
    } else { initButtonsFix(); refixDynamicButtons(); }
    
    window.addEventListener('pageshow', (e) => { if (e.persisted) { setTimeout(() => { initButtonsFix(); refixDynamicButtons(); }, 500); } });
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const hasNewCards = Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && (node.classList?.contains('product-card') || node.querySelector?.('.product-card')));
                if (hasNewCards) { setTimeout(() => { fixAddToCartButtons(); fixEyeButtons(); addRatingsToCards(); }, 1000); }
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    window.ButtonsFix = { fixAddToCartButtons, fixEyeButtons, updateCartBadgeQuick, showQuickSuccessMessage, addRatingsToCards, refixDynamicButtons, ratingsData: () => ratingsData };
})();