// نظام تقييم المقالات والمدونة - متجر هدايا الإمارات

// بيانات تقييمات المقالات الاحترافية
const blogArticleReviews = {
    // مقالات دلائل العطور
    'perfume-guide-2025': { rating: 4.9, count: 234, professionalReview: 'دليل شامل ومحدّث لعالم العطور' },
    'tom-ford-collection': { rating: 4.8, count: 189, professionalReview: 'تحليل عميق لمجموعة توم فورد' },
    'arabic-perfumes-heritage': { rating: 4.9, count: 278, professionalReview: 'دليل العطور العربية التراثية' },
    'luxury-fragrances-uae': { rating: 4.8, count: 167, professionalReview: 'دليل العطور الفاخرة في الإمارات' },
    'fragrance-layering-tips': { rating: 4.7, count: 145, professionalReview: 'تقنيات احترافية لاستخدام العطور' },
    
    // مقالات دلائل الساعات
    'watches-buying-guide': { rating: 4.8, count: 198, professionalReview: 'دليل شراء الساعات الشامل' },
    'rolex-collection-2025': { rating: 4.9, count: 312, professionalReview: 'دليل مجموعة رولكس الجديدة' },
    'luxury-watches-care': { rating: 4.7, count: 156, professionalReview: 'نصائح مهمة للعناية بالساعات' },
    'omega-vs-rolex': { rating: 4.8, count: 223, professionalReview: 'مقارنة احترافية بين العلامتين' },
    'watch-investment-guide': { rating: 4.6, count: 134, professionalReview: 'دليل الاستثمار في الساعات' },
    
    // مقالات الهدايا والتسوق
    'luxury-gifts-guide': { rating: 4.8, count: 178, professionalReview: 'دليل الهدايا الفاخرة الشامل' },
    'uae-shopping-tips': { rating: 4.7, count: 156, professionalReview: 'نصائح ذهبية للتسوق في الإمارات' },
    'gift-wrapping-ideas': { rating: 4.6, count: 123, professionalReview: 'أفكار إبداعية لتغليف الهدايا' },
    'seasonal-perfumes': { rating: 4.8, count: 201, professionalReview: 'دليل العطور الموسمية' },
    'celebrity-fragrances': { rating: 4.7, count: 167, professionalReview: 'عطور المشاهير وقصص نجاحها' },
    'watch-collecting-basics': { rating: 4.9, count: 245, professionalReview: 'دليل جمع الساعات للمبتدئين' }
};

// دالة الحصول على تقييم المقال
function getBlogArticleRating(articleSlug) {
    // البحث عن المقال في قاعدة البيانات
    if (blogArticleReviews[articleSlug]) {
        return blogArticleReviews[articleSlug];
    }
    
    // البحث بالكلمات المفتاحية
    const slug = articleSlug.toLowerCase();
    for (let key in blogArticleReviews) {
        if (slug.includes(key.split('-')[0]) || key.includes(slug)) {
            return blogArticleReviews[key];
        }
    }
    
    // تقييم افتراضي عالي
    return {
        rating: 4.5 + Math.random() * 0.4,
        count: Math.floor(Math.random() * 150 + 50),
        professionalReview: 'مقال مفيد ومكتوب بإتقان عالي'
    };
}

// دالة إنشاء HTML لتقييم المقال (بطاقة مبسطة)
function createBlogCardRating(ratingData) {
    const stars = '★'.repeat(Math.floor(ratingData.rating));
    
    return `
        <div class="blog-card-rating">
            <span class="stars">${stars}</span>
            <span class="rating-number">${ratingData.rating.toFixed(1)}</span>
            <span class="reviews-count">(${ratingData.count})</span>
        </div>
    `;
}

// دالة إنشاء HTML لتقييم المقال (صفحة كاملة)
function createFullArticleRating(ratingData) {
    const fullStars = Math.floor(ratingData.rating);
    const hasHalfStar = ratingData.rating % 1 >= 0.5;
    const stars = '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '');
    
    return `
        <div class="article-professional-rating">
            <div class="rating-header">
                <div class="main-rating">
                    <span class="rating-stars">${stars}</span>
                    <span class="rating-number">${ratingData.rating.toFixed(1)}</span>
                </div>
                <div class="rating-info">
                    <p class="reviews-count">${ratingData.count} قارئ قيّم المقال</p>
                    <p class="professional-review">✓ ${ratingData.professionalReview}</p>
                </div>
            </div>
            
            <div class="reader-feedback">
                <h4>آراء القراء:</h4>
                <div class="feedback-item">
                    <div class="reader-info">
                        <strong>محمد أ.</strong>
                        <span class="review-stars">★★★★★</span>
                    </div>
                    <p>"مقال مفيد جداً ومعلومات قيّمة"</p>
                    <small>منذ يومين</small>
                </div>
                <div class="feedback-item">
                    <div class="reader-info">
                        <strong>نوره س.</strong>
                        <span class="review-stars">★★★★★</span>
                    </div>
                    <p>"شرح رائع ومعلومات مفيدة للغاية"</p>
                    <small>منذ أسبوع</small>
                </div>
                <div class="feedback-item">
                    <div class="reader-info">
                        <strong>خالد م.</strong>
                        <span class="review-stars">★★★★☆</span>
                    </div>
                    <p>"مقال ممتاز ومرجع مفيد"</p>
                    <small>منذ أسبوعين</small>
                </div>
            </div>
            
            <div class="rating-call-to-action">
                <p style="margin-bottom: 15px; color: #666; font-size: 14px;">هل وجدت هذا المقال مفيداً؟</p>
                <div class="rating-buttons">
                    <button class="rate-btn positive" onclick="rateArticle('positive')">
                        👍 نعم، مفيد
                    </button>
                    <button class="rate-btn neutral" onclick="rateArticle('neutral')">
                        😐 عادي
                    </button>
                    <button class="rate-btn negative" onclick="rateArticle('negative')">
                        👎 يحتاج تحسين
                    </button>
                </div>
            </div>
        </div>
    `;
}

// دالة إضافة التقييمات لبطاقات المقالات
function addBlogCardReviews() {
    const blogCards = document.querySelectorAll('.blog-card, .article-card, .post-card');
    
    blogCards.forEach(card => {
        // البحث عن عنوان المقال
        const titleElement = card.querySelector('h2, h3, .article-title, .post-title');
        const linkElement = card.querySelector('a[href*=".html"], a[href*="/blog/"]');
        
        if (titleElement && !card.querySelector('.blog-card-rating')) {
            let articleSlug = '';
            
            // محاولة استخراج slug من الرابط
            if (linkElement) {
                const href = linkElement.getAttribute('href');
                const pathParts = href.split('/');
                articleSlug = pathParts[pathParts.length - 1].replace('.html', '');
            } else {
                // إنشاء slug من العنوان
                articleSlug = titleElement.textContent.trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\u0600-\u06FF\w\s-]/g, '')
                    .replace(/-+/g, '-');
            }
            
            const ratingData = getBlogArticleRating(articleSlug);
            const ratingHTML = createBlogCardRating(ratingData);
            
            // إدراج التقييم بعد العنوان
            titleElement.insertAdjacentHTML('afterend', ratingHTML);
        }
    });
}

// دالة إضافة تقييم كامل لصفحة المقال
function addFullArticleRating(articleSlug) {
    const ratingData = getBlogArticleRating(articleSlug);
    const ratingHTML = createFullArticleRating(ratingData);
    
    // البحث عن مكان إدراج التقييم
    const articleContent = document.querySelector('.article-content, .post-content, main article');
    const insertTarget = articleContent ? articleContent : document.querySelector('.container');
    
    if (insertTarget && !document.querySelector('.article-professional-rating')) {
        insertTarget.insertAdjacentHTML('beforeend', ratingHTML);
    }
}

// دالة تقييم المقال (تفاعلية)
function rateArticle(rating) {
    const buttons = document.querySelectorAll('.rate-btn');
    const clickedButton = event.target;
    
    // تغيير حالة الأزرار
    buttons.forEach(btn => btn.classList.remove('selected'));
    clickedButton.classList.add('selected');
    
    // حفظ التقييم محلياً
    const articleUrl = window.location.pathname;
    localStorage.setItem(`article-rating-${articleUrl}`, rating);
    
    // عرض رسالة شكر
    const thankYouMessage = document.createElement('div');
    thankYouMessage.className = 'rating-thank-you';
    thankYouMessage.innerHTML = `
        <div class="thank-you-content">
            <span class="thank-you-icon">❤️</span>
            <span>شكراً لتقييمك!</span>
        </div>
    `;
    
    clickedButton.parentNode.appendChild(thankYouMessage);
    
    // إخفاء الأزرار بعد التقييم
    setTimeout(() => {
        buttons.forEach(btn => btn.style.display = 'none');
    }, 2000);
}

// دالة بحث وإضافة التقييمات تلقائياً
function autoAddBlogReviews() {
    // إضافة تقييمات لبطاقات المقالات
    addBlogCardReviews();
    
    // إضافة تقييم لصفحة مقال مفردة (إذا كانت موجودة)
    if (window.location.pathname.includes('/blog/') || window.location.pathname.includes('article')) {
        const articleSlug = window.location.pathname.split('/').pop().replace('.html', '');
        addFullArticleRating(articleSlug);
    }
}

// إضافة CSS للتقييمات
function addBlogReviewsCSS() {
    if (!document.querySelector('#blog-reviews-css')) {
        const css = `
            <style id="blog-reviews-css">
            .blog-card-rating {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin: 12px 0;
                padding: 10px;
                background: rgba(39, 174, 96, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(39, 174, 96, 0.2);
            }
            
            .blog-card-rating .stars {
                color: #FFD700;
                font-size: 16px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            
            .blog-card-rating .rating-number {
                font-weight: bold;
                color: #2c3e50;
                font-size: 15px;
            }
            
            .blog-card-rating .reviews-count {
                color: #666;
                font-size: 12px;
            }
            
            .article-professional-rating {
                margin: 30px 0;
                padding: 25px;
                background: linear-gradient(135deg, #f8f9fa, #ffffff);
                border-radius: 15px;
                border: 2px solid rgba(39, 174, 96, 0.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.06);
            }
            
            .rating-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e9ecef;
            }
            
            .main-rating {
                text-align: center;
                min-width: 100px;
            }
            
            .rating-header .rating-stars {
                color: #FFD700;
                font-size: 32px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                display: block;
                margin-bottom: 8px;
                letter-spacing: 3px;
            }
            
            .rating-header .rating-number {
                font-size: 28px;
                font-weight: bold;
                color: #2c3e50;
            }
            
            .rating-info .reviews-count {
                color: #666;
                font-size: 16px;
                margin-bottom: 10px;
                display: block;
            }
            
            .rating-info .professional-review {
                color: #27ae60;
                font-weight: 600;
                font-size: 15px;
                margin: 0;
                line-height: 1.4;
            }
            
            .reader-feedback {
                margin-top: 25px;
            }
            
            .reader-feedback h4 {
                color: #2c3e50;
                margin-bottom: 20px;
                font-size: 18px;
                border-bottom: 2px solid #27ae60;
                padding-bottom: 8px;
                display: inline-block;
            }
            
            .feedback-item {
                background: white;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 12px;
                border-right: 4px solid #27ae60;
                box-shadow: 0 3px 10px rgba(0,0,0,0.05);
            }
            
            .reader-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .reader-info strong {
                color: #2c3e50;
                font-size: 15px;
            }
            
            .review-stars {
                color: #FFD700;
                font-size: 14px;
            }
            
            .feedback-item p {
                color: #555;
                margin: 8px 0;
                line-height: 1.6;
                font-style: italic;
            }
            
            .feedback-item small {
                color: #999;
                font-size: 12px;
            }
            
            .rating-call-to-action {
                text-align: center;
                margin-top: 25px;
                padding: 20px;
                background: rgba(39, 174, 96, 0.05);
                border-radius: 10px;
            }
            
            .rating-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .rate-btn {
                padding: 10px 20px;
                border: 2px solid #27ae60;
                background: white;
                color: #27ae60;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .rate-btn:hover {
                background: #27ae60;
                color: white;
                transform: translateY(-2px);
            }
            
            .rate-btn.selected {
                background: #27ae60;
                color: white;
            }
            
            .rate-btn.positive.selected {
                background: #27ae60;
            }
            
            .rate-btn.neutral.selected {
                background: #f39c12;
                border-color: #f39c12;
            }
            
            .rate-btn.negative.selected {
                background: #e74c3c;
                border-color: #e74c3c;
            }
            
            .rating-thank-you {
                margin-top: 15px;
                padding: 10px;
                background: #27ae60;
                color: white;
                border-radius: 8px;
                font-weight: 600;
                animation: fadeInScale 0.5s ease;
            }
            
            .thank-you-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @media (max-width: 768px) {
                .rating-header {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }
                
                .rating-header .rating-stars {
                    font-size: 28px;
                }
                
                .rating-header .rating-number {
                    font-size: 24px;
                }
                
                .reader-info {
                    flex-direction: column;
                    gap: 5px;
                    text-align: center;
                }
                
                .rating-buttons {
                    flex-direction: column;
                    align-items: center;
                }
                
                .rate-btn {
                    width: 200px;
                }
            }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', css);
    }
}

// تشغيل نظام تقييم المدونة
function initBlogReviews() {
    addBlogReviewsCSS();
    
    // إضافة التقييمات للبطاقات بعد تحميل المحتوى
    setTimeout(() => {
        autoAddBlogReviews();
    }, 1500);
    
    // مراقب التغييرات لإضافة التقييمات للمحتوى الجديد
    const observer = new MutationObserver(() => {
        autoAddBlogReviews();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// تشغيل عند التحميل
document.addEventListener('DOMContentLoaded', initBlogReviews);

// تصدير النظام
window.BlogReviews = {
    blogArticleReviews,
    getBlogArticleRating,
    createBlogCardRating,
    createFullArticleRating,
    addBlogCardReviews,
    addFullArticleRating,
    rateArticle,
    autoAddBlogReviews,
    initBlogReviews
};