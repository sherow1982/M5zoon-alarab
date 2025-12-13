/**
 * Emirates Gifts - SEO Optimizer
 * Advanced SEO optimization for Google ranking
 * Handles schema markup, meta tags, structured data
 */

class SEOOptimizer {
    constructor(config = {}) {
        this.config = config;
        this.init();
    }

    /**
     * Initialize SEO optimizer
     */
    init() {
        this.addMetaTags();
        this.addSchemaMarkup();
        this.addOpenGraphTags();
        this.addTwitterCardTags();
        this.optimizeHeadings();
        this.addSitemap();
        this.addRobotsTxt();
        this.setupAnalytics();
    }

    /**
     * Add meta tags
     */
    addMetaTags() {
        const metaTags = [
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
            { name: 'charset', content: 'UTF-8' },
            { name: 'description', content: this.getPageDescription() },
            { name: 'keywords', content: this.getPageKeywords() },
            { name: 'author', content: 'Emirates Gifts Store' },
            { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
            { name: 'language', content: 'Arabic' },
            { name: 'revisit-after', content: '7 days' },
            { httpEquiv: 'x-ua-compatible', content: 'IE=edge' },
            { name: 'theme-color', content: '#D4AF37' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'format-detection', content: 'telephone=no' }
        ];

        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            if (tag.name) meta.name = tag.name;
            if (tag.httpEquiv) meta.httpEquiv = tag.httpEquiv;
            meta.content = tag.content;
            document.head.appendChild(meta);
        });
    }

    /**
     * Add schema markup (JSON-LD)
     */
    addSchemaMarkup() {
        // Organization Schema
        this.addJSONLD({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'متجر هدايا الإمارات',
            'alternateName': 'Emirates Gifts Store',
            'url': this.getBaseURL(),
            'logo': `${this.getBaseURL()}/images/logo.png`,
            'description': 'متخصص في بيع الهدايا الفاخرة والممتازة',
            'foundingDate': '2024',
            'address': {
                '@type': 'PostalAddress',
                'addressCountry': 'AE',
                'addressLocality': 'Dubai',
                'streetAddress': 'Dubai, UAE'
            },
            'contactPoint': {
                '@type': 'ContactPoint',
                'contactType': 'Customer Service',
                'telephone': '+971-4-XXXXXXX'
            },
            'sameAs': [
                'https://facebook.com/emiratesgifts',
                'https://instagram.com/emiratesgifts',
                'https://tiktok.com/@emiratesgifts',
                'https://twitter.com/emiratesgifts'
            ]
        });

        // Local Business Schema
        this.addJSONLD({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            'name': 'متجر هدايا الإمارات',
            'image': `${this.getBaseURL()}/images/logo.png`,
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Dubai',
                'addressLocality': 'Dubai',
                'addressCountry': 'AE'
            },
            'telephone': '+971-4-XXXXXXX',
            'priceRange': '$$',
            'openingHoursSpecification': {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'opens': '09:00',
                'closes': '22:00'
            }
        });
    }

    /**
     * Add JSON-LD script
     * @param {object} data - Schema data
     */
    addJSONLD(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    /**
     * Add Open Graph tags (Facebook sharing)
     */
    addOpenGraphTags() {
        const ogTags = [
            { property: 'og:title', content: this.getPageTitle() },
            { property: 'og:description', content: this.getPageDescription() },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: this.getCurrentURL() },
            { property: 'og:image', content: `${this.getBaseURL()}/images/og-image.png` },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:locale', content: 'ar_AE' },
            { property: 'og:site_name', content: 'متجر هدايا الإمارات' }
        ];

        ogTags.forEach(tag => {
            const meta = document.createElement('meta');
            meta.setAttribute('property', tag.property);
            meta.content = tag.content;
            document.head.appendChild(meta);
        });
    }

    /**
     * Add Twitter Card tags
     */
    addTwitterCardTags() {
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@emiratesgifts' },
            { name: 'twitter:title', content: this.getPageTitle() },
            { name: 'twitter:description', content: this.getPageDescription() },
            { name: 'twitter:image', content: `${this.getBaseURL()}/images/og-image.png` },
            { name: 'twitter:creator', content: '@emiratesgifts' }
        ];

        twitterTags.forEach(tag => {
            const meta = document.createElement('meta');
            meta.name = tag.name;
            meta.content = tag.content;
            document.head.appendChild(meta);
        });
    }

    /**
     * Optimize headings (H1, H2, H3)
     */
    optimizeHeadings() {
        // Ensure only one H1 per page
        const h1s = document.querySelectorAll('h1');
        if (h1s.length > 1) {
            for (let i = 1; i < h1s.length; i++) {
                h1s[i].style.fontSize = h1s[i].style.fontSize;
                h1s[i].role = 'heading';
                h1s[i].ariaLevel = '2';
            }
        }

        // Add heading ids for anchor links
        document.querySelectorAll('h2, h3, h4').forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
        });
    }

    /**
     * Add sitemap
     */
    addSitemap() {
        const link = document.createElement('link');
        link.rel = 'sitemap';
        link.type = 'application/xml';
        link.href = `${this.getBaseURL()}/sitemap.xml`;
        document.head.appendChild(link);
    }

    /**
     * Add robots.txt reference
     */
    addRobotsTxt() {
        const link = document.createElement('link');
        link.rel = 'robots';
        link.href = `${this.getBaseURL()}/robots.txt`;
        document.head.appendChild(link);
    }

    /**
     * Setup Google Analytics
     */
    setupAnalytics() {
        if (this.config.googleAnalyticsId) {
            // Google Analytics 4
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', this.config.googleAnalyticsId, {
                'page_path': window.location.pathname,
                'page_title': document.title,
                'language': 'ar'
            });

            window.gtag = gtag;
        }
    }

    /**
     * Track event
     * @param {string} eventName - Event name
     * @param {object} params - Event parameters
     */
    trackEvent(eventName, params = {}) {
        if (window.gtag) {
            window.gtag('event', eventName, params);
        }
    }

    /**
     * Add product schema
     * @param {object} product - Product data
     */
    addProductSchema(product) {
        this.addJSONLD({
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': product.name,
            'description': product.description,
            'image': product.image,
            'brand': {
                '@type': 'Brand',
                'name': 'Emirates Gifts'
            },
            'offers': {
                '@type': 'Offer',
                'url': this.getCurrentURL(),
                'priceCurrency': 'AED',
                'price': product.price,
                'availability': 'https://schema.org/InStock',
                'seller': {
                    '@type': 'Organization',
                    'name': 'متجر هدايا الإمارات'
                }
            },
            'aggregateRating': product.rating ? {
                '@type': 'AggregateRating',
                'ratingValue': product.rating.value,
                'reviewCount': product.rating.count
            } : undefined
        });
    }

    /**
     * Add breadcrumb schema
     * @param {array} items - Breadcrumb items
     */
    addBreadcrumbSchema(items) {
        const breadcrumbList = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': items.map((item, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': item.name,
                'item': `${this.getBaseURL()}${item.url}`
            }))
        };
        this.addJSONLD(breadcrumbList);
    }

    /**
     * Get base URL
     */
    getBaseURL() {
        return window.location.origin;
    }

    /**
     * Get current URL
     */
    getCurrentURL() {
        return window.location.href;
    }

    /**
     * Get page title
     */
    getPageTitle() {
        return document.title || 'متجر هدايا الإمارات';
    }

    /**
     * Get page description
     */
    getPageDescription() {
        const meta = document.querySelector('meta[name="description"]');
        return meta ? meta.content : 'متجر متخصص في بيع الهدايا الفاخرة والممتازة';
    }

    /**
     * Get page keywords
     */
    getPageKeywords() {
        const meta = document.querySelector('meta[name="keywords"]');
        return meta ? meta.content : 'هدايا، الإمارات، دبي، هدايا فاخرة';
    }

    /**
     * Add canonical URL
     */
    addCanonical() {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = this.getCurrentURL().split('?')[0];
        document.head.appendChild(canonical);
    }

    /**
     * Set page language
     */
    setPageLanguage() {
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
    }

    /**
     * Setup for Arabic SEO
     */
    setupArabicSEO() {
        this.setPageLanguage();
        // Add Arabic content optimization
        document.querySelectorAll('[data-seo-text]').forEach(el => {
            el.textContent = el.dataset.seoText;
        });
    }

    /**
     * Get SEO status
     */
    getSEOStatus() {
        return {
            hasH1: !!document.querySelector('h1'),
            hasMetaDescription: !!document.querySelector('meta[name="description"]'),
            hasOpenGraph: !!document.querySelector('meta[property="og:title"]'),
            hasSchemaMarkup: !!document.querySelector('script[type="application/ld+json"]'),
            hasCanonical: !!document.querySelector('link[rel="canonical"]'),
            language: document.documentElement.lang,
            direction: document.documentElement.dir
        };
    }

    /**
     * Log SEO status (for debugging)
     */
    logSEOStatus() {
        console.log('🔍 SEO Status:', this.getSEOStatus());
    }
}

// Initialize SEO optimizer on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const config = window.seoConfig || {};
        window.seoOptimizer = new SEOOptimizer(config);
        window.seoOptimizer.setupArabicSEO();
    });
} else {
    const config = window.seoConfig || {};
    window.seoOptimizer = new SEOOptimizer(config);
    window.seoOptimizer.setupArabicSEO();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOOptimizer;
}