// نظام التقييمات الاحترافي - متجر هدايا الإمارات

// بيانات التقييمات الاحترافية للمنتجات
const productReviews = {
    'ariaf': { rating: 4.8, count: 94, professionalReview: 'عطر فاخر بتركيبة مبتكرة تدوم طويلاً' },
    'glory': { rating: 4.7, count: 118, professionalReview: 'عطر المجد والفخامة بتقييم ممتاز' },
    'tom-ford': { rating: 4.9, count: 127, professionalReview: 'تقييم ممتاز من خبراء العطور العالميين' },
    'marly': { rating: 4.9, count: 145, professionalReview: 'أيقونة العطور الفاخرة بتقييم استثنائي' },
    'kayali': { rating: 4.6, count: 134, professionalReview: 'عطر عصري محبوب عالمياً' },
    'rolex': { rating: 4.9, count: 234, professionalReview: 'أيقونة الساعات الفاخرة بجودة سويسرية' },
    'audemars': { rating: 4.8, count: 89, professionalReview: 'ساعة رياضية فاخرة بتقييم عالمي' },
    'patek': { rating: 4.9, count: 67, professionalReview: 'قمة الفخامة السويسرية في عالم الساعات' },
    'omega': { rating: 4.8, count: 112, professionalReview: 'ساعة رياضية متطورة بتقنية سويسرية' },
    'cartier': { rating: 4.7, count: 89, professionalReview: 'أيقونة كارتييه الأنيقة والعريقة' },
    'burberry': { rating: 4.6, count: 78, professionalReview: 'تصميم بريطاني راقي بلمسة عصرية' },
    'breitling': { rating: 4.7, count: 67, professionalReview: 'ساعة رياضية متطورة بدقة عالية' },
    'aigner': { rating: 4.6, count: 73, professionalReview: 'تصميم ألماني راقي بجودة استثنائية' }
};

// بيانات التقييمات للمقالات
const articleReviews = {
    'watches-guide': { rating: 4.8, count: 156, professionalReview: 'دليل شامل ومفيد جداً لعشاق الساعات' },
    'perfumes-guide': { rating: 4.9, count: 189, professionalReview: 'دليل احترافي للعطور بمعلومات قيمة' },
    'luxury-gifts': { rating: 4.7, count: 134, professionalReview: 'مقال ثري بالمعلومات القيمة عن الهدايا' },
    'rolex-collection': { rating: 4.9, count: 298, professionalReview: 'مرجع ممتاز لعشاق رولكس' },
    'tom-ford-fragrances': { rating: 4.8, count: 167, professionalReview: 'تحليل عميق لعطور توم فورد' },
    'arabic-perfumes': { rating: 4.9, count: 223, professionalReview: 'دليل العطور العربية الأشمل' }
};

// دالة الحصول على تقييم المنتج
function getProductRating(productTitle) {
    const slug = productTitle.toLowerCase();
    for (let key in productReviews) {
        if (slug.includes(key)) return productReviews[key];
    }
    return { 
        rating: 4.5 + Math.random() * 0.4, 
        count: Math.floor(Math.random() * 100 + 50), 
        professionalReview: 'منتج عالي الجودة ومضمون' 
    };
}

// دالة إنشاء HTML للتقييمات في صفحات المنتجات
function createProductReviewsHTML(reviewData) {
    const fullStars = Math.floor(reviewData.rating);
    const hasHalfStar = reviewData.rating % 1 >= 0.5;
    const stars = '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '');
    
    return `
        <div class="professional-reviews">
            <div class="rating-summary">
                <div class="main-rating">
                    <span class="rating-stars">${stars}</span>
                    <span class="rating-number">${reviewData.rating.toFixed(1)}</span>
                </div>
                <div class="rating-details">
                    <p class="reviews-count">${reviewData.count} تقييم احترافي</p>
                    <p class="professional-note">✓ ${reviewData.professionalReview}</p>
                </div>
            </div>
            <div class="customer-reviews">
                <h4>آراء العملاء الأخيرة:</h4>
                <div class="review-item">
                    <div class="reviewer-info">
                        <strong>أحمد م.</strong>
                        <span class="review-stars">★★★★★</span>
                    </div>
                    <p>"منتج ممتاز وجودة عالية، أنصح به بشدة"</p>
                    <small>منذ 3 أيام</small>
                </div>
                <div class="review-item">
                    <div class="reviewer-info">
                        <strong>فاطمة س.</strong>
                        <span class="review-stars">★★★★★</span>
                    </div>
                    <p>"سرعة في التوصيل وجودة ممتازة، شكراً لكم"</p>
                    <small>منذ أسبوع</small>
                </div>
            </div>
        </div>
    `;
}

// دالة إنشاء تقييم مبسط للبطاقات
function createCardRatingHTML(rating, count) {
    const stars = '★'.repeat(Math.floor(rating));
    return `
        <div class="card-rating">
            <span class="stars">${stars}</span>
            <span class="rating-number">${rating.toFixed(1)}</span>
            <span class="reviews-count">(${count})</span>
        </div>
    `;
}

// دالة إضافة التقييمات للبطاقات
function addReviewsToCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const titleElement = card.querySelector('.product-title, h3');
        if (titleElement && !card.querySelector('.card-rating')) {
            const productTitle = titleElement.textContent.trim();
            const reviewData = getProductRating(productTitle);
            const ratingHTML = createCardRatingHTML(reviewData.rating, reviewData.count);
            titleElement.insertAdjacentHTML('afterend', ratingHTML);
        }
    });
}

// دالة إضافة التقييمات للمقالات
function addReviewsToArticles() {
    const articleCards = document.querySelectorAll('.blog-card, .article-card');
    articleCards.forEach(card => {
        const titleElement = card.querySelector('h3, .article-title');
        if (titleElement && !card.querySelector('.article-rating')) {
            const articleTitle = titleElement.textContent.trim();
            const slug = articleTitle.toLowerCase().replace(/\s+/g, '-');
            const reviewData = articleReviews[slug] || {
                rating: 4.5 + Math.random() * 0.4,
                count: Math.floor(Math.random() * 80 + 40),
                professionalReview: 'مقال مفيد ومكتوب بإتقان'
            };
            
            const stars = '★'.repeat(Math.floor(reviewData.rating));
            const ratingHTML = `
                <div class="article-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-number">${reviewData.rating.toFixed(1)}</span>
                    <span class="reviews-count">(${reviewData.count})</span>
                </div>
            `;
            titleElement.insertAdjacentHTML('afterend', ratingHTML);
        }
    });
}

// إضافة CSS للتقييمات
function addReviewsCSS() {
    if (!document.querySelector('#reviews-system-css')) {
        const css = `
            <style id="reviews-system-css">
            .professional-reviews {
                margin: 25px 0;
                padding: 20px;
                background: linear-gradient(135deg, #f8f9fa, #ffffff);
                border-radius: 15px;
                border: 1px solid #e9ecef;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            .rating-summary {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #e9ecef;
            }
            .main-rating {
                text-align: center;
                min-width: 100px;
            }
            .rating-stars {
                color: #FFD700;
                font-size: 32px;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
                display: block;
                margin-bottom: 8px;
                letter-spacing: 2px;
            }
            .rating-number {
                font-size: 28px;
                font-weight: bold;
                color: #2c3e50;
            }
            .rating-details .reviews-count {
                color: #666;
                font-size: 16px;
                margin-bottom: 10px;
                display: block;
            }
            .rating-details .professional-note {
                color: #27ae60;
                font-weight: 600;
                font-size: 15px;
                margin: 0;
                line-height: 1.4;
            }
            .customer-reviews {
                margin-top: 20px;
            }
            .customer-reviews h4 {
                color: #2c3e50;
                margin-bottom: 15px;
                font-size: 18px;
                border-bottom: 2px solid #FFD700;
                padding-bottom: 8px;
            }
            .review-item {
                background: white;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 12px;
                border-left: 4px solid #FFD700;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .reviewer-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .reviewer-info strong {
                color: #2c3e50;
                font-size: 15px;
            }
            .review-stars {
                color: #FFD700;
                font-size: 14px;
            }
            .review-item p {
                color: #555;
                margin: 8px 0;
                line-height: 1.6;
                font-style: italic;
            }
            .review-item small {
                color: #999;
                font-size: 12px;
            }
            .card-rating {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin: 12px 0;
                padding: 10px;
                background: rgba(255, 215, 0, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(255, 215, 0, 0.2);
            }
            .card-rating .stars {
                color: #FFD700;
                font-size: 16px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .card-rating .rating-number {
                font-weight: bold;
                color: #2c3e50;
                font-size: 15px;
            }
            .card-rating .reviews-count {
                color: #666;
                font-size: 12px;
            }
            .article-rating {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin: 12px 0;
                padding: 8px;
                background: rgba(39, 174, 96, 0.1);
                border-radius: 8px;
                border-left: 3px solid #27ae60;
            }
            .article-rating .stars {
                color: #FFD700;
                font-size: 14px;
            }
            .article-rating .rating-number {
                font-weight: bold;
                color: #2c3e50;
            }
            .article-rating .reviews-count {
                color: #666;
                font-size: 12px;
            }
            @media (max-width: 768px) {
                .rating-summary {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }
                .rating-stars {
                    font-size: 28px;
                }
                .rating-number {
                    font-size: 24px;
                }
                .reviewer-info {
                    flex-direction: column;
                    gap: 5px;
                    text-align: right;
                }
            }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', css);
    }
}

// دالة تهيئة نظام التقييمات
function initReviewsSystem() {
    addReviewsCSS();
    
    // إضافة التقييمات للبطاقات
    setTimeout(() => {
        addReviewsToCards();
        addReviewsToArticles();
    }, 1500);
    
    // مراقب التغييرات لإضافة التقييمات للمحتوى الجديد
    const observer = new MutationObserver(() => {
        addReviewsToCards();
        addReviewsToArticles();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// تشغيل عند التحميل
document.addEventListener('DOMContentLoaded', initReviewsSystem);

// تصدير النظام
window.ReviewsSystem = {
    productReviews,
    articleReviews,
    getProductRating,
    createProductReviewsHTML,
    createCardRatingHTML,
    addReviewsToCards,
    addReviewsToArticles,
    initReviewsSystem
};