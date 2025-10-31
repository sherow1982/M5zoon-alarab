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
    }

    // تحميل بيانات التقييمات من localStorage أو التوليد
    async init() {
        if (this.isInitialized) return;
        
        // تحميل أصوات "مفيد" المحفوظة
        this.loadHelpfulVotes();
        
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
        
        // تحميل المنتجات
        const products = await this.loadAllProducts();
        
        if (products.length === 0) {
            console.warn('لا توجد منتجات لتوليد التقييمات');
            return;
        }
        
        // توليد التقييمات لكل منتج
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
        
        // حفظ في localStorage
        this.saveReviewsToStorage();
        
        // إنشاء ملف JSON للاستخدام المستقبلي
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
        // استخدام مولد التقييمات الإماراتي إذا كان متاحاً
        if (window.uaeReviewsGenerator) {
            return window.uaeReviewsGenerator.generateReviewsForProduct(product.title, category, count);
        }
        
        // فولباك بسيط
        return this.createFallbackReviews(product, count);
    }

    // إنشاء تقييمات احتياطية
    createFallbackReviews(product, count) {
        const reviews = [];
        const names = ['أحمد المنصوري', 'فاطمة النعيمي', 'محمد الشامسي', 'عائشة الشحي'];
        const comments = [
            'منتج ممتاز وجودة عالية! 👌',
            'راضي جداً عن المنتج والخدمة ⭐',
            'تسليم سريع وتغليف فاخر 📦',
            'أنصح فيه بقوة! جودة ممتازة 💎'
        ];
        
        for (let i = 0; i < count; i++) {
            reviews.push({
                id: `review_${product.id}_${Date.now()}_${i}`,
                author: names[Math.floor(Math.random() * names.length)],
                rating: Math.random() < 0.8 ? 5 : 4,
                comment: comments[Math.floor(Math.random() * comments.length)],
                date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                verified: Math.random() < 0.7,
                helpful: Math.floor(Math.random() * 15),
                location: Math.random() < 0.4 ? ['دبي', 'أبوظبي', 'الشارقة'][Math.floor(Math.random() * 3)] : null
            });
        }
        
        return reviews.sort((a, b) => b.date - a.date);
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

    // إنشاء ملف JSON للتقييمات (للمطور)
    generateReviewsJSON() {
        const reviewsArray = Array.from(this.allReviewsData.values());
        const jsonData = JSON.stringify(reviewsArray, null, 2);
        
        // عرض البيانات في الكونسول للنسخ
        console.log('📄 بيانات reviews.json للحفظ:', jsonData);
        
        // محاولة تحميل كملف (قد لا يعمل في بعض المتصفحات)
        try {
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reviews.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('💾 تم إنشاء ملف reviews.json للتحميل');
        } catch (error) {
            console.log('ℹ️ لم يتمكن من إنشاء ملف التحميل، استخدم البيانات من الكونسول');
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
        const currentCount = this.helpfulVotes.get(reviewId) || 0;
        const newCount = currentCount + 1;
        
        this.helpfulVotes.set(reviewId, newCount);
        this.saveHelpfulVotes();
        
        // تحديث العرض
        const button = document.querySelector(`[data-review-id="${reviewId}"] .helpful-btn`);
        if (button) {
            button.innerHTML = `👍 مفيد (${newCount})`;
            button.style.color = '#25D366';
            button.style.background = 'rgba(37, 211, 102, 0.1)';
            button.disabled = true;
            
            // أنيميشن تأكيد
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }
        
        return newCount;
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

    // إنشاء HTML للتقييمات مع فلترة متقدمة
    createReviewsHTML(productId, options = {}) {
        const productReviews = this.getProductReviews(productId);
        
        if (!productReviews) {
            return '<div class="no-reviews": 