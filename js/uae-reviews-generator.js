// نظام توليد التقييمات الإماراتية الذكية
class UAEReviewsGenerator {
    constructor() {
        this.emiratiNames = [
            // أسماء رجالية إماراتية
            'أحمد المنصوري', 'محمد النقبي', 'سالم الشامسي', 'خالد البلوشي', 'راشد الكعبي',
            'عبدالله الزعابي', 'سعيد المهيري', 'فيصل العتيبة', 'مجد المرر', 'طارق الطاير',
            'حمدان بن راشد', 'زايد الشرقي', 'ماجد النيادي', 'جاسم الحوسني', 'عمر الحمادي',
            'يوسف المطروشي', 'نايف السويدي', 'حاتم الظاهري', 'بدر الجابري', 'سلطان الكتبي',
            
            // أسماء نسائية إماراتية
            'فاطمة النعيمي', 'عائشة الشحي', 'مريم البدواوي', 'نورا الطنيجي', 'سارة القبيسي',
            'شما المزروعي', 'هند الرميثي', 'لطيفة الشرهان', 'أميرة الحوسني', 'رنا المطوع',
            'سلامة الهاشمي', 'إيمان الكندي', 'آمنة العليا', 'شيخة الراشد', 'موزة البوسميط',
            'نجلاء الحربي', 'رقية الجنيبي', 'صفية الدرعي', 'خولة السرقال', 'ميثاء الشحي'
        ];

        this.reviewTemplates = {
            perfumes: [
                'عطر رائع وثبات ممتاز! يدوم اكثر من 8 ساعات 🌹',
                'من أجمل العطور اللي جربتها، رائحة فخمة وراقية جداً ✨',
                'عطر مميز ويناسب جميع المناسبات، انصح فيه بقوة 👌',
                'ثبات العطر ولا اروع! حتى بالصيف الاماراتي يدوم طويل 🔥', 
                'عطر شرقي اصيل ورائحة تجنن، استلمته سريع والتغليف راقي جداً 💎',
                'من افضل العطور الفاخرة، رائحة مميزة وانيقة 🌟',
                'عطر يناسب الذوق الخليجي، ثبات عالي ورائحة تعجب الكل 🇦🇪',
                'جودة ممتازة وسعر معقول، التوصيل كان سريع لدبي 🚚',
                'عطر راقي جداً، استخدمته في العرس وكل الناس سألت عنه 💐',
                'ريحة فخمة وثبات يدوم لأكثر من يوم كامل، راااائع! ⭐',
                'من أحلى العطور الشرقية، ينصح فيه للمناسبات الخاصة 🎉',
                'جودة عالية وتغليف أنيق، وصل بسرعة لأبوظبي 📦',
                'عطر مميز للغاية، رائحة ثابتة ومميزة للشخصية القوية 💪',
                'رائحة عطرة وجميلة، يناسب الجو الإماراتي تماماً 🌴'
            ],
            
            watches: [
                'ساعة راقية جداً والجودة ممتازة، تستاهل كل فلس 💎',
                'تصميم أنيق ومناسب للطقس الإماراتي، مقاومة للماء ممتازة 🌊',
                'ساعة فخمة وعملية، تناسب الشغل والمناسبات 👔',
                'جودة التصنيع عالية جداً، ساعة تدوم سنين طويلة ⏰',
                'تصميم عصري وأنيق، لفتت انتباه الكل في المكتب 💼',
                'ساعة رياضية ممتازة، مقاومة للخدوش والصدمات 🏃‍♂️',
                'شغل يدوي راقي وتفاصيل دقيقة، تستحق التقييم العالي ⭐',
                'ساعة كلاسيكية بتصميم عصري، مناسبة لجميع الأوقات 🕐',
                'السعر ممتاز مقارنة بالجودة، انصح فيها بقوة 👍',
                'وصلت بتغليف فاخر والحالة ممتازة، خدمة توصيل سريعة 📦',
                'ساعة مميزة وفخمة، تعكس الذوق الراقي 💫',
                'مريحة في اليد وخفيفة الوزن، مناسبة للاستخدام اليومي 🤲',
                'تصميم يناسب الشباب العصري، جودة ممتازة بسعر معقول 🔥',
                'ساعة أنيقة للغاية، حصلت على إعجاب الأصدقاء والعائلة 👨‍👩‍👧‍👦'
            ],

            gifts: [
                'هدية راقية ومميزة، عجبت الشخص اللي أهديتها له كثير 🎁',
                'تغليف فاخر وجودة ممتازة، مناسبة للمناسبات الخاصة ✨',
                'هدية أنيقة وعملية، تناسب جميع الأذواق 💝',
                'جودة عالية وسعر معقول، خيار ممتاز للهدايا 🌟',
                'وصلت في الوقت المحدد وبحالة ممتازة، خدمة رائعة 🚚',
                'هدية مميزة وراقية، لاقت إعجاب كبير 👏',
                'تصميم جميل وجودة فاخرة، تستحق كل نجمة ⭐',
                'مناسبة لجميع المناسبات، هدية لا تنسى 🎉',
                'حصلت على إعجاب الجميع، اختيار موفق 💎',
                'هدية راقية بسعر مناسب، انصح فيها للجميع 👌'
            ]
        };

        this.locations = [
            'دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة',
            'العين', 'الذيد', 'كلباء', 'خورفكان', 'دبا الفجيرة', 'مدينة زايد'
        ];

        this.timeExpressions = [
            'قبل أسبوع', 'قبل أسبوعين', 'قبل 3 أسابيع', 'قبل شهر', 'قبل شهرين', 
            'قبل 3 أشهر', 'قبل 4 أشهر', 'قبل 5 أشهر', 'قبل 6 أشهر'
        ];
    }

    generateReviewsForProduct(productTitle, category = 'perfumes', count = 18) {
        const reviews = [];
        const usedNames = new Set();
        
        for (let i = 0; i < count; i++) {
            // اختيار اسم فريد
            let name;
            do {
                name = this.emiratiNames[Math.floor(Math.random() * this.emiratiNames.length)];
            } while (usedNames.has(name) && usedNames.size < this.emiratiNames.length);
            usedNames.add(name);

            // تحديد التقييم (85% احتمال 5 نجوم، 15% احتمال 4 نجوم)
            const rating = Math.random() < 0.85 ? 5 : 4;
            
            // اختيار قالب التقييم
            const templates = this.reviewTemplates[category] || this.reviewTemplates.perfumes;
            let reviewText = templates[Math.floor(Math.random() * templates.length)];
            
            // إضافة تخصيص للمنتج أحياناً
            if (Math.random() < 0.3) {
                const productSpecific = this.generateProductSpecificComment(productTitle, category);
                reviewText = productSpecific + ' ' + reviewText;
            }

            // إضافة الموقع أحياناً
            if (Math.random() < 0.4) {
                const location = this.locations[Math.floor(Math.random() * this.locations.length)];
                reviewText += ` - من ${location}`;
            }

            // تاريخ عشوائي من 2015 إلى 2025
            const startDate = new Date('2015-01-01');
            const endDate = new Date('2025-12-31');
            const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
            const reviewDate = new Date(randomTime);

            reviews.push({
                id: `review_${Date.now()}_${i}`,
                author: name,
                rating: rating,
                comment: reviewText,
                date: reviewDate,
                verified: Math.random() < 0.8, // 80% تقييمات موثقة
                helpful: Math.floor(Math.random() * 25), // عدد الإعجابات
                location: Math.random() < 0.5 ? this.locations[Math.floor(Math.random() * this.locations.length)] : null
            });
        }

        // ترتيب التقييمات حسب التاريخ (الأحدث أولاً)
        reviews.sort((a, b) => b.date - a.date);
        
        return reviews;
    }

    generateProductSpecificComment(productTitle, category) {
        const specificComments = {
            perfumes: [
                `عطر ${productTitle.split(' ')[0]} حلو كثير`,
                `ريحة ${productTitle.split(' ')[0]} تجنن`,
                `${productTitle.split(' ')[0]} من أحلى العطور`,
                `جربت ${productTitle.split(' ')[0]} وعجبني وايد`
            ],
            watches: [
                `ساعة ${productTitle.split(' ')[0]} تحفة`,
                `${productTitle.split(' ')[0]} ساعة راقية`,
                `تصميم ${productTitle.split(' ')[0]} حلو كثير`,
                `جودة ${productTitle.split(' ')[0]} ممتازة`
            ],
            gifts: [
                `هدية ${productTitle.split(' ')[0]} مميزة`,
                `${productTitle.split(' ')[0]} اختيار موفق`,
                `شكل ${productTitle.split(' ')[0]} راقي كثير`
            ]
        };

        const comments = specificComments[category] || specificComments.perfumes;
        return comments[Math.floor(Math.random() * comments.length)];
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 7) {
            return `قبل ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `قبل ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `قبل ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `قبل ${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
        }
    }

    calculateAverageRating(reviews) {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    renderReviewsHTML(reviews, productId) {
        const averageRating = this.calculateAverageRating(reviews);
        const totalReviews = reviews.length;
        
        let html = `
            <div class="product-reviews" id="reviews-${productId}">
                <div class="reviews-summary">
                    <div class="rating-overview">
                        <div class="average-rating">
                            <span class="rating-number">${averageRating}</span>
                            <div class="stars-display">
                                ${this.generateStarsHTML(parseFloat(averageRating))}
                            </div>
                            <span class="total-reviews">(${totalReviews} تقييم)</span>
                        </div>
                        <div class="rating-breakdown">
                            ${this.generateRatingBreakdown(reviews)}
                        </div>
                    </div>
                </div>
                
                <div class="reviews-list">
                    <div class="reviews-header">
                        <h4>📝 آراء العملاء</h4>
                        <div class="reviews-filter">
                            <select onchange="filterReviews('${productId}', this.value)">
                                <option value="all">جميع التقييمات</option>
                                <option value="5">5 نجوم</option>
                                <option value="4">4 نجوم</option>
                                <option value="verified">موثق فقط</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="reviews-items" id="reviews-items-${productId}">
                        ${reviews.slice(0, 5).map(review => this.renderSingleReview(review)).join('')}
                    </div>
                    
                    ${reviews.length > 5 ? `
                        <button class="show-more-reviews" onclick="showMoreReviews('${productId}')">
                            عرض المزيد من التقييمات (${reviews.length - 5}+)
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        return html;
    }

    renderSingleReview(review) {
        return `
            <div class="review-item ${review.verified ? 'verified' : ''}" data-rating="${review.rating}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${review.author.charAt(0)}
                        </div>
                        <div class="reviewer-details">
                            <div class="reviewer-name">
                                ${review.author}
                                ${review.verified ? '<span class="verified-badge">✓ موثق</span>' : ''}
                            </div>
                            <div class="review-meta">
                                <div class="review-rating">
                                    ${this.generateStarsHTML(review.rating)}
                                </div>
                                <span class="review-date">${this.formatTimeAgo(review.date)}</span>
                                ${review.location ? `<span class="review-location">📍 ${review.location}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="review-content">
                    <p>${review.comment}</p>
                </div>
                
                <div class="review-actions">
                    <button class="helpful-btn" onclick="markHelpful('${review.id}')">
                        👍 مفيد (${review.helpful})
                    </button>
                    <button class="reply-btn" onclick="replyToReview('${review.id}')">
                        💬 رد
                    </button>
                </div>
            </div>
        `;
    }

    generateStarsHTML(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star filled">★</span>';
        }
        
        if (hasHalfStar) {
            stars += '<span class="star half">★</span>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star empty">☆</span>';
        }
        
        return stars;
    }

    generateRatingBreakdown(reviews) {
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            breakdown[review.rating]++;
        });
        
        const total = reviews.length;
        let html = '';
        
        for (let i = 5; i >= 1; i--) {
            const count = breakdown[i];
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            
            html += `
                <div class="rating-bar">
                    <span class="rating-label">${i} نجوم</span>
                    <div class="rating-progress">
                        <div class="rating-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="rating-count">${count}</span>
                </div>
            `;
        }
        
        return html;
    }
}

// إنشاء مثيل عام من المولد
window.uaeReviewsGenerator = new UAEReviewsGenerator();

// وظائف مساعدة عامة
window.filterReviews = function(productId, filterValue) {
    const reviewsContainer = document.getElementById(`reviews-items-${productId}`);
    const reviews = reviewsContainer.querySelectorAll('.review-item');
    
    reviews.forEach(review => {
        const rating = review.getAttribute('data-rating');
        const isVerified = review.classList.contains('verified');
        
        let show = false;
        
        switch(filterValue) {
            case 'all':
                show = true;
                break;
            case 'verified':
                show = isVerified;
                break;
            default:
                show = rating === filterValue;
                break;
        }
        
        review.style.display = show ? 'block' : 'none';
    });
};

window.showMoreReviews = function(productId) {
    // تنفيذ عرض المزيد من التقييمات
    console.log(`عرض المزيد من التقييمات للمنتج: ${productId}`);
};

window.markHelpful = function(reviewId) {
    const button = document.querySelector(`button[onclick="markHelpful('${reviewId}')"]`);
    if (button) {
        const currentCount = parseInt(button.textContent.match(/\d+/)[0]);
        button.innerHTML = `👍 مفيد (${currentCount + 1})`;
        button.style.color = '#25D366';
    }
};

window.replyToReview = function(reviewId) {
    alert('سيتم إضافة خاصية الرد على التقييمات قريباً! 💬');
};

// تطبيق التقييمات على جميع المنتجات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // العثور على جميع المنتجات وإضافة التقييمات
    const productCards = document.querySelectorAll('.product-card, .product-item');
    
    productCards.forEach((card, index) => {
        const productTitle = card.querySelector('.product-title, .product-name, h3, h4')?.textContent?.trim();
        const productPrice = card.querySelector('.product-price, .price');
        
        if (productTitle && productPrice) {
            // تحديد نوع المنتج
            let category = 'perfumes';
            if (productTitle.toLowerCase().includes('ساعة') || productTitle.toLowerCase().includes('watch')) {
                category = 'watches';
            } else if (productTitle.toLowerCase().includes('هدية') || productTitle.toLowerCase().includes('gift')) {
                category = 'gifts';
            }
            
            // توليد التقييمات
            const reviews = window.uaeReviewsGenerator.generateReviewsForProduct(productTitle, category);
            
            // إنشاء HTML للتقييمات
            const reviewsHTML = window.uaeReviewsGenerator.renderReviewsHTML(reviews, `product-${index}`);
            
            // إضافة التقييمات بعد السعر
            const reviewsContainer = document.createElement('div');
            reviewsContainer.innerHTML = reviewsHTML;
            
            // إدراج التقييمات بعد السعر
            productPrice.parentNode.insertBefore(reviewsContainer, productPrice.nextSibling);
        }
    });
});