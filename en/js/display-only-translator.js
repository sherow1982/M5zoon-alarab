/**
 * Display-Only English Translator
 * Translates DISPLAY text only - NEVER changes URLs or data structure
 * Preserves SEO indexing and original links
 * Version: v20251101-DISPLAY-ONLY
 */

(function() {
    'use strict';
    
    console.log('🎭 Display-Only English Translator - PRESERVES URLS & INDEXING');
    
    const DisplayTranslator = {
        
        // English display names - DISPLAY ONLY, URLs unchanged
        displayTranslations: {
            // Specific product matches for accurate translation
            'rolex بللون الأسود.  r21': 'Rolex Black Dial Professional R21',
            'rolex باللون الأسود r21': 'Rolex Black Dial Professional R21',
            'ساعة rolex باللون الأسود.  r21': 'Rolex Black Dial Professional R21',
            'rolex 40ملم r54': 'Rolex Oyster Professional 40mm R54',
            'rolex 40ملم  r54': 'Rolex Oyster Professional 40mm R54',
            'ساعة رولكس يخت ماستر - فضي': 'Rolex Yacht Master Silver',
            'ساعة اوميغا سواتش بيبي بلو': 'Omega Swatch Baby Blue Edition',
            'ساعة اوميغا سواتش زرقاء': 'Omega Swatch Blue Edition',
            'بوكس الساعة والايربودز 6 في 1': 'Premium Watch & AirPods 6-in-1 Set',
            'عطر كوكو شانيل 100 مل': 'Chanel Coco Premium Perfume 100ml',
            'عطر جوتشي فلورا': 'Gucci Flora Premium Perfume',
            'عطر سوفاج ديور': 'Dior Sauvage Premium Perfume'
        },
        
        /**
         * Translate text for DISPLAY only - NO URL changes
         */
        translateForDisplay(originalText) {
            if (!originalText) return 'Premium Product';
            
            // Check for exact matches first
            const lowerOriginal = originalText.toLowerCase().trim();
            for (const [arabic, english] of Object.entries(this.displayTranslations)) {
                if (lowerOriginal === arabic.toLowerCase() || lowerOriginal.includes(arabic.toLowerCase())) {
                    return english;
                }
            }
            
            // Build translation from components if no exact match
            let result = originalText;
            let brand = '';
            let model = '';
            let color = '';
            let size = '';
            let type = '';
            
            const text = originalText.toLowerCase();
            
            // Detect type first
            if (text.includes('عطر') || text.includes('perfume') || text.includes('fragrance')) {
                type = 'Perfume';
            } else if (text.includes('ساعة') || text.includes('watch')) {
                type = 'Watch';
            }
            
            // Brand detection
            if (text.includes('rolex') || text.includes('رولكس')) {
                brand = 'Rolex';
                if (text.includes('yacht') || text.includes('يخت')) model = 'Yacht Master';
                else if (text.includes('datejust') || text.includes('جاست')) model = 'Datejust';
                else if (text.includes('daytona') || text.includes('دايتونا')) model = 'Daytona';
                else if (text.includes('gmt')) model = 'GMT Master';
                else if (text.includes('submariner')) model = 'Submariner';
                else if (text.includes('oyster') || text.includes('اويستر')) model = 'Oyster';
                else if (text.includes('r21')) model = 'Professional R21';
                else if (text.includes('r54')) model = 'Professional R54';
                else model = 'Classic';
                
            } else if (text.includes('chanel') || text.includes('شانيل')) {
                brand = 'Chanel';
                if (text.includes('coco') || text.includes('كوكو')) model = 'Coco';
                else model = 'Premium';
                
            } else if (text.includes('gucci') || text.includes('جوتشي')) {
                brand = 'Gucci';
                if (text.includes('flora') || text.includes('فلورا')) model = 'Flora';
                else if (text.includes('bloom') || text.includes('بلوم')) model = 'Bloom';
                else model = 'Premium';
                
            } else if (text.includes('omega') || text.includes('اوميغا')) {
                brand = 'Omega';
                if (text.includes('swatch') || text.includes('سواتش')) model = 'Swatch';
                else model = 'Seamaster';
                
            } else if (text.includes('dior') || text.includes('ديور')) {
                brand = 'Dior';
                model = 'Sauvage';
            }
            
            // Color detection
            if (text.includes('black') || text.includes('اسود') || text.includes('أسود')) color = 'Black';
            else if (text.includes('white') || text.includes('ابيض') || text.includes('أبيض')) color = 'White';
            else if (text.includes('blue') || text.includes('ازرق') || text.includes('أزرق')) color = 'Blue';
            else if (text.includes('green') || text.includes('اخضر') || text.includes('أخضر')) color = 'Green';
            else if (text.includes('gold') || text.includes('جولد') || text.includes('ذهبي')) color = 'Gold';
            else if (text.includes('silver') || text.includes('فضي') || text.includes('سيلفر')) color = 'Silver';
            
            // Size detection
            if (text.includes('40mm') || text.includes('40ملم') || text.includes('40 ملم')) size = '40mm';
            else if (text.includes('41mm') || text.includes('41ملم') || text.includes('41 ملم')) size = '41mm';
            else if (text.includes('100ml') || text.includes('100مل') || text.includes('100 مل')) size = '100ml';
            
            // Build clean English display name
            if (brand) {
                const parts = [brand, model, color, size].filter(p => p);
                result = parts.join(' ');
                if (type) result += ' ' + type;
            }
            
            return result || 'Premium Product';
        },
        
        /**
         * Apply display translations to page elements
         */
        applyDisplayTranslations() {
            let translatedCount = 0;
            
            // Target elements that show product names
            const selectors = [
                '.product-title',
                '.product-title a',
                '.product-name',
                'h1.product-title-main',
                'h3.product-title',
                '.breadcrumb span:last-child'
            ];
            
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    const originalText = element.textContent;
                    if (originalText && /[\u0600-\u06ff]/.test(originalText)) {
                        const englishDisplay = this.translateForDisplay(originalText);
                        element.textContent = englishDisplay;
                        translatedCount++;
                        console.log(`🎭 Display translation: "${originalText}" → "${englishDisplay}"`);
                    }
                });
            });
            
            if (translatedCount > 0) {
                console.log(`✅ Applied ${translatedCount} display translations`);
            }
            
            return translatedCount;
        },
        
        /**
         * Start continuous display monitoring
         */
        startDisplayMonitoring() {
            // Initial translation
            this.applyDisplayTranslations();
            
            // Periodic checks
            setInterval(() => {
                const translated = this.applyDisplayTranslations();
                if (translated > 0) {
                    console.log(`🔄 Auto-translated ${translated} elements to English display`);
                }
            }, 2000);
            
            // Content change monitoring
            const observer = new MutationObserver((mutations) => {
                let hasNewContent = false;
                
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && node.textContent && /[\u0600-\u06ff]/.test(node.textContent)) {
                                hasNewContent = true;
                            }
                        });
                    }
                });
                
                if (hasNewContent) {
                    setTimeout(() => this.applyDisplayTranslations(), 100);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            console.log('✅ Display monitoring active - URLs preserved');
        }
    };
    
    // Export for global use
    window.DisplayTranslator = DisplayTranslator;
    
    // Auto-start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DisplayTranslator.startDisplayMonitoring());
    } else {
        DisplayTranslator.startDisplayMonitoring();
    }
    
    console.log('✅ Display-Only Translator loaded - URLs and indexing preserved');
    
})();