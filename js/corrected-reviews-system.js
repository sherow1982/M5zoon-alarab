// نظام التقييمات المصحح - متجر هدايا الإمارات
// توزيع صحيح للتقييمات حسب فئات المنتجات

class CorrectedReviewsSystem {
    constructor() {
        this.reviews = {};
        this.helpfulVotes = {};
        this.init();
    }

    async init() {
        try {
            await this.loadReviews();
            this.loadHelpfulVotes();
            this.displayCorrectReviews();
        } catch (error) {
            console.error('خطأ في تحميل التقييمات:', error);
        }
    }

    async loadReviews() {
        try {
            const response = await fetch('/data/corrected-reviews.json');
            if (!response.ok) {
                throw new Error('فشل في تحميل التقييمات');
            }
            this.reviews = await response.json();
        } catch (error) {
            console.error('خطأ في تحميل التقييمات:', error);
            // استخدام تقييمات افتراضية في حالة الفشل
            this.reviews = this.getDefaultReviews();
        }
    }

    loadHelpfulVotes() {
        const stored = localStorage.getItem('emirates_review_votes');
        this.helpfulVotes = stored ? JSON.parse(stored) : {};
    }

    saveHelpfulVotes() {
        localStorage.setItem('emirates_review_votes', JSON.stringify(this.helpfulVotes));
    }

    // تحديد فئة المنتج بدقة عالية
    detectProductCategory() {
        const url = window.location.pathname;
        const title = document.title?.toLowerCase() || '';
        const h1 = document.querySelector('h1')?.textContent?.toLowerCase() || '';
        
        const searchText = (url + ' ' + title + ' ' + h1).toLowerCase();
        
        // فئة الساعات
        if (searchText.includes('ساعة') || 
            searchText.includes('watch') ||
            searchText.includes('rolex') ||
            searchText.includes('omega') ||
            searchText.includes('patek') ||
            searchText.includes('أوميغا') ||
            searchText.includes('رولكس')) {
            return 'watches';
        }
        
        // فئة العطور
        if (searchText.includes('عطر') ||
            searchText.includes('perfume') ||
            searchText.includes('fragrance') ||
            searchText.includes('cologne') ||
            searchText.includes('tom-ford') ||
            searchText.includes('chanel') ||
            searchText.includes('dior') ||
            searchText.includes('شانيل') ||
            searchText.includes('ديور') ||
            searchText.includes('توم فورد')) {
            return 'perfumes';
        }
        
        // فئة المجوهرات
        if (searchText.includes('مجوهرات') ||
            searchText.includes('jewelry') ||
            searchText.includes('ring') ||
            searchText.includes('necklace') ||
            searchText.includes('bracelet') ||
            searchText.includes('خاتم') ||
            searchText.includes('قلادة') ||
            searchText.includes('أسوار')) {
            return 'jewelry';
        }
        
        // فئة الإكسسوارات
        if (searchText.includes('إكسسوار') ||
            searchText.includes('accessory') ||
            searchText.includes('حقيبة') ||
            searchText.includes('bag') ||
            searchText.includes('بوكس') ||
            searchText.includes('box')) {
            return 'accessories';
        }
        
        return 'general';
    }

    // عرض التقييمات الصحيحة حسب فئة المنتج
    displayCorrectReviews() {
        const category = this.detectProductCategory();
        const categoryReviews = this.reviews[category] || this.reviews.general || [];
        
        // عرض التقييمات في البطاقات
        this.displayReviewsInCards(categoryReviews);
        
        // عرض التقييمات في صفحة تفاصيل المنتج
        this.displayDetailedReviews(categoryReviews);
        
        // تحديث معدل التقييم
        this.updateOverallRating(categoryReviews);
    }

    displayReviewsInCards(reviews) {
        document.querySelectorAll('.product-card, .product-item').forEach(card => {
            const reviewsContainer = card.querySelector('.reviews-summary, .product-reviews');
            if (reviewsContainer && reviews.length > 0) {
                const randomReviews = this.getRandomReviews(reviews, 2);
                reviewsContainer.innerHTML = this.generateCardReviewsHTML(randomReviews);
            }
        });
    }

    displayDetailedReviews(reviews) {
        const detailedContainer = document.querySelector('#detailed-reviews, .reviews-section-detailed');
        if (detailedContainer && reviews.length > 0) {
            detailedContainer.innerHTML = this.generateDetailedReviewsHTML(reviews);
            this.attachReviewEventListeners();
        }
    }

    generateCardReviewsHTML(reviews) {
        const avgRating = this.calculateAverageRating(reviews);
        const starsHTML = this.generateStarsHTML(avgRating);
        
        return `
            <div class="reviews-summary-card">
                <div class="rating-display">
                    <span class="avg-rating">${avgRating.toFixed(1)}</span>
                    <div class="stars">${starsHTML}</div>
                    <span class="review-count">(${reviews.length})</span>
                </div>
                <div class="sample-reviews">
                    ${reviews.slice(0, 2).map(review => `
                        <div class="mini-review">
                            <div class="mini-reviewer">${review.customerName}</div>
                            <div class="mini-comment">${review.comment.substring(0, 80)}...</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateDetailedReviewsHTML(reviews) {
        const avgRating = this.calculateAverageRating(reviews);
        const starsHTML = this.generateStarsHTML(avgRating);
        
        return `
            <div class="reviews-header">
                <h3>تقييمات العملاء</h3>
                <div class="overall-rating">
                    <div class="avg-rating-large">${avgRating.toFixed(1)}</div>
                    <div class="stars-large">${starsHTML}</div>
                    <div class="total-reviews">من ${reviews.length} تقييم</div>
                </div>
            </div>
            
            <div class="reviews-filters">
                <button class="filter-btn active" data-filter="all">الكل</button>
                <button class="filter-btn" data-filter="verified">موثّق</button>
                <button class="filter-btn" data-filter="5">★ 5</button>
                <button class="filter-btn" data-filter="4">★ 4</button>
                <button class="filter-btn" data-filter="3">★ 3</button>
                <button class="filter-btn" data-filter="2">★ 2</button>
                <button class="filter-btn" data-filter="1">★ 1</button>
            </div>
            
            <div class="reviews-list">
                ${this.generateReviewItemsHTML(reviews.slice(0, 5))}
            </div>
            
            <button class="show-more-reviews" data-loaded="5" data-total="${reviews.length}">
                عرض المزيد (${reviews.length - 5} متبقي)
            </button>
        `;
    }

    generateReviewItemsHTML(reviews) {
        return reviews.map(review => `
            <div class="review-item" data-rating="${review.rating}" data-verified="${review.verified}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-name">${review.customerName}</div>
                        <div class="reviewer-location">${review.location}</div>
                        ${review.verified ? '<span class="verified-badge">✓ موثّق</span>' : ''}
                    </div>
                    <div class="review-date">${this.formatDate(review.date)}</div>
                </div>
                
                <div class="review-rating">
                    <div class="stars">${this.generateStarsHTML(review.rating)}</div>
                    <span class="rating-number">${review.rating}/5</span>
                </div>
                
                <div class="review-content">
                    <p>${review.comment}</p>
                </div>
                
                <div class="review-actions">
                    <button class="helpful-btn" data-review-id="${review.id}">
                        <i class="fas fa-thumbs-up"></i>
                        مفيد (${this.getHelpfulCount(review.id)})
                    </button>
                </div>
            </div>
        `).join('');
    }

    attachReviewEventListeners() {
        // فلاتر التقييمات
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterReviews(e.target.dataset.filter);
            });
        });

        // زر "عرض المزيد"
        const showMoreBtn = document.querySelector('.show-more-reviews');
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => {
                this.showMoreReviews();
            });
        }

        // أزرار "مفيد"
        document.querySelectorAll('.helpful-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleHelpfulVote(e.target.closest('.helpful-btn'));
            });
        });
    }

    filterReviews(filter) {
        // تحديد فئة المنتج الحالية
        const category = this.detectProductCategory();
        const allReviews = this.reviews[category] || this.reviews.general || [];
        
        let filteredReviews = allReviews;
        
        if (filter === 'verified') {
            filteredReviews = allReviews.filter(review => review.verified);
        } else if (filter !== 'all') {
            const rating = parseInt(filter);
            filteredReviews = allReviews.filter(review => review.rating === rating);
        }
        
        // تحديث عرض التقييمات
        const reviewsList = document.querySelector('.reviews-list');
        if (reviewsList) {
            reviewsList.innerHTML = this.generateReviewItemsHTML(filteredReviews);
        }
        
        // تحديث أزرار الفلاتر
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // إعادة ربط الأحداث
        this.attachReviewEventListeners();
    }

    showMoreReviews() {
        const showMoreBtn = document.querySelector('.show-more-reviews');
        const loaded = parseInt(showMoreBtn.dataset.loaded);
        const total = parseInt(showMoreBtn.dataset.total);
        const category = this.detectProductCategory();
        const allReviews = this.reviews[category] || this.reviews.general || [];
        
        const newReviews = allReviews.slice(loaded, loaded + 5);
        const reviewsList = document.querySelector('.reviews-list');
        
        reviewsList.innerHTML += this.generateReviewItemsHTML(newReviews);
        
        const newLoaded = loaded + newReviews.length;
        showMoreBtn.dataset.loaded = newLoaded;
        
        if (newLoaded >= total) {
            showMoreBtn.style.display = 'none';
        } else {
            showMoreBtn.innerHTML = `عرض المزيد (${total - newLoaded} متبقي)`;
        }
        
        // إعادة ربط الأحداث
        this.attachReviewEventListeners();
    }

    handleHelpfulVote(button) {
        const reviewId = button.dataset.reviewId;
        
        if (this.hasVoted(reviewId)) {
            this.showMessage('لقد قمت بالتصويت على هذا التقييم من قبل');
            return;
        }
        
        this.voteHelpful(reviewId);
        const newCount = this.getHelpfulCount(reviewId);
        
        button.innerHTML = `
            <i class="fas fa-thumbs-up"></i>
            مفيد (${newCount})
        `;
        
        button.classList.add('voted');
        this.showMessage('شكراً للتصويت!');
    }

    hasVoted(reviewId) {
        return this.helpfulVotes[reviewId] && this.helpfulVotes[reviewId].voted;
    }

    voteHelpful(reviewId) {
        if (!this.helpfulVotes[reviewId]) {
            this.helpfulVotes[reviewId] = { count: 0, voted: false };
        }
        
        this.helpfulVotes[reviewId].count++;
        this.helpfulVotes[reviewId].voted = true;
        
        this.saveHelpfulVotes();
    }

    getHelpfulCount(reviewId) {
        const stored = this.helpfulVotes[reviewId]?.count || 0;
        
        // البحث عن العدد الأصلي في بيانات التقييم
        const category = this.detectProductCategory();
        const categoryReviews = this.reviews[category] || this.reviews.general || [];
        const originalReview = categoryReviews.find(r => r.id === reviewId);
        const originalCount = originalReview ? originalReview.helpful : 0;
        
        return originalCount + stored;
    }

    calculateAverageRating(reviews) {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        return sum / reviews.length;
    }

    generateStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    updateOverallRating(reviews) {
        const avgRating = this.calculateAverageRating(reviews);
        
        // تحديث التقييم الإجمالي في الصفحة
        document.querySelectorAll('.overall-rating-value').forEach(element => {
            element.textContent = avgRating.toFixed(1);
        });
        
        document.querySelectorAll('.overall-stars').forEach(element => {
            element.innerHTML = this.generateStarsHTML(avgRating);
        });
        
        document.querySelectorAll('.total-reviews-count').forEach(element => {
            element.textContent = reviews.length;
        });
    }

    getRandomReviews(reviews, count) {
        const shuffled = [...reviews].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-AE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#25D366' : '#ff4757'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // تقييمات افتراضية في حالة فشل التحميل
    getDefaultReviews() {
        return {
            watches: [
                {
                    id: 'default_watch_1',
                    productType: 'watch',
                    customerName: 'أحمد المنصوري',
                    rating: 5,
                    comment: 'ساعة رائعة والجودة عالية جداً',
                    date: '2024-10-28',
                    verified: true,
                    helpful: 12,
                    location: 'دبي'
                }
            ],
            perfumes: [
                {
                    id: 'default_perfume_1',
                    productType: 'perfume',
                    customerName: 'نورا العلي',
                    rating: 5,
                    comment: 'عطر مميز برائحة جذابة',
                    date: '2024-10-28',
                    verified: true,
                    helpful: 15,
                    location: 'دبي'
                }
            ],
            jewelry: [
                {
                    id: 'default_jewelry_1',
                    productType: 'jewelry',
                    customerName: 'مريم الزعابي',
                    rating: 5,
                    comment: 'مجوهرات رائعة بتصميم أنيق',
                    date: '2024-10-28',
                    verified: true,
                    helpful: 13,
                    location: 'دبي'
                }
            ],
            general: [
                {
                    id: 'default_general_1',
                    productType: 'general',
                    customerName: 'علي المهيري',
                    rating: 4,
                    comment: 'منتج ممتاز وخدمة عالية',
                    date: '2024-10-28',
                    verified: true,
                    helpful: 8,
                    location: 'دبي'
                }
            ]
        };
    }

    // تحديث الأنماط المرئية للتقييمات
    addReviewStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .reviews-summary-card {
                background: #f9f9f9;
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
                text-align: center;
            }
            
            .rating-display {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-bottom: 10px;
            }
            
            .avg-rating {
                font-size: 1.5rem;
                font-weight: bold;
                color: #D4AF37;
            }
            
            .stars {
                color: #D4AF37;
                font-size: 1.2rem;
            }
            
            .review-count {
                color: #666;
                font-size: 0.9rem;
            }
            
            .sample-reviews {
                text-align: right;
            }
            
            .mini-review {
                margin-bottom: 8px;
                padding: 8px;
                background: white;
                border-radius: 4px;
            }
            
            .mini-reviewer {
                font-weight: bold;
                color: #333;
                font-size: 0.85rem;
            }
            
            .mini-comment {
                color: #666;
                font-size: 0.8rem;
                margin-top: 4px;
            }
            
            .reviews-header {
                margin-bottom: 20px;
                text-align: center;
            }
            
            .overall-rating {
                background: linear-gradient(135deg, #D4AF37, #B8860B);
                color: white;
                padding: 20px;
                border-radius: 12px;
                margin: 15px 0;
            }
            
            .avg-rating-large {
                font-size: 3rem;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .stars-large {
                font-size: 1.5rem;
                margin: 10px 0;
            }
            
            .reviews-filters {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .filter-btn {
                padding: 8px 16px;
                border: 2px solid #ddd;
                background: white;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Cairo', sans-serif;
            }
            
            .filter-btn.active,
            .filter-btn:hover {
                background: #D4AF37;
                border-color: #D4AF37;
                color: white;
            }
            
            .review-item {
                background: white;
                border: 1px solid #eee;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .review-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }
            
            .reviewer-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .reviewer-name {
                font-weight: bold;
                color: #333;
            }
            
            .reviewer-location {
                color: #888;
                font-size: 0.85rem;
            }
            
            .verified-badge {
                background: #25D366;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                margin-top: 4px;
            }
            
            .review-rating {
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 10px 0;
            }
            
            .review-content {
                margin: 15px 0;
                line-height: 1.6;
            }
            
            .review-actions {
                display: flex;
                justify-content: flex-start;
                margin-top: 15px;
            }
            
            .helpful-btn {
                background: #f1f1f1;
                border: 1px solid #ddd;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Cairo', sans-serif;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .helpful-btn:hover {
                background: #D4AF37;
                color: white;
                border-color: #D4AF37;
            }
            
            .helpful-btn.voted {
                background: #25D366;
                color: white;
                border-color: #25D366;
                cursor: not-allowed;
            }
            
            .show-more-reviews {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #D4AF37, #B8860B);
                color: white;
                border: none;
                border-radius: 8px;
                font-family: 'Cairo', sans-serif;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 0.3s;
                margin-top: 20px;
            }
            
            .show-more-reviews:hover {
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(style);
    }
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const reviewSystem = new CorrectedReviewsSystem();
    reviewSystem.addReviewStyles();
});

// تشغيل النظام إذا كان DOM محمل بالفعل
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const reviewSystem = new CorrectedReviewsSystem();
        reviewSystem.addReviewStyles();
    });
} else {
    const reviewSystem = new CorrectedReviewsSystem();
    reviewSystem.addReviewStyles();
}