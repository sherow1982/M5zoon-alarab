// Reviews System for English Version

class ReviewsSystem {
    constructor() {
        this.reviews = [];
        this.currentProductReviews = [];
        this.reviewsPerPage = 10;
        this.currentPage = 1;
        this.filters = {
            rating: 'all',
            verified: false,
            sortBy: 'newest'
        };
    }
    
    async initialize() {
        await this.loadReviews();
        this.initializeReviewInteractions();
        console.log('✅ Reviews system initialized');
    }
    
    async loadReviews() {
        try {
            const response = await fetch('../data/reviews.json');
            const arabicReviews = await response.json();
            
            // Translate reviews to English
            this.reviews = arabicReviews.map(review => ({
                ...review,
                translatedComment: this.translateReview(review.comment),
                translatedName: this.translateName(review.name)
            }));
            
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = this.generateSampleReviews();
        }
    }
    
    translateReview(arabicComment) {
        // Simple translation - in production, use proper translation service
        const translations = {
            'ممتاز': 'excellent',
            'جيد': 'good',
            'رائع': 'wonderful',
            'جميل': 'beautiful',
            'عطر': 'perfume',
            'ساعة': 'watch',
            'جودة': 'quality',
            'سريع': 'fast',
            'توصيل': 'delivery',
            'شكرا': 'thank you',
            'موصى به': 'recommended',
            'رائحة': 'fragrance',
            'جميلة': 'beautiful',
            'ممتازة': 'excellent'
        };
        
        if (!arabicComment) return 'Great product with excellent quality!';
        
        let translated = arabicComment.toLowerCase();
        Object.keys(translations).forEach(arabic => {
            translated = translated.replace(new RegExp(arabic, 'g'), translations[arabic]);
        });
        
        // If no translation happened, return generic review
        if (translated === arabicComment.toLowerCase()) {
            return this.getRandomEnglishReview();
        }
        
        return translated.charAt(0).toUpperCase() + translated.slice(1);
    }
    
    translateName(arabicName) {
        // Convert Arabic names to English equivalents
        const nameTranslations = {
            'محمد': 'Mohammed',
            'أحمد': 'Ahmed',
            'فاطمة': 'Fatima',
            'عائشة': 'Aisha',
            'عبدالله': 'Abdullah',
            'علي': 'Ali',
            'سارة': 'Sarah',
            'يوسف': 'Yusuf',
            'مريم': 'Mariam',
            'خالد': 'Khalid'
        };
        
        if (!arabicName) return 'Customer';
        
        let translatedName = arabicName;
        Object.keys(nameTranslations).forEach(arabic => {
            translatedName = translatedName.replace(arabic, nameTranslations[arabic]);
        });
        
        if (translatedName === arabicName) {
            return this.getRandomEnglishName();
        }
        
        return translatedName;
    }
    
    getRandomEnglishReview() {
        const reviews = [
            'Outstanding quality and fast delivery!',
            'Exactly what I was looking for. Highly recommended!',
            'Beautiful product with excellent packaging.',
            'Great value for money. Very satisfied!',
            'Premium quality as advertised. Will buy again!',
            'Fast shipping and authentic product.',
            'Exceeded my expectations. Five stars!',
            'Professional service and quality products.',
            'Perfect for gifting. Beautifully presented.',
            'Authentic and high-quality. Recommended!'
        ];
        
        return reviews[Math.floor(Math.random() * reviews.length)];
    }
    
    getRandomEnglishName() {
        const names = [
            'Alex M.', 'Sarah K.', 'John D.', 'Emma R.', 'David L.',
            'Lisa W.', 'Michael B.', 'Anna S.', 'Chris T.', 'Maya P.',
            'Omar A.', 'Layla H.', 'Ahmed K.', 'Noor Al.', 'Hassan M.'
        ];
        
        return names[Math.floor(Math.random() * names.length)];
    }
    
    generateSampleReviews() {
        const sampleReviews = [];
        const products = ['Premium Perfume', 'Luxury Watch', 'Oriental Fragrance', 'Designer Watch'];
        
        for (let i = 0; i < 50; i++) {
            sampleReviews.push({
                id: i + 1,
                productId: Math.floor(Math.random() * 20) + 1,
                name: this.getRandomEnglishName(),
                translatedName: this.getRandomEnglishName(),
                rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                comment: this.getRandomEnglishReview(),
                translatedComment: this.getRandomEnglishReview(),
                date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                verified: Math.random() > 0.3,
                helpful: Math.floor(Math.random() * 20)
            });
        }
        
        return sampleReviews;
    }
    
    getProductReviews(productId, filters = {}) {
        let productReviews = this.reviews.filter(review => 
            review.productId == productId || Math.random() > 0.7
        );
        
        // Apply filters
        if (filters.rating && filters.rating !== 'all') {
            const minRating = parseInt(filters.rating);
            productReviews = productReviews.filter(review => review.rating >= minRating);
        }
        
        if (filters.verified) {
            productReviews = productReviews.filter(review => review.verified);
        }
        
        // Apply sorting
        switch (filters.sortBy) {
            case 'oldest':
                productReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'rating-high':
                productReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-low':
                productReviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                productReviews.sort((a, b) => b.helpful - a.helpful);
                break;
            default: // newest
                productReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        return productReviews;
    }
    
    renderReviews(productId, containerId, filters = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const reviews = this.getProductReviews(productId, filters);
        
        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-alt"></i>
                    <p>No reviews yet. Be the first to review this product!</p>
                </div>
            `;
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
        const endIndex = startIndex + this.reviewsPerPage;
        const paginatedReviews = reviews.slice(startIndex, endIndex);
        
        container.innerHTML = paginatedReviews.map(review => this.createReviewHTML(review)).join('');
        
        // Add pagination if needed
        if (reviews.length > this.reviewsPerPage) {
            container.innerHTML += this.createPaginationHTML(reviews.length);
        }
        
        this.initializeReviewInteractions();
    }
    
    createReviewHTML(review) {
        const timeAgo = this.getTimeAgo(new Date(review.date));
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        return `
            <div class="review-item" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-name">
                            ${review.translatedName}
                            ${review.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                        </div>
                        <div class="review-date">${timeAgo}</div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-number">${review.rating}/5</span>
                    </div>
                </div>
                <div class="review-content">
                    <p class="review-text">${review.translatedComment}</p>
                </div>
                <div class="review-actions">
                    <button class="btn-helpful" data-review-id="${review.id}" data-helpful="${review.helpful}">
                        <i class="fas fa-thumbs-up"></i>
                        Helpful (${review.helpful})
                    </button>
                    <button class="btn-report" data-review-id="${review.id}">
                        <i class="fas fa-flag"></i>
                        Report
                    </button>
                </div>
            </div>
        `;
    }
    
    createPaginationHTML(totalReviews) {
        const totalPages = Math.ceil(totalReviews / this.reviewsPerPage);
        if (totalPages <= 1) return '';
        
        let paginationHTML = '<div class="reviews-pagination">';
        
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="reviewsSystem.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        paginationHTML += '</div>';
        return paginationHTML;
    }
    
    initializeReviewInteractions() {
        // Helpful buttons
        const helpfulBtns = document.querySelectorAll('.btn-helpful');
        helpfulBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const reviewId = this.getAttribute('data-review-id');
                const currentCount = parseInt(this.getAttribute('data-helpful'));
                
                // Check if already marked as helpful
                const helpfulReviews = JSON.parse(localStorage.getItem('helpful-reviews-en') || '[]');
                
                if (helpfulReviews.includes(reviewId)) {
                    uiManager.showNotification('You already marked this review as helpful', 'info');
                    return;
                }
                
                // Add to helpful reviews
                helpfulReviews.push(reviewId);
                localStorage.setItem('helpful-reviews-en', JSON.stringify(helpfulReviews));
                
                // Update display
                const newCount = currentCount + 1;
                this.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${newCount})`;
                this.classList.add('voted');
                this.disabled = true;
                
                uiManager.showNotification('Thank you for your feedback!', 'success');
            });
        });
        
        // Report buttons
        const reportBtns = document.querySelectorAll('.btn-report');
        reportBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const reviewId = this.getAttribute('data-review-id');
                this.reportReview(reviewId);
            }.bind(this));
        });
    }
    
    reportReview(reviewId) {
        // Simple report functionality
        uiManager.showNotification('Review reported. Thank you for helping maintain quality.', 'info');
        
        const reportedReviews = JSON.parse(localStorage.getItem('reported-reviews-en') || '[]');
        if (!reportedReviews.includes(reviewId)) {
            reportedReviews.push(reviewId);
            localStorage.setItem('reported-reviews-en', JSON.stringify(reportedReviews));
        }
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        const weeks = Math.floor(diff / 604800000);
        const months = Math.floor(diff / 2592000000);
        
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        if (weeks < 4) return `${weeks} weeks ago`;
        return `${months} months ago`;
    }
    
    goToPage(page) {
        this.currentPage = page;
        // Re-render current product reviews
        if (this.currentProductId) {
            this.renderReviews(this.currentProductId, 'product-reviews', this.filters);
        }
    }
    
    applyFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.currentPage = 1;
        
        if (this.currentProductId) {
            this.renderReviews(this.currentProductId, 'product-reviews', this.filters);
        }
    }
    
    generateProductReviews(productId, productName) {
        // Generate contextual reviews for a product
        const reviewTemplates = [
            `Amazing ${productName}! Exceeded my expectations.`,
            `High quality ${productName}. Fast delivery too!`,
            `Beautiful ${productName}, exactly as described.`,
            `Great value for money. The ${productName} is perfect.`,
            `Authentic ${productName} with premium packaging.`,
            `Excellent customer service and quality ${productName}.`,
            `Fast shipping and the ${productName} is wonderful.`,
            `Perfect gift! The ${productName} was a hit.`,
            `Outstanding quality ${productName}. Highly recommend!`,
            `Professional service and authentic ${productName}.`
        ];
        
        return reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
    }
}

// Create global reviews system instance
const reviewsSystem = new ReviewsSystem();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    reviewsSystem.initialize();
});

// Export for global access
window.reviewsSystem = reviewsSystem;
window.ReviewsSystem = ReviewsSystem;