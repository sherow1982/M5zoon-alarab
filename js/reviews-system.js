// نظام التقييمات الإماراتي الاحترافي - متجر هدايا الإمارات
// تم تحديثه ليعمل مع البيانات الجديدة في data/reviews.json

// الكائن الرئيسي للنظام
window.persistentReviews = {
    reviewsData: null,
    isInitialized: false,
    
    // تحميل بيانات التقييمات
    async loadReviewsData() {
        try {
            const response = await fetch('./data/reviews.json?t=' + Date.now());
            if (!response.ok) {
                throw new Error('Failed to load reviews data');
            }
            this.reviewsData = await response.json();
            console.log('✅ تم تحميل التقييمات الإماراتية:', this.reviewsData?.length, 'منتج');
            return true;
        } catch (error) {
            console.warn('⚠️ خطأ في تحميل التقييمات:', error);
            this.reviewsData = [];
            return false;
        }
    },
    
    // البحث عن تقييمات منتج محدد
    getProductReviews(productId) {
        if (!this.reviewsData) return null;
        return this.reviewsData.find(p => p.productId === productId.toString());
    },
    
    // إنشاء ملخص التقييمات
    createSummaryHTML(productId) {
        const productReviews = this.getProductReviews(productId);
        
        if (!productReviews || !productReviews.reviews?.length) {
            return `
                <div class="rating-summary-minimal">
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <span class="rating-text">منتج عالي الجودة</span>
                </div>
            `;
        }
        
        const { averageRating, totalCount, reviews } = productReviews;
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = (averageRating % 1) >= 0.5;
        const starsHTML = '⭐'.repeat(fullStars) + (hasHalfStar ? '⭐' : '');
        
        // إحصائيات إضافية
        const verifiedCount = reviews.filter(r => r.verified).length;
        const recentReviews = reviews.slice(0, 2);
        
        return `
            <div class="emirates-rating-summary">
                <div class="main-rating">
                    <div class="stars-display">${starsHTML}</div>
                    <div class="rating-number">${averageRating}</div>
                    <div class="rating-label">من 5 نجوم</div>
                </div>
                <div class="rating-stats">
                    <div class="stat-item">
                        <i class="fas fa-users"></i>
                        <span>${totalCount} تقييم</span>
                    </div>
                    <div class="stat-item verified">
                        <i class="fas fa-shield-check"></i>
                        <span>${verifiedCount} موثّق</span>
                    </div>
                </div>
                <div class="recent-reviews">
                    ${recentReviews.map(review => `
                        <div class="mini-review">
                            <div class="review-author">
                                ${review.author} ${review.verified ? '✅' : ''}
                                ${review.location ? `(${review.location})` : ''}
                            </div>
                            <div class="review-stars">${'⭐'.repeat(review.rating)}</div>
                            <div class="review-comment">${review.comment}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    // إنشاء تقييمات مفصلة للمنتج
    createDetailedReviewsHTML(productId, options = {}) {
        const {
            showFilter = false,
            showLoadMore = false,
            initialLimit = 10,
            filter = 'all'
        } = options;
        
        const productReviews = this.getProductReviews(productId);
        
        if (!productReviews || !productReviews.reviews?.length) {
            return `
                <div class="no-reviews">
                    <i class="fas fa-star-o"></i>
                    <p>لا توجد تقييمات لهذا المنتج حالياً</p>
                    <small>كن أول من يقيم هذا المنتج!</small>
                </div>
            `;
        }
        
        let { reviews, averageRating, totalCount } = productReviews;
        
        // تطبيق الفلتر
        if (filter === 'verified') {
            reviews = reviews.filter(r => r.verified);
        } else if (filter === 'high-rating') {
            reviews = reviews.filter(r => r.rating >= 4);
        }
        
        // تحديد العدد المعروض
        const displayReviews = reviews.slice(0, initialLimit);
        const hasMore = reviews.length > initialLimit;
        
        let html = `
            <div class="detailed-reviews-container">
                <div class="reviews-header">
                    <h3>📝 تقييمات العملاء (${totalCount})</h3>
                    <div class="overall-rating">
                        <span class="big-rating">${averageRating}</span>
                        <div class="stars-big">${'⭐'.repeat(Math.floor(averageRating))}</div>
                    </div>
                </div>
        `;
        
        // إضافة فلاتر إذا طلبت
        if (showFilter) {
            html += `
                <div class="reviews-filters">
                    <button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="filterReviews('all')">الكل</button>
                    <button class="filter-btn verified ${filter === 'verified' ? 'active' : ''}" onclick="filterReviews('verified')">موثّق</button>
                    <button class="filter-btn high-rating ${filter === 'high-rating' ? 'active' : ''}" onclick="filterReviews('high-rating')">4-5 نجوم</button>
                </div>
            `;
        }
        
        // إضافة التقييمات
        html += '<div class="reviews-list">';
        displayReviews.forEach(review => {
            const reviewDate = new Date(review.date);
            const timeAgo = this.getTimeAgo(reviewDate);
            const starsCount = review.rating;
            const starsHTML = '⭐'.repeat(starsCount);
            const avatarLetter = review.author.charAt(0);
            
            html += `
                <div class="review-card ${review.verified ? 'verified' : ''}">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${avatarLetter}</div>
                        <div class="reviewer-details">
                            <h4>${review.author}</h4>
                            ${review.location ? `<div class="reviewer-location">${review.location}</div>` : ''}
                        </div>
                        ${review.verified ? '<div class="verified-badge">موثّق</div>' : ''}
                    </div>
                    
                    <div class="review-rating">
                        <div class="review-stars">${starsHTML}</div>
                        <div class="review-date">${timeAgo}</div>
                    </div>
                    
                    <div class="review-comment">${review.comment}</div>
                    
                    <div class="review-actions">
                        <button class="helpful-btn" onclick="markHelpful('${review.id}')">
                            مفيد (${review.helpful || 0})
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>'; // إغلاق reviews-list
        
        // إضافة زر المزيد إذا طلب
        if (showLoadMore && hasMore) {
            html += `
                <button class="show-more-btn" onclick="loadMoreReviews()">
                    عرض المزيد من التقييمات (${reviews.length - initialLimit} متبقي)
                </button>
            `;
        }
        
        html += '</div>'; // إغلاق detailed-reviews-container
        
        return html;
    },
    
    // حساب الوقت المنقضي
    getTimeAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'اليوم';
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `منذ ${diffDays} أيام`;
        if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
        if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} شهر`;
        return `منذ ${Math.floor(diffDays / 365)} سنة`;
    },
    
    // إضافة التقييمات للبطاقات
    addReviewsToCards() {
        if (!this.reviewsData) return;
        
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const titleElement = card.querySelector('.product-title, h3, .card-title');
            if (titleElement && !card.querySelector('.card-rating')) {
                const productId = card.getAttribute('data-id') || 
                                 titleElement.getAttribute('data-id') ||
                                 this.extractIdFromCard(card);
                
                if (productId) {
                    const productReviews = this.getProductReviews(productId);
                    if (productReviews) {
                        const ratingHTML = this.createCardRatingHTML(productReviews.averageRating, productReviews.totalCount);
                        titleElement.insertAdjacentHTML('afterend', ratingHTML);
                    }
                }
            }
        });
    },
    
    // استخراج معرف المنتج من البطاقة
    extractIdFromCard(card) {
        // محاولة استخراج المعرف من الروابط
        const link = card.querySelector('a[href*="id="]');
        if (link) {
            const href = link.getAttribute('href');
            const match = href.match(/id=([^&]+)/);
            if (match) return match[1];
        }
        
        // محاولة من العنوان
        const title = card.querySelector('.product-title, h3')?.textContent || '';
        return this.guessProductId(title);
    },
    
    // تخمين معرف المنتج من العنوان
    guessProductId(title) {
        const titleLower = title.toLowerCase();
        
        // قوائم المطابقة
        if (titleLower.includes('كوكو شانيل')) return 'perfume_1';
        if (titleLower.includes('جوتشي فلورا')) return 'perfume_2';
        if (titleLower.includes('جوتشي بلوم')) return 'perfume_3';
        if (titleLower.includes('سوفاج ديور')) return 'perfume_4';
        if (titleLower.includes('فرزاتشي ايروس')) return 'perfume_5';
        if (titleLower.includes('رولكس يخت ماستر')) return 'watch_1';
        if (titleLower.includes('rolex كلاسيكية')) return 'watch_2';
        if (titleLower.includes('رولكس بتصميم الكعبة')) return 'watch_88';
        
        return null;
    },
    
    // إنشاء HTML للتقييم في البطاقة
    createCardRatingHTML(rating, count) {
        const stars = '⭐'.repeat(Math.floor(rating));
        return `
            <div class="card-rating emirates-style">
                <div class="stars">${stars}</div>
                <div class="rating-info">
                    <span class="rating-number">${rating}</span>
                    <span class="reviews-count">(${count})</span>
                </div>
            </div>
        `;
    },
    
    // تهيئة النظام
    async init() {
        console.log('🔄 بدء تحميل نظام التقييمات الإماراتي...');
        
        // تحميل CSS
        this.addCSS();
        
        // تحميل البيانات
        const success = await this.loadReviewsData();
        
        if (success) {
            // إضافة التقييمات للبطاقات الموجودة
            setTimeout(() => this.addReviewsToCards(), 1000);
            
            // مراقب للمحتوى الجديد
            this.setupObserver();
            
            this.isInitialized = true;
            console.log('✅ تم تهيئة نظام التقييمات بنجاح');
        } else {
            console.warn('⚠️ فشل في تهيئة نظام التقييمات');
        }
    },
    
    // إضافة مراقب للتغييرات
    setupObserver() {
        const observer = new MutationObserver(() => {
            this.addReviewsToCards();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },
    
    // إضافة CSS
    addCSS() {
        if (document.querySelector('#emirates-reviews-system-css')) return;
        
        const css = `
            <style id="emirates-reviews-system-css">
            .card-rating.emirates-style {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 12px 0;
                padding: 12px;
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
                border: 1px solid rgba(212, 175, 55, 0.2);
                border-radius: 12px;
                direction: rtl;
            }
            
            .card-rating .stars {
                font-size: 18px;
                letter-spacing: 2px;
                filter: drop-shadow(0 1px 2px rgba(212, 175, 55, 0.3));
            }
            
            .card-rating .rating-info {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .card-rating .rating-number {
                font-weight: 700;
                color: #D4AF37;
                font-size: 16px;
            }
            
            .card-rating .reviews-count {
                color: #666;
                font-size: 13px;
            }
            
            .emirates-rating-summary {
                background: linear-gradient(135deg, #ffffff, #f9f9f9);
                border: 2px solid #D4AF37;
                border-radius: 15px;
                padding: 25px;
                margin: 20px 0;
                direction: rtl;
                text-align: center;
            }
            
            .main-rating {
                margin-bottom: 20px;
            }
            
            .stars-display {
                font-size: 32px;
                margin-bottom: 10px;
                letter-spacing: 3px;
                filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.4));
            }
            
            .rating-number {
                font-size: 42px;
                font-weight: 900;
                color: #D4AF37;
                display: block;
                text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
            }
            
            .rating-label {
                color: #666;
                font-size: 16px;
                margin-top: 5px;
            }
            
            .rating-stats {
                display: flex;
                justify-content: center;
                gap: 25px;
                margin: 20px 0;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 20px;
                border: 1px solid rgba(212, 175, 55, 0.2);
            }
            
            .stat-item.verified {
                background: rgba(0, 161, 107, 0.1);
                border-color: rgba(0, 161, 107, 0.3);
                color: #00A16B;
            }
            
            .recent-reviews {
                margin-top: 25px;
                display: grid;
                gap: 15px;
                text-align: right;
            }
            
            .mini-review {
                background: #ffffff;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #e8ecef;
                border-right: 4px solid #D4AF37;
            }
            
            .review-author {
                font-weight: 600;
                color: #333;
                margin-bottom: 5px;
            }
            
            .review-stars {
                font-size: 14px;
                margin-bottom: 8px;
            }
            
            .review-comment {
                font-size: 14px;
                color: #555;
                line-height: 1.5;
            }
            
            .rating-summary-minimal {
                text-align: center;
                padding: 15px;
                background: rgba(212, 175, 55, 0.1);
                border-radius: 10px;
                margin: 15px 0;
            }
            
            .rating-summary-minimal .stars {
                font-size: 20px;
                margin-bottom: 5px;
            }
            
            .rating-summary-minimal .rating-text {
                color: #D4AF37;
                font-weight: 600;
            }
            
            @media (max-width: 768px) {
                .rating-stats {
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                
                .stars-display {
                    font-size: 28px;
                }
                
                .rating-number {
                    font-size: 36px;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', css);
    }
};

// دوال مساعدة للتفاعل
function markHelpful(reviewId) {
    // حفظ في localStorage
    const helpfulReviews = JSON.parse(localStorage.getItem('helpfulReviews') || '[]');
    if (!helpfulReviews.includes(reviewId)) {
        helpfulReviews.push(reviewId);
        localStorage.setItem('helpfulReviews', JSON.stringify(helpfulReviews));
        
        // تحديث العرض
        const button = event.target;
        button.classList.add('voted');
        button.disabled = true;
        button.textContent = button.textContent.replace(/\((\d+)\)/, (match, num) => `(${parseInt(num) + 1})`);
    }
}

function filterReviews(filter) {
    // إعادة تحميل التقييمات بالفلتر الجديد
    const productId = new URLSearchParams(window.location.search).get('id');
    if (productId) {
        const detailedHTML = window.persistentReviews.createDetailedReviewsHTML(productId, {
            showFilter: true,
            showLoadMore: true,
            initialLimit: 5,
            filter: filter
        });
        
        const container = document.getElementById('detailed-reviews-container');
        if (container) {
            container.innerHTML = detailedHTML;
        }
    }
}

function loadMoreReviews() {
    // منطق تحميل المزيد
    console.log('تحميل المزيد من التقييمات...');
}

// تهيئة النظام عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    window.persistentReviews.init();
});

// إعادة تهيئة عند تغيير الصفحة
if (typeof window.navigation !== 'undefined') {
    window.navigation.addEventListener('navigate', () => {
        setTimeout(() => window.persistentReviews.addReviewsToCards(), 1000);
    });
}

console.log('📋 نظام التقييمات الإماراتي جاهز للتشغيل');
