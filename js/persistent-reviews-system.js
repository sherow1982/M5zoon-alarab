// نظام التقييمات الثابت مع حفظ البيانات
class PersistentReviewsSystem {
    constructor() {
        this.storageKeys = {
            reviews: 'emirates-reviews-data',
            helpfulVotes: 'emirates-reviews-helpful-votes',
            reviewsGenerated: 'emirates-reviews-generated',
            lastGeneration: 'emirates-last-reviews-generation'
        };
        
        this.isInitialized = false;
        this.allReviewsData = new Map();
        this.helpfulVotes = new Map();
        this.userVotedReviews = new Set(); // تتبع المراجعات التي صوت عليها المستخدم
    }

    // تحميل بيانات التقييمات من localStorage أو التوليد
    async init() {
        if (this.isInitialized) return;
        
        // تحميل أصوات "مفيد" المحفوظة
        this.loadHelpfulVotes();
        this.loadUserVotedReviews();
        
        // محاولة تحميل التقييمات من ملف JSON أولاً
        const loadedFromJSON = await this.loadReviewsFromJSON();
        
        if (!loadedFromJSON) {
            // إذا لم تُحمّل من JSON، تحقق من localStorage
            const loadedFromStorage = this.loadReviewsFromStorage();
            
            if (!loadedFromStorage) {
                // إذا لم توجد بيانات محفوظة، قم بالتوليد
                await this.generateAndSaveAllReviews();
            }
        }
        
        this.isInitialized = true;
        console.log('✅ تم تهيئة نظام التقييمات الثابت');
    }

    // محاولة تحميل من data/reviews.json
    async loadReviewsFromJSON() {
        try {
            const response = await fetch('./data/reviews.json');
            if (response.ok) {
                const reviewsData = await response.json();
                
                reviewsData.forEach(productReviews => {
                    this.allReviewsData.set(productReviews.productId.toString(), productReviews);
                });
                
                console.log('✅ تم تحميل التقييمات من reviews.json');
                return true;
            }
        } catch (error) {
            console.log('ℹ️ لم يتم العثور على reviews.json، سيتم التوليد محلياً');
        }
        return false;
    }

    // تحميل من localStorage
    loadReviewsFromStorage() {
        try {
            const savedReviews = localStorage.getItem(this.storageKeys.reviews);
            const lastGeneration = localStorage.getItem(this.storageKeys.lastGeneration);
            
            if (savedReviews) {
                const reviewsData = JSON.parse(savedReviews);
                
                // تحقق من أن البيانات ليست قديمة جداً (أكثر من 30 يوم)
                const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
                if (lastGeneration && parseInt(lastGeneration) > thirtyDaysAgo) {
                    
                    reviewsData.forEach(productReviews => {
                        this.allReviewsData.set(productReviews.productId.toString(), productReviews);
                    });
                    
                    console.log('✅ تم تحميل التقييمات من localStorage');
                    return true;
                }
            }
        } catch (error) {
            console.warn('خطأ في تحميل التقييمات من localStorage:', error);
        }
        return false;
    }

    // توليد وحفظ جميع التقييمات
    async generateAndSaveAllReviews() {
        console.log('🔄 جاري توليد التقييمات لجميع المنتجات...');
        
        const products = await this.loadAllProducts();
        
        if (products.length === 0) {
            console.warn('لا توجد منتجات لتوليد التقييمات');
            return;
        }
        
        products.forEach(product => {
            const category = this.determineProductCategory(product);
            const reviewCount = Math.floor(Math.random() * 6) + 15; // 15-20
            const reviews = this.generateProductReviews(product, category, reviewCount);
            
            this.allReviewsData.set(product.id.toString(), {
                productId: product.id,
                productTitle: product.title,
                category: category,
                reviews: reviews,
                averageRating: this.calculateAverageRating(reviews),
                totalCount: reviews.length,
                generatedAt: Date.now()
            });
        });
        
        this.saveReviewsToStorage();
        this.generateReviewsJSON();
        
        console.log(`✅ تم توليد التقييمات لـ ${products.length} منتج`);
    }

    // تحميل جميع المنتجات
    async loadAllProducts() {
        try {
            const [perfumesResponse, watchesResponse] = await Promise.all([
                fetch('./data/otor.json').catch(() => ({ ok: false })),
                fetch('./data/sa3at.json').catch(() => ({ ok: false }))
            ]);
            
            let products = [];
            
            if (perfumesResponse.ok) {
                const perfumes = await perfumesResponse.json();
                products.push(...perfumes.map(p => ({ ...p, type: 'perfume' })));
            }
            
            if (watchesResponse.ok) {
                const watches = await watchesResponse.json();
                products.push(...watches.map(p => ({ ...p, type: 'watch' })));
            }
            
            return products;
        } catch (error) {
            console.error('خطأ في تحميل المنتجات:', error);
            return [];
        }
    }

    // تحديد فئة المنتج
    determineProductCategory(product) {
        if (product.type === 'perfume') return 'perfumes';
        if (product.type === 'watch') return 'watches';
        
        const title = product.title.toLowerCase();
        if (title.includes('عطر') || title.includes('perfume')) return 'perfumes';
        if (title.includes('ساعة') || title.includes('watch')) return 'watches';
        
        return 'gifts';
    }

    // توليد تقييمات المنتج
    generateProductReviews(product, category, count) {
        if (window.uaeReviewsGenerator) {
            return window.uaeReviewsGenerator.generateReviewsForProduct(product.title, category, count);
        }
        
        return this.createFallbackReviews(product, count);
    }

    // إنشاء تقييمات احتياطية
    createFallbackReviews(product, count) {
        const reviews = [];
        const names = ['أحمد المنصوري', 'فاطمة النعيمي', 'محمد الشامسي', 'عائشة الشحي', 'سالم الزعابي'];
        const comments = [
            'منتج ممتاز وجودة عالية! 👌',
            'راضي جداً عن المنتج والخدمة ⭐',
            'تسليم سريع وتغليف فاخر 📦',
            'أنصح به بقوة! جودة ممتازة 💎'
        ];
        
        for (let i = 0; i < count; i++) {
            const reviewDate = new Date(2015 + Math.random() * 10, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            
            reviews.push({
                id: `review_${product.id}_${Date.now()}_${i}`,
                author: names[Math.floor(Math.random() * names.length)],
                rating: Math.random() < 0.75 ? 5 : 4,
                comment: comments[Math.floor(Math.random() * comments.length)],
                date: reviewDate.toISOString(),
                verified: Math.random() < 0.6,
                helpful: Math.floor(Math.random() * 15),
                location: Math.random() < 0.4 ? ['دبي', 'أبوظبي', 'الشارقة', 'عجمان'][Math.floor(Math.random() * 4)] : null
            });
        }
        
        return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // حساب متوسط التقييم
    calculateAverageRating(reviews) {
        if (reviews.length === 0) return 4.5;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    // حفظ التقييمات في localStorage
    saveReviewsToStorage() {
        try {
            const reviewsArray = Array.from(this.allReviewsData.values());
            localStorage.setItem(this.storageKeys.reviews, JSON.stringify(reviewsArray));
            localStorage.setItem(this.storageKeys.lastGeneration, Date.now().toString());
            localStorage.setItem(this.storageKeys.reviewsGenerated, 'true');
        } catch (error) {
            console.warn('خطأ في حفظ التقييمات:', error);
        }
    }

    // تحميل أصوات "مفيد"
    loadHelpfulVotes() {
        try {
            const savedVotes = localStorage.getItem(this.storageKeys.helpfulVotes);
            if (savedVotes) {
                const votesData = JSON.parse(savedVotes);
                Object.entries(votesData).forEach(([reviewId, count]) => {
                    this.helpfulVotes.set(reviewId, count);
                });
            }
        } catch (error) {
            console.warn('خطأ في تحميل أصوات "مفيد":', error);
        }
    }

    // تحميل قائمة المراجعات التي صوت عليها
    loadUserVotedReviews() {
        try {
            const votedReviews = localStorage.getItem('emirates-user-voted-reviews');
            if (votedReviews) {
                const voted = JSON.parse(votedReviews);
                this.userVotedReviews = new Set(voted);
            }
        } catch (error) {
            console.warn('خطأ في تحميل قائمة التصويت:', error);
        }
    }

    // حفظ قائمة المراجعات التي صوت عليها
    saveUserVotedReviews() {
        try {
            localStorage.setItem('emirates-user-voted-reviews', JSON.stringify(Array.from(this.userVotedReviews)));
        } catch (error) {
            console.warn('خطأ في حفظ قائمة التصويت:', error);
        }
    }

    // حفظ أصوات "مفيد"
    saveHelpfulVotes() {
        try {
            const votesObject = Object.fromEntries(this.helpfulVotes);
            localStorage.setItem(this.storageKeys.helpfulVotes, JSON.stringify(votesObject));
        } catch (error) {
            console.warn('خطأ في حفظ أصوات "مفيد":', error);
        }
    }

    // زيادة صوت "مفيد" لمراجعة
    markReviewHelpful(reviewId) {
        // تحقق من عدم التصويت مسبقاً
        if (this.userVotedReviews.has(reviewId)) {
            return { success: false, message: 'لقد صوتّت على هذه المراجعة مسبقاً' };
        }
        
        const currentCount = this.helpfulVotes.get(reviewId) || 0;
        const newCount = currentCount + 1;
        
        this.helpfulVotes.set(reviewId, newCount);
        this.userVotedReviews.add(reviewId);
        
        this.saveHelpfulVotes();
        this.saveUserVotedReviews();
        
        // تحديث العرض
        const button = document.querySelector(`[data-review-id="${reviewId}"] .helpful-btn`);
        if (button) {
            button.innerHTML = `👍 مفيد (${newCount})`;
            button.style.color = '#25D366';
            button.style.background = 'rgba(37, 211, 102, 0.1)';
            button.style.borderColor = '#25D366';
            button.disabled = true;
            
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }
        
        return { success: true, newCount: newCount };
    }

    // الحصول على تقييمات المنتج
    getProductReviews(productId) {
        const productReviews = this.allReviewsData.get(productId.toString());
        
        if (productReviews) {
            // تحديث أعداد "مفيد" من البيانات المحفوظة
            productReviews.reviews.forEach(review => {
                const savedCount = this.helpfulVotes.get(review.id);
                if (savedCount !== undefined) {
                    review.helpful = savedCount;
                }
            });
        }
        
        return productReviews;
    }

    // فلترة التقييمات
    filterReviews(productId, filter = 'all', limit = null) {
        const productReviews = this.getProductReviews(productId);
        
        if (!productReviews) return { reviews: [], total: 0 };
        
        let filteredReviews = [...productReviews.reviews];
        
        switch (filter) {
            case 'verified':
                filteredReviews = filteredReviews.filter(r => r.verified);
                break;
            case '5stars':
                filteredReviews = filteredReviews.filter(r => r.rating === 5);
                break;
            case '4stars':
                filteredReviews = filteredReviews.filter(r => r.rating === 4);
                break;
            case 'helpful':
                filteredReviews = filteredReviews.sort((a, b) => b.helpful - a.helpful);
                break;
            case 'newest':
                filteredReviews = filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredReviews = filteredReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
        }
        
        const total = filteredReviews.length;
        
        if (limit && limit > 0) {
            filteredReviews = filteredReviews.slice(0, limit);
        }
        
        return { reviews: filteredReviews, total: total };
    }

    // عرض تقييمات مختصرة (لبطاقات المنتجات)
    createSummaryHTML(productId) {
        const productReviews = this.getProductReviews(productId);
        
        if (!productReviews) {
            return '<div class="rating-summary"><span class="no-rating">لا توجد تقييمات بعد</span></div>';
        }
        
        const avgRating = parseFloat(productReviews.averageRating);
        const totalCount = productReviews.totalCount;
        const starsHTML = this.generateStarsHTML(avgRating);
        
        return `
            <div class="product-rating-summary">
                <div class="rating-stars">${starsHTML}</div>
                <span class="rating-average">${avgRating}</span>
                <span class="rating-count">(مراجعة ${totalCount})</span>
                <span class="verified-badge">✓ موثق</span>
            </div>
        `;
    }

    // عرض تقييمات مفصلة (لصفحة المنتج)
    createDetailedReviewsHTML(productId, options = {}) {
        const defaultOptions = {
            showFilter: true,
            showLoadMore: true,
            initialLimit: 5,
            filter: 'all'
        };
        
        const opts = { ...defaultOptions, ...options };
        const productReviews = this.getProductReviews(productId);
        
        if (!productReviews) {
            return `<div class="no-reviews">لا توجد تقييمات لهذا المنتج بعد</div>`;
        }
        
        const { reviews: filteredReviews, total } = this.filterReviews(productId, opts.filter, opts.initialLimit);
        const avgRating = parseFloat(productReviews.averageRating);
        
        let html = `
            <div class="product-reviews" data-product-id="${productId}">
                <!-- ملخص التقييمات -->
                <div class="reviews-summary">
                    <div class="rating-overview">
                        <div class="average-rating">
                            <span class="rating-number">${avgRating}</span>
                            <div class="stars-display">${this.generateStarsHTML(avgRating)}</div>
                            <div class="total-reviews">بناءً على ${productReviews.totalCount} تقييم</div>
                        </div>
                        <div class="rating-breakdown">
                            ${this.createRatingBreakdown(productReviews.reviews)}
                        </div>
                    </div>
                </div>
        `;
        
        // فلاتر التقييمات
        if (opts.showFilter) {
            html += `
                <div class="reviews-header">
                    <h4>التقييمات والمراجعات</h4>
                    <div class="reviews-filter">
                        <select onchange="window.persistentReviews.updateReviewsDisplay('${productId}', this.value)">
                            <option value="all">جميع التقييمات</option>
                            <option value="verified">موثق فقط</option>
                            <option value="5stars">5 نجوم فقط</option>
                            <option value="4stars">4 نجوم فقط</option>
                            <option value="helpful">الأكثر إفادة</option>
                            <option value="newest">الأحدث</option>
                        </select>
                    </div>
                </div>
            `;
        }
        
        // قائمة التقييمات
        html += `
            <div class="reviews-list">
                <div class="reviews-items" id="reviews-items-${productId}">
                    ${this.createReviewItemsHTML(filteredReviews)}
                </div>
        `;
        
        // زر عرض المزيد
        if (opts.showLoadMore && total > opts.initialLimit) {
            html += `
                <button class="show-more-reviews" onclick="window.persistentReviews.loadMoreReviews('${productId}')" data-remaining="${total - opts.initialLimit}">
                    عرض ${total - opts.initialLimit} تقييم إضافي
                </button>
            `;
        }
        
        html += '</div></div>';
        
        return html;
    }

    // إنشاء HTML لعناصر التقييم
    createReviewItemsHTML(reviews) {
        return reviews.map(review => {
            const reviewDate = new Date(review.date).toLocaleDateString('ar-AE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const hasUserVoted = this.userVotedReviews.has(review.id);
            const helpfulCount = this.helpfulVotes.get(review.id) || review.helpful || 0;
            
            return `
                <div class="review-item ${review.verified ? 'verified' : ''}" data-review-id="${review.id}">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">${review.author.charAt(0)}</div>
                            <div class="reviewer-details">
                                <div class="reviewer-name">
                                    ${review.author}
                                    ${review.verified ? '<span class="verified-badge">✓ موثق</span>' : ''}
                                </div>
                                <div class="review-meta">
                                    <div class="review-rating">
                                        ${this.generateStarsHTML(review.rating)}
                                    </div>
                                    <div class="review-date">${reviewDate}</div>
                                    ${review.location ? `<div class="review-location">📍 ${review.location}</div>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="review-content">
                        <p>${review.comment}</p>
                    </div>
                    <div class="review-actions">
                        <button class="helpful-btn ${hasUserVoted ? 'voted' : ''}" 
                                onclick="window.persistentReviews.handleHelpfulClick('${review.id}')"
                                ${hasUserVoted ? 'disabled' : ''}>
                            👍 مفيد (${helpfulCount})
                        </button>
                        <button class="reply-btn" onclick="window.persistentReviews.showReplyForm('${review.id}')">
                            💬 رد
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // إنشاء تفصيل التقييمات
    createRatingBreakdown(reviews) {
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
        });
        
        const total = reviews.length;
        
        return Object.entries(breakdown)
            .reverse()
            .map(([stars, count]) => {
                const percentage = total > 0 ? (count / total) * 100 : 0;
                return `
                    <div class="rating-bar">
                        <span class="rating-label">${stars} ★</span>
                        <div class="rating-progress">
                            <div class="rating-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="rating-count">${count}</span>
                    </div>
                `;
            })
            .join('');
    }

    // توليد HTML للنجوم
    generateStarsHTML(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star filled">★</span>';
        }
        
        if (hasHalfStar) {
            stars += '<span class="star half">☆</span>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star empty">☆</span>';
        }
        
        return stars;
    }

    // معالجة نقرة "مفيد"
    handleHelpfulClick(reviewId) {
        const result = this.markReviewHelpful(reviewId);
        
        if (!result.success) {
            // عرض رسالة تنبيه
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10000;
                background: #f39c12; color: white; padding: 15px 20px;
                border-radius: 10px; font-weight: 600;
                animation: slideInRight 0.3s ease-out;
            `;
            notification.textContent = result.message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // تحديث عرض التقييمات بفلتر جديد
    updateReviewsDisplay(productId, filter) {
        const { reviews } = this.filterReviews(productId, filter, null);
        const container = document.getElementById(`reviews-items-${productId}`);
        
        if (container) {
            container.innerHTML = this.createReviewItemsHTML(reviews);
        }
    }

    // تحميل المزيد من التقييمات
    loadMoreReviews(productId) {
        const button = document.querySelector(`[onclick*="loadMoreReviews('${productId}')"]`);
        const container = document.getElementById(`reviews-items-${productId}`);
        
        if (!button || !container) return;
        
        const remaining = parseInt(button.getAttribute('data-remaining')) || 0;
        const currentReviews = container.querySelectorAll('.review-item').length;
        const loadCount = Math.min(remaining, 5);
        
        const { reviews } = this.filterReviews(productId, 'all', currentReviews + loadCount);
        const newReviews = reviews.slice(currentReviews);
        
        // إضافة التقييمات الجديدة
        const newHTML = this.createReviewItemsHTML(newReviews);
        container.insertAdjacentHTML('beforeend', newHTML);
        
        // تحديث الزر
        const newRemaining = remaining - loadCount;
        if (newRemaining > 0) {
            button.innerHTML = `عرض ${newRemaining} تقييم إضافي`;
            button.setAttribute('data-remaining', newRemaining);
        } else {
            button.style.display = 'none';
        }
    }

    // إنشاء ملف JSON للتقييمات
    generateReviewsJSON() {
        const reviewsArray = Array.from(this.allReviewsData.values());
        const jsonData = JSON.stringify(reviewsArray, null, 2);
        
        console.log('📄 بيانات reviews.json للنسخ إلى data/reviews.json:', jsonData);
        
        // عرض رسالة للمطور
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background: #3498db; color: white; padding: 15px 20px;
            border-radius: 10px; font-weight: 600; max-width: 300px;
            animation: slideInRight 0.4s ease-out;
        `;
        notification.innerHTML = `
            📄 تم توليد reviews.json<br>
            <small>تحقق من الكونسول لنسخ البيانات</small>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // عرض نموذج الرد
    showReplyForm(reviewId) {
        alert('ميزة الرد على التقييمات قريباً!');
    }

    // حذف جميع بيانات التقييمات (للمطورين)
    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        localStorage.removeItem('emirates-user-voted-reviews');
        
        this.allReviewsData.clear();
        this.helpfulVotes.clear();
        this.userVotedReviews.clear();
        
        console.log('🗑️ تم حذف جميع بيانات التقييمات');
    }

    // إعادة توليد التقييمات
    async regenerateReviews() {
        this.clearAllData();
        this.isInitialized = false;
        await this.init();
    }

    // إحصائيات سريعة
    getStats() {
        const totalProducts = this.allReviewsData.size;
        const totalReviews = Array.from(this.allReviewsData.values())
            .reduce((sum, product) => sum + product.totalCount, 0);
        const totalHelpfulVotes = Array.from(this.helpfulVotes.values())
            .reduce((sum, count) => sum + count, 0);
        
        return {
            totalProducts,
            totalReviews,
            totalHelpfulVotes,
            userVotedCount: this.userVotedReviews.size
        };
    }
}

// تفعيل النظام
document.addEventListener('DOMContentLoaded', async function() {
    window.persistentReviews = new PersistentReviewsSystem();
    await window.persistentReviews.init();
    
    console.log('🎆 نظام التقييمات الثابت جاهز!');
});

// تصدير النظام للاستخدام الخارجي
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersistentReviewsSystem;
}