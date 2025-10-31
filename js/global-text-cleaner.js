// نظام تنظيف شامل لإزالة كلمة "أصلي" - متجر هدايا الإمارات
// تطهير كامل للموقع من أي أثر لكلمة "أصلي" واستبدالها بـ "عالي الجودة"

class GlobalTextCleaner {
    constructor() {
        this.targetWords = ['أصلي', 'الأصلي', 'بالأصلي', 'والأصلي'];
        this.replacementWord = 'عالي الجودة';
        this.init();
    }

    init() {
        // تنظيف فوري عند تحميل الصفحة
        this.cleanCurrentPage();
        
        // مراقبة التغييرات في DOM للتنظيف التلقائي
        this.observeChanges();
        
        // تنظيف العناصر الديناميكية
        this.setupDynamicCleaning();
        
        console.log('🧽 تم تفعيل نظام التنظيف الشامل لإزالة كلمة "أصلي"');
    }

    // تنظيف الصفحة الحالية
    cleanCurrentPage() {
        // تنظيف عنوان الصفحة
        this.cleanTitle();
        
        // تنظيف Meta tags
        this.cleanMetaTags();
        
        // تنظيف جميع عناصر النص
        this.cleanTextElements();
        
        // تنظيف الروابط و URLs
        this.cleanLinks();
        
        // تنظيف البيانات المخزنة محلياً
        this.cleanLocalStorage();
    }

    cleanTitle() {
        this.targetWords.forEach(word => {
            if (document.title.includes(word)) {
                document.title = document.title.replace(new RegExp(word, 'g'), this.replacementWord);
                console.log(`✅ تم تنظيف عنوان الصفحة: ${word} → ${this.replacementWord}`);
            }
        });
    }

    cleanMetaTags() {
        const metaTags = document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="keywords"]');
        
        metaTags.forEach(meta => {
            this.targetWords.forEach(word => {
                if (meta.content && meta.content.includes(word)) {
                    meta.content = meta.content.replace(new RegExp(word, 'g'), this.replacementWord);
                    console.log(`✅ تم تنظيف meta tag: ${word} → ${this.replacementWord}`);
                }
            });
        });
    }

    cleanTextElements() {
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'div', 'a', 'button', 'li', 'td', 'th',
            '.product-title', '.product-name', '.product-description',
            '.breadcrumb', '.hero-title', '.hero-subtitle',
            '.section-title', '.section-subtitle',
            '.footer-text', '.banner-text',
            '[data-text]', '[data-title]', '[data-description]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.cleanElementText(element);
            });
        });
    }

    cleanElementText(element) {
        let hasChanges = false;
        
        this.targetWords.forEach(word => {
            // تنظيف textContent
            if (element.textContent && element.textContent.includes(word)) {
                const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'g');
                element.textContent = element.textContent.replace(regex, this.replacementWord);
                hasChanges = true;
            }
            
            // تنظيف innerHTML (مع الحذر من الـ XSS)
            if (element.innerHTML && element.innerHTML.includes(word) && !element.querySelector('script, iframe, object, embed')) {
                const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'g');
                element.innerHTML = element.innerHTML.replace(regex, this.replacementWord);
                hasChanges = true;
            }
            
            // تنظيف الخصائص
            ['title', 'alt', 'placeholder', 'aria-label'].forEach(attr => {
                if (element.getAttribute(attr) && element.getAttribute(attr).includes(word)) {
                    const newValue = element.getAttribute(attr).replace(new RegExp(word, 'g'), this.replacementWord);
                    element.setAttribute(attr, newValue);
                    hasChanges = true;
                }
            });
        });
        
        if (hasChanges) {
            console.log(`✅ تم تنظيف عنصر: ${element.tagName}.${element.className}`);
        }
    }

    cleanLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            this.targetWords.forEach(word => {
                if (link.href.includes(encodeURIComponent(word)) || link.href.includes(word)) {
                    // تنظيف URL من النسخة المشفرة
                    link.href = link.href.replace(new RegExp(encodeURIComponent(word), 'g'), encodeURIComponent(this.replacementWord));
                    // تنظيف URL من النسخة العادية
                    link.href = link.href.replace(new RegExp(word, 'g'), this.replacementWord.replace(/\s+/g, '-'));
                    
                    console.log(`✅ تم تنظيف رابط: ${word} في ${link.href}`);
                }
            });
        });
    }

    cleanLocalStorage() {
        // تنظيف بيانات التخزين المحلي
        const keysToCheck = ['emirates_shopping_cart', 'emirates-gifts-cart', 'product_data', 'user_preferences'];
        
        keysToCheck.forEach(key => {
            const stored = localStorage.getItem(key);
            if (stored) {
                try {
                    let data = JSON.parse(stored);
                    let hasChanges = false;
                    
                    const cleanedData = this.cleanObjectRecursively(data, hasChanges);
                    if (cleanedData.hasChanges) {
                        localStorage.setItem(key, JSON.stringify(cleanedData.data));
                        console.log(`✅ تم تنظيف localStorage: ${key}`);
                    }
                } catch (e) {
                    // تنظيف النصوص العادية
                    this.targetWords.forEach(word => {
                        if (stored.includes(word)) {
                            localStorage.setItem(key, stored.replace(new RegExp(word, 'g'), this.replacementWord));
                            console.log(`✅ تم تنظيف localStorage (text): ${key}`);
                        }
                    });
                }
            }
        });
    }

    cleanObjectRecursively(obj, hasChanges = false) {
        const result = { data: obj, hasChanges: false };
        
        if (typeof obj === 'string') {
            this.targetWords.forEach(word => {
                if (obj.includes(word)) {
                    result.data = obj.replace(new RegExp(word, 'g'), this.replacementWord);
                    result.hasChanges = true;
                }
            });
        } else if (Array.isArray(obj)) {
            result.data = obj.map(item => {
                const cleaned = this.cleanObjectRecursively(item);
                if (cleaned.hasChanges) result.hasChanges = true;
                return cleaned.data;
            });
        } else if (typeof obj === 'object' && obj !== null) {
            result.data = {};
            Object.keys(obj).forEach(key => {
                // تنظيف المفاتيح
                let cleanKey = key;
                this.targetWords.forEach(word => {
                    if (key.includes(word)) {
                        cleanKey = key.replace(new RegExp(word, 'g'), this.replacementWord);
                        result.hasChanges = true;
                    }
                });
                
                // تنظيف القيم
                const cleaned = this.cleanObjectRecursively(obj[key]);
                if (cleaned.hasChanges) result.hasChanges = true;
                result.data[cleanKey] = cleaned.data;
            });
        }
        
        return result;
    }

    // مراقبة التغييرات في DOM للتنظيف التلقائي
    observeChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // تنظيف العقد الجديدة
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        this.cleanElement(node);
                        // تنظيف العناصر الفرعية
                        node.querySelectorAll('*').forEach(child => {
                            this.cleanElement(child);
                        });
                    }
                });
                
                // تنظيف التغييرات في النص
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    if (mutation.target.nodeType === 1) {
                        this.cleanElement(mutation.target);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['title', 'alt', 'placeholder', 'aria-label']
        });
    }

    cleanElement(element) {
        if (!element || element.nodeType !== 1) return;
        
        // تجنب تنظيف عناصر البرمجة
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || element.tagName === 'NOSCRIPT') {
            return;
        }
        
        this.cleanElementText(element);
    }

    // إعداد تنظيف ديناميكي للمحتوى المتغير
    setupDynamicCleaning() {
        // تنظيف دوري كل 30 ثانية
        setInterval(() => {
            this.cleanNewContent();
        }, 30000);
        
        // تنظيف عند تغيير الصفحة
        window.addEventListener('popstate', () => {
            setTimeout(() => this.cleanCurrentPage(), 100);
        });
        
        // تنظيف عند تغيير hash
        window.addEventListener('hashchange', () => {
            setTimeout(() => this.cleanCurrentPage(), 100);
        });
    }

    cleanNewContent() {
        // فحص وتنظيف المحتوى الجديد الذي قد يتم إضافته ديناميكياً
        document.querySelectorAll('*').forEach(element => {
            this.targetWords.forEach(word => {
                if (element.textContent && element.textContent.includes(word)) {
                    this.cleanElementText(element);
                }
            });
        });
    }

    // تنظيف ملفات المنتجات بشكل خاص
    cleanProductPages() {
        // إذا كنا في صفحة منتج
        if (window.location.pathname.includes('/products/') || window.location.pathname.includes('product')) {
            // تنظيف خاص لصفحات المنتجات
            setTimeout(() => {
                this.cleanProductSpecificElements();
            }, 1000);
        }
    }

    cleanProductSpecificElements() {
        const productElements = [
            '.product-details', '.product-info', '.product-specs',
            '.product-features', '.product-benefits', '.product-warranty',
            '.breadcrumb-item', '.product-category', '.product-brand'
        ];
        
        productElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.cleanElementText(element);
            });
        });
    }

    // تنظيف الروابط في القوائم والنافيجيشن
    cleanNavigationLinks() {
        document.querySelectorAll('nav a, .menu a, .navbar a').forEach(link => {
            this.targetWords.forEach(word => {
                if (link.textContent.includes(word)) {
                    link.textContent = link.textContent.replace(new RegExp(word, 'g'), this.replacementWord);
                }
                if (link.href.includes(word)) {
                    link.href = link.href.replace(new RegExp(word, 'g'), this.replacementWord.replace(/\s+/g, '-'));
                }
            });
        });
    }

    // تنظيف عناصر الفورم
    cleanFormElements() {
        document.querySelectorAll('input, textarea, select, option').forEach(element => {
            ['value', 'placeholder', 'title'].forEach(attr => {
                const attrValue = element.getAttribute(attr);
                if (attrValue) {
                    this.targetWords.forEach(word => {
                        if (attrValue.includes(word)) {
                            element.setAttribute(attr, attrValue.replace(new RegExp(word, 'g'), this.replacementWord));
                        }
                    });
                }
            });
        });
    }

    // تنظيف عناصر الوسائط
    cleanMediaElements() {
        document.querySelectorAll('img, video, audio').forEach(element => {
            ['alt', 'title', 'src'].forEach(attr => {
                const attrValue = element.getAttribute(attr);
                if (attrValue) {
                    this.targetWords.forEach(word => {
                        if (attrValue.includes(word)) {
                            const newValue = attrValue.replace(new RegExp(word, 'g'), 
                                attr === 'src' ? this.replacementWord.replace(/\s+/g, '-') : this.replacementWord);
                            element.setAttribute(attr, newValue);
                        }
                    });
                }
            });
        });
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // وظيفة عامة للتنظيف اليدوي
    manualClean() {
        this.cleanCurrentPage();
        this.cleanProductPages();
        this.cleanNavigationLinks();
        this.cleanFormElements();
        this.cleanMediaElements();
        console.log('🧽 تم التنظيف اليدوي للصفحة بنجاح');
    }

    // تقرير عن عملية التنظيف
    generateCleaningReport() {
        const report = {
            totalElementsChecked: 0,
            elementsModified: 0,
            wordsReplaced: 0,
            linksFixed: 0,
            storageItemsCleaned: 0
        };
        
        // فحص جميع العناصر
        document.querySelectorAll('*').forEach(element => {
            report.totalElementsChecked++;
            
            this.targetWords.forEach(word => {
                if (element.textContent && element.textContent.includes(word)) {
                    const matches = (element.textContent.match(new RegExp(word, 'g')) || []).length;
                    report.wordsReplaced += matches;
                    report.elementsModified++;
                }
            });
        });
        
        // فحص الروابط
        document.querySelectorAll('a[href]').forEach(link => {
            this.targetWords.forEach(word => {
                if (link.href.includes(word)) {
                    report.linksFixed++;
                }
            });
        });
        
        console.table(report);
        return report;
    }
}

// بدء عملية التنظيف الشاملة
const globalCleaner = new GlobalTextCleaner();

// تصدير للاستخدام العام
window.GlobalTextCleaner = GlobalTextCleaner;
window.globalCleaner = globalCleaner;

// إضافة اختصار لوحة مفاتيح للتنظيف اليدوي
// Ctrl+Alt+C للتنظيف اليدوي
// Ctrl+Alt+R لعرض التقرير
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey) {
        if (e.key === 'c' || e.key === 'C') {
            e.preventDefault();
            globalCleaner.manualClean();
            alert('✅ تم التنظيف اليدوي بنجاح');
        } else if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            const report = globalCleaner.generateCleaningReport();
            alert(`تقرير التنظيف:\nعناصر مفحوصة: ${report.totalElementsChecked}\nعناصر معدّلة: ${report.elementsModified}\nكلمات مستبدلة: ${report.wordsReplaced}`);
        }
    }
});

// تنظيف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تأخير بسيط لضمان تحميل جميع العناصر
    setTimeout(() => {
        globalCleaner.cleanCurrentPage();
        globalCleaner.cleanProductPages();
    }, 500);
});

// تنظيف عند تحميل النوافذان مرة أخرى
window.addEventListener('load', () => {
    setTimeout(() => {
        globalCleaner.cleanCurrentPage();
        console.log('🎆 اكتمل التنظيف الشامل للموقع');
    }, 2000);
});