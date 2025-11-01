/**
 * URL Generator System for Emirates Gifts
 * Ensures ALL product links follow the format:
 * product-details.html?id=watch_88&category=watch&slug=rolex-kaaba-design
 * Version: v20251101-URL-STANDARD
 */

(function() {
    'use strict';
    
    console.log('🔗 URL Generator System - Standardizing all product links');
    
    const URLGenerator = {
        /**
         * Generate slug from product name (English)
         */
        generateSlug(productName, productId) {
            if (!productName) {
                return `product-${productId || 'unknown'}`;
            }
            
            return productName
                .toLowerCase()
                .replace(/[^a-z0-9\s&-]/g, '') // Keep alphanumeric, spaces, &, and hyphens
                .replace(/\s*&\s*/g, '-and-') // Convert & to -and-
                .replace(/\s+/g, '-') // Convert spaces to hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
                .substring(0, 60); // Limit length
        },
        
        /**
         * Generate standard product URL
         */
        generateProductURL(productId, category, englishName) {
            if (!productId) return './products-showcase.html';
            
            const slug = this.generateSlug(englishName, productId);
            const standardCategory = category === 'perfume' ? 'perfume' : 'watch';
            
            return `./product-details.html?id=${productId}&category=${standardCategory}&slug=${slug}`;
        },
        
        /**
         * Update all product links on page to follow standard format
         */
        updateAllProductLinks() {
            const productLinks = document.querySelectorAll('a[href*="product-details"]');
            let updatedCount = 0;
            
            productLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes('product-details')) {
                    try {
                        const url = new URL(href, window.location.origin);
                        const params = url.searchParams;
                        const id = params.get('id');
                        
                        if (id && !params.has('slug')) {
                            // Generate slug from link text or product data
                            const linkText = link.textContent.trim();
                            const newSlug = this.generateSlug(linkText, id);
                            const category = this.detectCategory(id, linkText);
                            
                            const newHref = this.generateProductURL(id, category, linkText);
                            link.setAttribute('href', newHref);
                            
                            updatedCount++;
                        }
                    } catch (e) {
                        console.warn('⚠️ Could not update link:', href, e.message);
                    }
                }
            });
            
            if (updatedCount > 0) {
                console.log(`✅ Updated ${updatedCount} product links to standard format`);
            }
        },
        
        /**
         * Detect category from product ID or name
         */
        detectCategory(productId, productName) {
            if (productId && productId.includes('watch')) return 'watch';
            if (productId && (productId.includes('perfume') || productId.includes('otor'))) return 'perfume';
            
            if (productName) {
                const name = productName.toLowerCase();
                if (name.includes('watch') || name.includes('rolex') || name.includes('omega')) return 'watch';
                if (name.includes('perfume') || name.includes('fragrance') || name.includes('chanel') || name.includes('dior')) return 'perfume';
            }
            
            return 'watch'; // Default
        },
        
        /**
         * Create example URLs for testing
         */
        createExampleURLs() {
            return {
                'watch_88': this.generateProductURL('watch_88', 'watch', 'Rolex Kaaba Design Premium Watch'),
                'watch_3': this.generateProductURL('watch_3', 'watch', 'Rolex Black Dial Professional R21'),
                'watch_1': this.generateProductURL('watch_1', 'watch', 'Rolex Yacht Master Silver'),
                'perfume_1': this.generateProductURL('perfume_1', 'perfume', 'Chanel Coco Premium Perfume 100ml')
            };
        },
        
        /**
         * Validate URL format
         */
        validateURL(url) {
            try {
                const urlObj = new URL(url, window.location.origin);
                const params = urlObj.searchParams;
                
                const hasId = params.has('id');
                const hasCategory = params.has('category');
                const hasSlug = params.has('slug');
                
                return {
                    valid: hasId,
                    complete: hasId && hasCategory && hasSlug,
                    missing: {
                        id: !hasId,
                        category: !hasCategory,
                        slug: !hasSlug
                    },
                    params: {
                        id: params.get('id'),
                        category: params.get('category'),
                        slug: params.get('slug')
                    }
                };
            } catch (e) {
                return { valid: false, error: e.message };
            }
        },
        
        /**
         * Initialize URL standardization
         */
        init() {
            console.log('🎨 Initializing URL standardization...');
            
            // Update existing links
            setTimeout(() => this.updateAllProductLinks(), 1000);
            
            // Show example URLs
            const examples = this.createExampleURLs();
            console.log('📋 Example standardized URLs:');
            Object.keys(examples).forEach(key => {
                console.log(`  ${key}: ${examples[key]}`);
            });
            
            console.log('✅ URL Generator ready - All links will follow standard format');
        }
    };
    
    // Export globally
    window.URLGenerator = URLGenerator;
    
    // Global function to create product URLs
    window.createProductURL = function(productId, category, productName) {
        return URLGenerator.generateProductURL(productId, category, productName);
    };
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => URLGenerator.init());
    } else {
        URLGenerator.init();
    }
    
    console.log('✅ URL Generator System loaded');
    
})();

/**
 * PRODUCT LINK GENERATOR FUNCTIONS
 * Use these to create consistent product links throughout the site
 */

// Generate product link with all parameters like the user's example
function generateStandardProductLink(productId, productData) {
    if (!productId) return './products-showcase.html';
    
    const category = (productId.includes('watch') || (productData && productData.sourceType === 'watch')) ? 'watch' : 'perfume';
    
    // Generate English name for slug
    let englishName = 'premium-product';
    if (productData && productData.displayName) {
        englishName = productData.displayName;
    } else if (productData && productData.title) {
        englishName = convertToEnglishForSlug(productData.title, productId);
    }
    
    const slug = URLGenerator.generateSlug(englishName, productId);
    
    return `./product-details.html?id=${productId}&category=${category}&slug=${slug}`;
}

// Convert Arabic title to English for slug generation
function convertToEnglishForSlug(arabicTitle, productId) {
    const specificTranslations = {
        'watch_88': 'rolex-kaaba-design',
        'watch_3': 'rolex-black-dial-professional-r21',
        'watch_1': 'rolex-yacht-master-silver',
        'watch_8': 'omega-swatch-baby-blue-edition'
    };
    
    if (specificTranslations[productId]) {
        return specificTranslations[productId];
    }
    
    if (!arabicTitle) return 'premium-product';
    
    const title = arabicTitle.toLowerCase();
    let parts = [];
    
    // Brand
    if (title.includes('rolex') || title.includes('رولكس')) {
        parts.push('rolex');
        if (title.includes('yacht') || title.includes('يخت')) parts.push('yacht-master');
        else if (title.includes('كعبة')) parts.push('kaaba-design');
        else if (title.includes('gmt')) parts.push('gmt');
    } else if (title.includes('omega') || title.includes('اوميغا')) {
        parts.push('omega');
        if (title.includes('swatch')) parts.push('swatch');
    } else if (title.includes('chanel') || title.includes('شانيل')) {
        parts.push('chanel');
        if (title.includes('coco')) parts.push('coco');
    }
    
    // Color
    if (title.includes('black') || title.includes('اسود')) parts.push('black');
    else if (title.includes('gold') || title.includes('ذهبي')) parts.push('gold');
    else if (title.includes('blue') || title.includes('ازرق') || title.includes('بلو')) parts.push('blue');
    
    return parts.join('-') || 'premium-product';
}

// Export for global use
window.generateStandardProductLink = generateStandardProductLink;
window.convertToEnglishForSlug = convertToEnglishForSlug;

console.log('✅ URL Generation Functions ready - All links will match your example format!');