/**
 * Emirates Gifts - Style Manager
 * Manages all CSS styles across the website
 * Handles theme switching, dynamic loading, and responsive design
 */

class StyleManager {
    constructor() {
        this.cssFiles = {
            home: '/css/home-premium.css',
            productDetails: '/css/product-details.css',
            legal: '/css/legal-pages.css'
        };
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    /**
     * Initialize the style manager
     */
    init() {
        this.setTheme(this.currentTheme);
        this.listenToSystemPreferences();
        this.loadResponsiveStyles();
        window.addEventListener('resize', () => this.handleResponsiveChange());
    }

    /**
     * Load CSS file dynamically
     * @param {string} cssFile - Path to CSS file
     */
    loadCSS(cssFile) {
        if (!document.querySelector(`link[href="${cssFile}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssFile;
            link.type = 'text/css';
            document.head.appendChild(link);
        }
    }

    /**
     * Load multiple CSS files
     * @param {array} cssFiles - Array of CSS file paths
     */
    loadMultipleCSS(cssFiles) {
        cssFiles.forEach(file => this.loadCSS(file));
    }

    /**
     * Load home page styles
     */
    loadHomeStyles() {
        this.loadCSS(this.cssFiles.home);
        this.applyHomePageOptimizations();
    }

    /**
     * Load product details page styles
     */
    loadProductDetailsStyles() {
        this.loadCSS(this.cssFiles.productDetails);
        this.applyProductPageOptimizations();
    }

    /**
     * Load legal pages styles
     */
    loadLegalPageStyles() {
        this.loadCSS(this.cssFiles.legal);
        this.applyLegalPageOptimizations();
    }

    /**
     * Set theme (light/dark)
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        localStorage.setItem('theme', theme);
        this.emitThemeChangeEvent(theme);
    }

    /**
     * Toggle theme between light and dark
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Listen to system preferences
     */
    listenToSystemPreferences() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!localStorage.getItem('theme')) {
                this.setTheme('dark');
            }
        }

        // Listen for changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * Handle responsive design changes
     */
    handleResponsiveChange() {
        const width = window.innerWidth;
        document.documentElement.setAttribute('data-viewport', this.getViewport(width));
    }

    /**
     * Get viewport size
     * @param {number} width - Window width
     */
    getViewport(width) {
        if (width < 480) return 'mobile';
        if (width < 768) return 'tablet';
        if (width < 1024) return 'desktop';
        return 'widescreen';
    }

    /**
     * Load responsive styles
     */
    loadResponsiveStyles() {
        this.handleResponsiveChange();
    }

    /**
     * Apply home page optimizations
     */
    applyHomePageOptimizations() {
        // Lazy load product images
        this.setupLazyLoading();
        // Animate progress bar
        this.animateProgressBar();
        // Setup animations
        this.setupScrollAnimations();
    }

    /**
     * Apply product page optimizations
     */
    applyProductPageOptimizations() {
        // Image zoom effect
        this.setupImageZoom();
        // Reviews animations
        this.animateReviews();
    }

    /**
     * Apply legal page optimizations
     */
    applyLegalPageOptimizations() {
        // Table of contents
        this.generateTableOfContents();
        // Smooth scrolling
        this.setupSmoothScrolling();
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            images.forEach(img => imageObserver.observe(img));
        } else {
            images.forEach(img => img.src = img.dataset.src);
        }
    }

    /**
     * Animate progress bar
     */
    animateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            let progress = 10;
            const interval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 30;
                    progressBar.style.width = progress + '%';
                }
            }, 200);

            window.addEventListener('load', () => {
                clearInterval(interval);
                progressBar.style.width = '100%';
                setTimeout(() => {
                    progressBar.style.opacity = '0';
                }, 500);
            });
        }
    }

    /**
     * Setup scroll animations
     */
    setupScrollAnimations() {
        const elements = document.querySelectorAll('[data-animate]');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            elements.forEach(el => observer.observe(el));
        }
    }

    /**
     * Setup image zoom
     */
    setupImageZoom() {
        const images = document.querySelectorAll('.product-main-image');
        images.forEach(img => {
            img.addEventListener('mousemove', (e) => {
                const rect = img.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                img.style.transformOrigin = `${x}% ${y}%`;
            });
        });
    }

    /**
     * Animate reviews section
     */
    animateReviews() {
        const reviewCards = document.querySelectorAll('.review-card');
        reviewCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
        });
    }

    /**
     * Generate table of contents
     */
    generateTableOfContents() {
        const headings = document.querySelectorAll('h2, h3');
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>الفهرس</h3><ul>';

        headings.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`;
            heading.id = id;
            const level = heading.tagName.toLowerCase();
            toc.innerHTML += `<li><a href="#${id}" class="toc-${level}">${heading.textContent}</a></li>`;
        });

        toc.innerHTML += '</ul>';
        const content = document.querySelector('.legal-content');
        if (content) content.insertBefore(toc, content.firstChild);
    }

    /**
     * Setup smooth scrolling
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Emit theme change event
     * @param {string} theme - Theme name
     */
    emitThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', { detail: { theme } });
        window.dispatchEvent(event);
    }

    /**
     * Add custom CSS rule
     * @param {string} selector - CSS selector
     * @param {object} styles - CSS styles object
     */
    addRule(selector, styles) {
        const style = document.createElement('style');
        let css = `${selector} {`;
        for (const [key, value] of Object.entries(styles)) {
            css += `${key}: ${value};`;
        }
        css += '}';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    /**
     * Get computed style
     * @param {element} element - DOM element
     * @param {string} property - CSS property
     */
    getComputedStyle(element, property) {
        return window.getComputedStyle(element).getPropertyValue(property);
    }

    /**
     * Apply RTL styles
     */
    applyRTLStyles() {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    }

    /**
     * Get style information
     */
    getStyleInfo() {
        return {
            theme: this.currentTheme,
            viewport: this.getViewport(window.innerWidth),
            direction: document.documentElement.dir,
            language: document.documentElement.lang
        };
    }
}

// Initialize StyleManager on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.styleManager = new StyleManager();
    });
} else {
    window.styleManager = new StyleManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleManager;
}