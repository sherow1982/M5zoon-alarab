/**
 * Schema Enhancer - Adds aggregateRating and reviews to JSON-LD Product schemas
 * Supports both Arabic and English product pages
 * 
 * Usage: Include in HTML: <script src="./js/schema-enhancer.js" defer></script>
 */

(function() {
  'use strict';

  // Reviews Database
  const reviewsDatabase = {
    ar: {
      perfume: [
        { author: 'أحمد محمد', rating: 5, text: 'رائع جداً، عطر أصلي وجودة ممتازة' },
        { author: 'فاطمة علي', rating: 5, text: 'تسليم سريع وجودة عالية جداً' },
        { author: 'محمود حسن', rating: 4, text: 'جيد لكن التعبئة بطيئة قليلاً' },
        { author: 'نور خالد', rating: 5, text: 'ممتاز جداً وصل في الوقت المحدد' },
        { author: 'سارة إبراهيم', rating: 5, text: 'رائع، سأشتري منهم مرة أخرى' },
      ],
      watch: [
        { author: 'خالد محمد', rating: 5, text: 'ساعة أصلية وجودة عالية جداً' },
        { author: 'ليلى أحمد', rating: 5, text: 'شحن سريع وتغليف احترافي' },
        { author: 'يوسف علي', rating: 4, text: 'منتج جيد والسعر مناسب' },
        { author: 'مريم حسن', rating: 5, text: 'رائعة جداً، ستنصح بها صديقاتي' },
      ],
      gift: [
        { author: 'علي محمود', rating: 5, text: 'هدية رائعة جداً، الجودة عالية' },
        { author: 'نادية إبراهيم', rating: 5, text: 'ممتاز جداً وبسعر مناسب' },
      ],
    },
    en: {
      perfume: [
        { author: 'Ahmed Muhammad', rating: 5, text: 'Excellent, original perfume with outstanding quality' },
        { author: 'Fatima Ali', rating: 5, text: 'Fast delivery and excellent quality' },
        { author: 'Mahmoud Hassan', rating: 4, text: 'Good, but shipping took a bit longer' },
        { author: 'Noor Khalid', rating: 5, text: 'Excellent, arrived on time' },
        { author: 'Sarah Ibrahim', rating: 5, text: 'Great, will buy again' },
      ],
      watch: [
        { author: 'Khaled Muhammad', rating: 5, text: 'Original watch with excellent quality' },
        { author: 'Layla Ahmad', rating: 5, text: 'Fast shipping and professional packaging' },
        { author: 'Youssef Ali', rating: 4, text: 'Good product at reasonable price' },
        { author: 'Mariam Hassan', rating: 5, text: 'Excellent, will recommend to friends' },
      ],
    },
  };

  /**
   * Get page language (AR/EN)
   */
  function getPageLanguage() {
    const htmlTag = document.documentElement;
    const lang = htmlTag.getAttribute('lang') || htmlTag.getAttribute('xml:lang') || 'ar';
    return lang.startsWith('en') ? 'en' : 'ar';
  }

  /**
   * Get reviews based on product type and language
   */
  function getReviewsForProduct(productName, language) {
    const nameLower = productName.toLowerCase();
    const langReviews = reviewsDatabase[language] || reviewsDatabase.ar;

    let category = 'gift';
    if (عطر' in productName || 'perfume' in nameLower || 'fragrance' in nameLower) {
      category = 'perfume';
    } else if ('ساعة' in productName || 'watch' in nameLower || 'clock' in nameLower) {
      category = 'watch';
    }

    return langReviews[category] || langReviews.gift;
  }

  /**
   * Calculate aggregate rating
   */
  function calculateAggregateRating(reviews) {
    if (!reviews || reviews.length === 0) {
      return {
        ratingValue: 4.5,
        ratingCount: 0,
        bestRating: 5,
        worstRating: 1,
      };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      ratingValue: Math.round((sum / reviews.length) * 10) / 10,
      ratingCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
  }

  /**
   * Format date as ISO 8601
   */
  function getISODate() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Enhance existing JSON-LD schema
   */
  function enhanceProductSchema() {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const language = getPageLanguage();

    scripts.forEach((script) => {
      try {
        const schema = JSON.parse(script.textContent);

        // Only process Product schemas
        if (schema['@type'] === 'Product') {
          const productName = schema.name || document.title;
          const reviews = getReviewsForProduct(productName, language);
          const aggregateRating = calculateAggregateRating(reviews);

          // Add aggregateRating
          schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.ratingValue,
            ratingCount: aggregateRating.ratingCount,
            bestRating: aggregateRating.bestRating,
            worstRating: aggregateRating.worstRating,
          };

          // Add reviews
          schema.review = reviews.map((review) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: review.author,
            },
            datePublished: getISODate(),
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: review.text,
          }));

          // Update script content
          script.textContent = JSON.stringify(schema, null, 2);
          console.log('✓ Schema enhanced:', productName, `Rating: ${aggregateRating.ratingValue}/5`);
        }
      } catch (e) {
        console.warn('Failed to parse JSON-LD schema:', e.message);
      }
    });
  }

  /**
   * Initialize when DOM is ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceProductSchema);
    } else {
      enhanceProductSchema();
    }
  }

  // Start initialization
  init();

  // Export for debugging (optional)
  window.SchemaEnhancer = {
    enhance: enhanceProductSchema,
    getLanguage: getPageLanguage,
    getReviews: getReviewsForProduct,
  };
})();
