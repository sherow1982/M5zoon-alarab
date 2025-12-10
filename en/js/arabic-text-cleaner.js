/**
 * Arabic Text Cleaner for English Pages
 * Ensures NO Arabic text appears in English version
 * Version: v20251101-EMERGENCY
 */

(function() {
    'use strict';
    
    console.log('🧹 Arabic Text Cleaner ACTIVE - Removing ALL Arabic text');
    
    // COMPREHENSIVE English name mappings
    const cleanEnglishNames = {
        // ROLEX watches - specific mappings
        'rolex باللون الأسود r21': 'Rolex Black Dial Professional R21',
        'rolex 40ملم  r54': 'Rolex Oyster Professional 40mm R54',
        'ساعة rolex باللون الأسود.  r21': 'Rolex Black Dial Professional R21',
        'rolex باللون الأسود. r21': 'Rolex Black Dial Professional R21',
        'رولكس يخت ماستر': 'Rolex Yacht Master',
        'رولكس ديت جاست': 'Rolex Datejust',
        
        // OMEGA watches
        'اوميغا سواتش بيبي بلو': 'Omega Swatch Baby Blue',
        'اوميغا سواتش زرقاء': 'Omega Swatch Blue Edition',
        'اوميغا سواتش اسود': 'Omega Swatch Black Edition',
        'اوميغا سواتش أخضر': 'Omega Swatch Green Edition',
        
        // PERFUMES
        'عطر كوكو شانيل': 'Chanel Coco Premium Perfume',
        'عطر جوتشي فلورا': 'Gucci Flora Premium Perfume',
        'عطر سوفاج ديور': 'Dior Sauvage Premium Perfume',
        'عطر فرزاتشي ايروس': 'Versace Eros Premium Perfume'
    };
    
    function generateCleanEnglishName(arabicText) {
        if (!arabicText) return 'Premium Product';
        
        const text = arabicText.toLowerCase();
        
        // Check for exact matches first
        for (const [arabic, english] of Object.entries(cleanEnglishNames)) {
            if (text.includes(arabic.toLowerCase())) {
                return english;
            }
        }
        
        // Build name from components
        let brand = '';
        let model = '';
        let color = '';
        let size = '';
        let type = 'Product';
        
        // Brand detection
        if (text.includes('rolex') || text.includes('رولكس')) {
            brand = 'Rolex';
            if (text.includes('yacht') || text.includes('يخت')) model = 'Yacht Master';
            else if (text.includes('datejust') || text.includes('جاست')) model = 'Datejust';
            else if (text.includes('oyster') || text.includes('اويستر')) model = 'Oyster';
            else if (text.includes('r21')) model = 'Professional R21';
            else if (text.includes('r54')) model = 'Professional R54';
            else model = 'Classic';
            type = 'Watch';
        } else if (text.includes('omega') || text.includes('اوميغا')) {
            brand = 'Omega';
            if (text.includes('swatch')) model = 'Swatch';
            type = 'Watch';
        } else if (text.includes('chanel') || text.includes('شانيل')) {
            brand = 'Chanel';
            model = 'Premium';
            type = 'Perfume';
        } else if (text.includes('gucci') || text.includes('جوتشي')) {
            brand = 'Gucci';
            if (text.includes('flora')) model = 'Flora';
            else if (text.includes('bloom')) model = 'Bloom';
            type = 'Perfume';
        } else if (text.includes('dior') || text.includes('ديور')) {
            brand = 'Dior';
            model = 'Sauvage';
            type = 'Perfume';
        }
        
        // Color detection
        if (text.includes('black') || text.includes('اسود') || text.includes('أسود')) color = 'Black';
        else if (text.includes('silver') || text.includes('فضي')) color = 'Silver';
        else if (text.includes('gold') || text.includes('ذهبي')) color = 'Gold';
        else if (text.includes('blue') || text.includes('ازرق')) color = 'Blue';
        else if (text.includes('green') || text.includes('اخضر')) color = 'Green';
        
        // Size detection
        if (text.includes('40mm') || text.includes('40ملم')) size = '40mm';
        else if (text.includes('41mm') || text.includes('41ملم')) size = '41mm';
        else if (text.includes('100ml') || text.includes('100مل')) size = '100ml';
        
        // Build clean name
        const parts = [brand, model, color, size].filter(p => p);
        const cleanName = parts.length > 0 ? parts.join(' ') + (type ? ' ' + type : '') : 'Premium Luxury Product';
        
        return cleanName;
    }
    
    function aggressiveArabicCleaner() {
        let cleanedCount = 0;
        
        // Target ALL elements that might contain Arabic text
        const selectors = [
            '.product-title',
            '.product-title a', 
            '.product-name',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            '.product-card h3',
            '.breadcrumb span:last-child',
            '[class*="title"]',
            '[class*="name"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const text = element.textContent;
                if (text && /[\u0600-\u06ff]/.test(text)) {
                    const cleanName = generateCleanEnglishName(text);
                    element.textContent = cleanName;
                    cleanedCount++;
                    console.log(`🧹 Cleaned: "${text}" → "${cleanName}"`);
                }
            });
        });
        
        if (cleanedCount > 0) {
            console.log(`✅ Cleaned ${cleanedCount} Arabic texts to English`);
        }
        
        return cleanedCount;
    }
    
    function runContinuousCleanup() {
        // Run immediately
        aggressiveArabicCleaner();
        
        // Run at intervals
        setTimeout(() => aggressiveArabicCleaner(), 500);
        setTimeout(() => aggressiveArabicCleaner(), 1000);
        setTimeout(() => aggressiveArabicCleaner(), 2000);
        setTimeout(() => aggressiveArabicCleaner(), 3000);
        setTimeout(() => aggressiveArabicCleaner(), 5000);
        
        // Set up continuous monitoring
        setInterval(() => {
            const cleaned = aggressiveArabicCleaner();
            if (cleaned > 0) {
                console.log(`🚨 Emergency cleanup: Removed ${cleaned} Arabic texts`);
            }
        }, 3000);
    }
    
    // Set up mutation observer for new content
    function setupContentMonitor() {
        const observer = new MutationObserver((mutations) => {
            let hasNewText = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element
                            const hasArabic = node.textContent && /[\u0600-\u06ff]/.test(node.textContent);
                            if (hasArabic) hasNewText = true;
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    if (mutation.target.textContent && /[\u0600-\u06ff]/.test(mutation.target.textContent)) {
                        hasNewText = true;
                    }
                }
            });
            
            if (hasNewText) {
                setTimeout(aggressiveArabicCleaner, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        console.log('✅ Content monitor active - watching for Arabic text');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            runContinuousCleanup();
            setupContentMonitor();
        });
    } else {
        runContinuousCleanup();
        setupContentMonitor();
    }
    
    // Export for debugging
    window.ArabicCleaner = {
        clean: aggressiveArabicCleaner,
        translate: generateCleanEnglishName
    };
    
    console.log('✅ Arabic Text Cleaner loaded and monitoring');
    
})();