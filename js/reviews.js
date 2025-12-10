// نظام التقييمات الاحترافي - متجر هدايا الإمارات

// بيانات التقييمات الاحترافية للمنتجات
const productReviews = {
    // عطور Tom Ford
    'tom-ford-vanilla-sex': { rating: 4.9, count: 127, professionalReview: 'تقييم ممتاز من خبراء العطور' },
    'tom-ford-bitter-peach': { rating: 4.8, count: 98, professionalReview: 'عطر فاخر بتقييم استثنائي' },
    'tom-ford-ombre-leather': { rating: 4.9, count: 134, professionalReview: 'الأفضل في فئة العطور الجلدية' },
    'tom-ford-oud-minerale': { rating: 4.7, count: 89, professionalReview: 'عطر عودي راقي بتقييم عالي' },
    'tom-ford-tuscan-leather': { rating: 4.8, count: 112, professionalReview: 'تحفة عطرية من توم فورد' },
    'tom-ford-neroli-portofino': { rating: 4.6, count: 76, professionalReview: 'عطر صيفي منعش ومميز' },
    'tom-ford-ebene-fume': { rating: 4.7, count: 93, professionalReview: 'عطر خشبي فاخر بجودة عالية' },
    'tom-ford-myrrhe-mystere': { rating: 4.8, count: 105, professionalReview: 'عطر شرقي أصيل ومتميز' },
    'tom-ford-black-lacouer': { rating: 4.9, count: 158, professionalReview: 'الأكثر مبيعاً وتقييماً' },
    'tom-ford-eau-de-soleil-blanc': { rating: 4.5, count: 67, professionalReview: 'عطر هادئ وأنيق للصيف' },
    
    // عطور Marly
    'marly-delina': { rating: 4.9, count: 145, professionalReview: 'أيقونة العطور النسائية' },
    'marly-delina-la-rosee': { rating: 4.8, count: 98, professionalReview: 'نسخة محدودة بتقييم ممتاز' },
    'marly-oriana': { rating: 4.7, count: 87, professionalReview: 'عطر نسائي راقي ومتميز' },
    'marly-safanad': { rating: 4.6, count: 79, professionalReview: 'عطر شرقي أصيل وفاخر' },
    'marly-palatine': { rating: 4.8, count: 102, professionalReview: 'عطر كلاسيكي بلمسة عصرية' },
    'valaya-de-marly': { rating: 4.7, count: 91, professionalReview: 'عطر فاخر بتركيبة مميزة' },
    
    // عطور Kayali
    'kayali-vanilla': { rating: 4.6, count: 134, professionalReview: 'عطر الفانيلا الأكثر حباً' },
    'kayali-eden': { rating: 4.8, count: 89, professionalReview: 'عطر جنة الأحلام' },
    'kayali-lovefest': { rating: 4.7, count: 76, professionalReview: 'عطر الحب والرومانسية' },
    'kayali-vanilla-candy-purple': { rating: 4.5, count: 67, professionalReview: 'عطر حلو ومرح للشباب' },
    'kayali-vanilla-candy-pink': { rating: 4.6, count: 82, professionalReview: 'عطر أنثوي جذاب' },
    
    // عطور YSL
    'yves-saint-laurent-eau-de-parfum': { rating: 4.8, count: 156, professionalReview: 'كلاسيكية لا تموت' },
    'yves-saint-laurent-eau-fraiche': { rating: 4.6, count: 98, professionalReview: 'منعش وأنيق للصيف' },
    'yves-saint-laurent-intense': { rating: 4.9, count: 123, professionalReview: 'قوة وأناقة في زجاجة' },
    
    // دخون عربي
    'دخون-راقيه': { rating: 4.9, count: 89, professionalReview: 'دخون عربي أصيل بأرقى المكونات' },
    'دخون-بن-لوتاه': { rating: 4.8, count: 76, professionalReview: 'تراث عريق بجودة استثنائية' },
    'دخون-بو-خالد': { rating: 4.7, count: 63, professionalReview: 'خليط تراثي مميز' },
    
    // عطور أخرى
    'ariaf': { rating: 4.8, count: 94, professionalReview: 'عطر فاخر بتركيبة مبتكرة' },
    'glory': { rating: 4.7, count: 118, professionalReview: 'عطر المجد والفخامة' },
    'aromatic': { rating: 4.6, count: 72, professionalReview: 'عطر عطري منعش' },
    'autumn': { rating: 4.5, count: 58, professionalReview: 'عطر الخريف الدافئ' },
    'khaneen': { rating: 4.8, count: 85, professionalReview: 'عطر شرقي أصيل' },
    'tomber': { rating: 4.6, count: 67, professionalReview: 'عطر رومانسي ساحر' },
    
    // ساعات Rolex
    'rolex-datejust-blue-silver': { rating: 4.9, count: 234, professionalReview: 'أيقونة الساعات الفاخرة' },
    'rolex-submariner-green': { rating: 4.9, count: 189, professionalReview: 'ساعة الغواصين الأسطورية' },
    'rolex-gmt-batman': { rating: 4.8, count: 156, professionalReview: 'ساعة السفر المثالية' },
    'rolex-daytona-black': { rating: 4.9, count: 298, professionalReview: 'ساعة السباق الأشهر' },
    'rolex-oyster-perpetual-green': { rating: 4.7, count: 134, professionalReview: 'كلاسيكية بلون عصري' },
    'rolex-datejust-wimbledon': { rating: 4.8, count: 167, professionalReview: 'تحفة بتصميم ويمبلدون' },
    
    // ساعات Audemars Piguet
    'audemars-piguet-royal-orange': { rating: 4.8, count: 89, professionalReview: 'ساعة رياضية أنيقة' },
    'audemars-piguet-blue-silver': { rating: 4.9, count: 76, professionalReview: 'تحفة سويسرية راقية' },
    
    // ساعات Patek Philippe
    'patek-philippe-مينا-بيج': { rating: 4.9, count: 67, professionalReview: 'قمة الفخامة السويسرية' },
    'patek-philippe-مينا-بيضا': { rating: 4.8, count: 58, professionalReview: 'كلاسيكية أبدية' },
    'patek-philippe-مينا-سوداء': { rating: 4.9, count: 73, professionalReview: 'أناقة سوداء مطلقة' },
    'patek-philippe-مينا-كحلي': { rating: 4.7, count: 45, professionalReview: 'لون عصري مميز' },
    
    // ساعات أخرى
    'omega-watch-navy-blue-strap': { rating: 4.8, count: 112, professionalReview: 'ساعة بحرية كلاسيكية' },
    'cartier-tank-اسود-كحلي': { rating: 4.7, count: 89, professionalReview: 'أيقونة كارتييه الأنيقة' },
    'breitling-endurance-pro-كحلي': { rating: 4.6, count: 67, professionalReview: 'ساعة رياضية متطورة' },
    'burberry-watches-لون-اسود-مينا-ازرق': { rating: 4.5, count: 78, professionalReview: 'تصميم بريطاني راقي' }
};

// بيانات التقييمات للمقالات
const articleReviews = {
    'watches-guide': { rating: 4.8, count: 156, professionalReview: 'دليل شامل ومفيد جداً' },
    'perfumes-guide': { rating: 4.9, count: 189, professionalReview: 'دليل احترافي للعطور' },
    'luxury-gifts': { rating: 4.7, count: 134, professionalReview: 'مقال ثري بالمعلومات القيمة' },
    'rolex-collection': { rating: 4.9, count: 298, professionalReview: 'مرجع ممتاز لعشاق رولكس' },
    'tom-ford-fragrances': { rating: 4.8, count: 167, professionalReview: 'تحليل عميق لعطور توم فورد' },
    'arabic-perfumes': { rating: 4.9, count: 223, professionalReview: 'دليل العطور العربية الأشمل' }
};

// دالة إنشاء HTML للتقييمات
function createReviewsHTML(reviewData) {
    if (!reviewData) return '';
    
    const stars = '★'.repeat(Math.floor(reviewData.rating)) + 
                 (reviewData.rating % 1 >= 0.5 ? '☆' : '');
    
    return `
        <div class="product-reviews-section">
            <div class="professional-rating">
                <div class="rating-stars" data-rating="${reviewData.rating}">
                    <span class="stars">${stars}</span>
                    <span class="rating-number">${reviewData.rating}</span>
                </div>
                <div class="rating-info">
                    <span class="reviews-count">(${reviewData.count} تقييم احترافي)</span>
                    <p class="professional-note">${reviewData.professionalReview}</p>
                </div>
            </div>
            <div class="rating-breakdown">
                <div class="rating-bar">
                    <span>5 نجوم</span>
                    <div class="bar"><div class="fill" style="width: ${Math.random() * 30 + 60}%"></div></div>
                    <span>${Math.floor(Math.random() * 50 + 40)}</span>
                </div>
                <div class="rating-bar">
                    <span>4 نجوم</span>
                    <div class="bar"><div class="fill" style="width: ${Math.random() * 20 + 20}%"></div></div>
                    <span>${Math.floor(Math.random() * 20 + 15)}</span>
                </div>
                <div class="rating-bar">
                    <span>3 نجوم</span>
                    <div class="bar"><div class="fill" style="width: ${Math.random() * 10 + 5}%"></div></div>
                    <span>${Math.floor(Math.random() * 10 + 3)}</span>
                </div>
                <div class="rating-bar">
                    <span>2 نجوم</span>
                    <div class="bar"><div class="fill" style="width: ${Math.random() * 5 + 2}%"></div></div>
                    <span>${Math.floor(Math.random() * 3 + 1)}</span>
                </div>
                <div class="rating-bar">
                    <span>1 نجمة</span>
                    <div class="bar"><div class="fill" style="width: ${Math.random() * 3 + 1}%"></div></div>
                    <span>${Math.floor(Math.random() * 2 + 1)}</span>
                </div>
            </div>
            <div class="recent-reviews">
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
function createSimpleRating(reviewData) {
    if (!reviewData) return '';
    
    const stars = '★'.repeat(Math.floor(reviewData.rating));
    
    return `
        <div class="card-rating">
            <span class="stars">${stars}</span>
            <span class="rating-number">${reviewData.rating}</span>
            <span class="reviews-count">(${reviewData.count})</span>
        </div>
    `;
}

// دالة الحصول على تقييم المنتج
function getProductReview(productSlug) {
    // البحث عن التقييم بناءً على الاسم المبسط
    const slug = productSlug.toLowerCase().replace(/\s+/g, '-');
    return productReviews[slug] || productReviews[productSlug] || {
        rating: 4.5 + Math.random() * 0.4,
        count: Math.floor(Math.random() * 100 + 50),
        professionalReview: 'منتج عالي الجودة ومضمون'
    };
}

// دالة الحصول على تقييم المقال
function getArticleReview(articleSlug) {
    return articleReviews[articleSlug] || {
        rating: 4.6 + Math.random() * 0.3,
        count: Math.floor(Math.random() * 80 + 40),
        professionalReview: 'مقال مفيد ومكتوب بإتقان'
    };
}

// دالة إضافة التقييمات لصفحة المنتج
function addProductReviews(productElement, productSlug) {
    const reviewData = getProductReview(productSlug);
    const reviewsHTML = createReviewsHTML(reviewData);
    
    // البحث عن مكان إدراج التقييمات
    const priceSection = productElement.querySelector('.price-section, .price-container, .product-price');
    if (priceSection) {
        priceSection.insertAdjacentHTML('afterend', reviewsHTML);
    }
}

// دالة إضافة التقييمات لبطاقات المنتجات
function addCardReviews() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        const titleElement = card.querySelector('.product-title, h3');
        if (titleElement) {
            const productTitle = titleElement.textContent.trim();
            const slug = productTitle.toLowerCase().replace(/\s+/g, '-');
            const reviewData = getProductReview(slug);
            const ratingHTML = createSimpleRating(reviewData);
            
            // إدراج التقييم بعد العنوان
            titleElement.insertAdjacentHTML('afterend', ratingHTML);
        }
    });
}

// دالة إضافة التقييمات للمقالات
function addArticleReviews() {
    const articleCards = document.querySelectorAll('.blog-card, .article-card');
    articleCards.forEach(card => {
        const linkElement = card.querySelector('a[href*="blog/"]');
        if (linkElement) {
            const href = linkElement.getAttribute('href');
            const articleSlug = href.split('/').pop().replace('.html', '');
            const reviewData = getArticleReview(articleSlug);
            const ratingHTML = createSimpleRating(reviewData);
            
            // إدراج التقييم في المقال
            const titleElement = card.querySelector('h3, .article-title');
            if (titleElement) {
                titleElement.insertAdjacentHTML('afterend', ratingHTML);
            }
        }
    });
}

// دالة تهيئة نظام التقييمات
function initReviewsSystem() {
    // إضافة تقييمات البطاقات
    addCardReviews();
    
    // إضافة تقييمات المقالات
    addArticleReviews();
    
    // إضافة CSS للتقييمات
    const reviewsCSS = `
        <style>
        .product-reviews-section {
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
            border-radius: 15px;
            border: 1px solid #e9ecef;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        
        .professional-rating {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .rating-stars {
            text-align: center;
        }
        
        .rating-stars .stars {
            color: #FFD700;
            font-size: 28px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .rating-stars .rating-number {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-top: 5px;
        }
        
        .rating-info .reviews-count {
            color: #666;
            font-size: 16px;
            margin-bottom: 8px;
            display: block;
        }
        
        .rating-info .professional-note {
            color: #27ae60;
            font-weight: 600;
            margin: 0;
            font-size: 15px;
        }
        
        .rating-breakdown {
            margin: 20px 0;
        }
        
        .rating-bar {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .rating-bar span:first-child {
            min-width: 60px;
            color: #666;
        }
        
        .rating-bar .bar {
            flex: 1;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .rating-bar .fill {
            height: 100%;
            background: linear-gradient(90deg, #FFD700, #FFA500);
            transition: width 0.8s ease;
        }
        
        .rating-bar span:last-child {
            min-width: 30px;
            text-align: right;
            color: #666;
            font-size: 12px;
        }
        
        .recent-reviews {
            margin-top: 25px;
        }
        
        .recent-reviews h4 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .review-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 12px;
            border-left: 4px solid #FFD700;
        }
        
        .reviewer-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .reviewer-info strong {
            color: #2c3e50;
        }
        
        .review-stars {
            color: #FFD700;
            font-size: 14px;
        }
        
        .review-item p {
            color: #555;
            margin: 8px 0;
            line-height: 1.5;
        }
        
        .review-item small {
            color: #999;
            font-size: 12px;
        }
        
        .card-rating {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 10px 0;
            font-size: 14px;
        }
        
        .card-rating .stars {
            color: #FFD700;
        }
        
        .card-rating .rating-number {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .card-rating .reviews-count {
            color: #666;
            font-size: 12px;
        }
        
        @media (max-width: 768px) {
            .professional-rating {
                flex-direction: column;
                text-align: center;
                gap: 15px;
            }
            
            .rating-breakdown {
                font-size: 13px;
            }
            
            .rating-bar span:first-child {
                min-width: 50px;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', reviewsCSS);
}

// تصدير الدوال للاستخدام العام
window.ReviewsSystem = {
    productReviews,
    articleReviews,
    getProductReview,
    getArticleReview,
    createReviewsHTML,
    createSimpleRating,
    addProductReviews,
    addCardReviews,
    addArticleReviews,
    initReviewsSystem
};