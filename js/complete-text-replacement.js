/**
 * نظام استبدال النصوص الشامل
 * يزيل آخر بقايا كلمة "الأصلي" من جميع أنحاء الموقع
 */

class CompleteTextReplacement {
    constructor() {
        this.replacementMap = new Map([
            // بدائل أساسية
            ['الأصلي', 'عالي الجودة'],
            ['أصلي', 'عالي الجودة'],
            ['الاصلي', 'عالي الجودة'],
            ['أصلية', 'عالية الجودة'],
            ['الأصلية', 'عالية الجودة'],
            
            // بدائل مع حروف الجر
            ['للأصلي', 'لعالي الجودة'],
            ['بالأصلي', 'بعالي الجودة'],
            ['في الأصلي', 'في عالي الجودة'],
            ['مع الأصلي', 'مع عالي الجودة'],
            ['عن الأصلي', 'عن عالي الجودة'],
            
            // تعبيرات مع كلمة أصلي
            ['عطر أصلي', 'عطر عالي الجودة'],
            ['عطور أصلية', 'عطور عالية الجودة'],
            ['ساعة أصلية', 'ساعة عالية الجودة'],
            ['ساعات أصلية', 'ساعات عالية الجودة'],
            ['هدية أصلية', 'هدية عالية الجودة'],
            
            // تعبيرات شائعة
            ['منتج أصلي', 'منتج عالي الجودة'],
            ['منتجات أصلية', 'منتجات عالية الجودة'],
            ['جودة أصلية', 'جودة عالية'],
            ['بجودة أصلية', 'بجودة عالية'],
            
            // في العناوين والأوصاف
            ['عطر الأصلي', 'عطر عالي الجودة'],
            ['بالعبوة الأصلية', 'بالعبوة عالية الجودة'],
            ['بالبوكس الأصلي', 'بالبوكس عالي الجودة'],
            ['البوكس الأصلي', 'البوكس عالي الجودة']
        ]);
        
        this.isProcessing = false;
        this.init();
    }

    init() {
        // تشغيل فوري لتنظيف المحتوى المرئي
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processAllContent());
        } else {
            this.processAllContent();
        }
        
        // تشغيل بعد تحميل المحتوى الديناميكي
        window.addEventListener('load', () => {
            setTimeout(() => this.processAllContent(), 2000);
        });
    }

    processAllContent() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        console.log('🧹 بدء تنظيف شامل للنصوص...');
        
        // معالجة جميع عناصر النص في الموقع
        this.processTextNodes(document.body);
        
        // معالجة العناوين والأوصاف
        this.processAttributes();
        
        // معالجة العناوين في الهيد
        this.processPageTitle();
        
        // معالجة المحتوى المحتمل تحميله لاحقاً
        this.setupDynamicContentWatcher();
        
        this.isProcessing = false;
        console.log('✅ انتهى تنظيف النصوص بنجاح');
    }

    processTextNodes(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        // جمع جميع عقد النصوص
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        
        // معالجة كل عقدة نص
        textNodes.forEach(textNode => {
            let originalText = textNode.textContent;
            let updatedText = originalText;
            
            // تطبيق جميع الاستبدالات
            this.replacementMap.forEach((replacement, original) => {
                const regex = new RegExp(original, 'gi');
                updatedText = updatedText.replace(regex, replacement);
            });
            
            // تحديث النص إذا تغير
            if (originalText !== updatedText) {
                textNode.textContent = updatedText;
                console.log(`✅ تم استبدال: "${originalText.substring(0, 50)}..." → "${updatedText.substring(0, 50)}..."`);
            }
        });
    }

    processAttributes() {
        const attributesToProcess = ['title', 'alt', 'aria-label', 'placeholder', 'data-original-title'];
        const elementsWithAttributes = document.querySelectorAll('*');
        
        elementsWithAttributes.forEach(element => {
            attributesToProcess.forEach(attr => {
                const value = element.getAttribute(attr);
                if (value) {
                    let updatedValue = value;
                    
                    this.replacementMap.forEach((replacement, original) => {
                        const regex = new RegExp(original, 'gi');
                        updatedValue = updatedValue.replace(regex, replacement);
                    });
                    
                    if (value !== updatedValue) {
                        element.setAttribute(attr, updatedValue);
                        console.log(`✅ تم استبدال ${attr}: "${value}" → "${updatedValue}"`);
                    }
                }
            });
        });
    }

    processPageTitle() {
        const title = document.title;
        let updatedTitle = title;
        
        this.replacementMap.forEach((replacement, original) => {
            const regex = new RegExp(original, 'gi');
            updatedTitle = updatedTitle.replace(regex, replacement);
        });
        
        if (title !== updatedTitle) {
            document.title = updatedTitle;
            console.log(`✅ تم تحديث عنوان الصفحة: "${title}" → "${updatedTitle}"`);
        }
        
        // تحديث meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const content = metaDescription.getAttribute('content');
            let updatedContent = content;
            
            this.replacementMap.forEach((replacement, original) => {
                const regex = new RegExp(original, 'gi');
                updatedContent = updatedContent.replace(regex, replacement);
            });
            
            if (content !== updatedContent) {
                metaDescription.setAttribute('content', updatedContent);
                console.log(`✅ تم تحديث وصف الصفحة`);
            }
        }
    }

    setupDynamicContentWatcher() {
        // مراقبة المحتوى الجديد
        const observer = new MutationObserver((mutations) => {
            let hasNewContent = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                            hasNewContent = true;
                        }
                    });
                }
            });
            
            if (hasNewContent && !this.isProcessing) {
                setTimeout(() => {
                    this.processAllContent();
                }, 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // معالجة محتوى JavaScript الديناميكي
    processJavaScriptContent() {
        // معالجة localStorage
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                
                if (value && typeof value === 'string') {
                    let updatedValue = value;
                    
                    this.replacementMap.forEach((replacement, original) => {
                        const regex = new RegExp(original, 'gi');
                        updatedValue = updatedValue.replace(regex, replacement);
                    });
                    
                    if (value !== updatedValue) {
                        localStorage.setItem(key, updatedValue);
                        console.log(`✅ تم تحديث localStorage: ${key}`);
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ لا يمكن الوصول إلى localStorage:', error);
        }
    }

    // معالجة المحتوى المحمل بواسطة AJAX
    interceptAjaxContent() {
        // مراقبة fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            
            // نسخ الاستجابة لمعالجتها
            const clonedResponse = response.clone();
            
            try {
                const text = await clonedResponse.text();
                if (this.containsTargetText(text)) {
                    console.log('⚠️ تم استقبال محتوى يحتوي على نصوص يجب استبدالها');
                    // معالجة المحتوى بعد تحميله
                    setTimeout(() => this.processAllContent(), 1000);
                }
            } catch (error) {
                // تجاهل الأخطاء في قراءة الاستجابة
            }
            
            return response;
        };
    }

    containsTargetText(text) {
        for (let [original] of this.replacementMap) {
            if (text.includes(original)) {
                return true;
            }
        }
        return false;
    }

    // معالجة محتوى خاص (مثل JSON في السكريبتات)
    processScriptContent() {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        
        scripts.forEach(script => {
            try {
                let content = script.textContent;
                let updatedContent = content;
                
                this.replacementMap.forEach((replacement, original) => {
                    const regex = new RegExp(original, 'gi');
                    updatedContent = updatedContent.replace(regex, replacement);
                });
                
                if (content !== updatedContent) {
                    script.textContent = updatedContent;
                    console.log(`✅ تم تحديث JSON-LD script`);
                }
            } catch (error) {
                console.warn('⚠️ خطأ في معالجة script:', error);
            }
        });
    }

    // معالجة الروابط والعناوين
    processLinks() {
        const links = document.querySelectorAll('a[href*="أصلي"], a[href*="الأصلي"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                let updatedHref = href;
                
                this.replacementMap.forEach((replacement, original) => {
                    // استبدال في الروابط مع ترميز URL
                    const encodedOriginal = encodeURIComponent(original);
                    const encodedReplacement = encodeURIComponent(replacement);
                    
                    updatedHref = updatedHref.replace(new RegExp(encodedOriginal, 'gi'), encodedReplacement);
                    updatedHref = updatedHref.replace(new RegExp(original, 'gi'), replacement.replace(/ /g, '-'));
                });
                
                if (href !== updatedHref) {
                    link.setAttribute('href', updatedHref);
                    console.log(`✅ تم تحديث الرابط: ${href} → ${updatedHref}`);
                }
            }
        });
    }

    // تنظيف عميق للعناصر المخفية
    deepCleanHiddenElements() {
        // عناصر مخفية بCSS
        const hiddenElements = document.querySelectorAll('[style*="display: none"], .hidden, [hidden]');
        
        hiddenElements.forEach(element => {
            this.processTextNodes(element);
        });
        
        // معالجة innerHTML للعناصر التي تحتوي على HTML
        const elementsWithHTML = document.querySelectorAll('[data-html], [data-content]');
        
        elementsWithHTML.forEach(element => {
            ['data-html', 'data-content'].forEach(attr => {
                const value = element.getAttribute(attr);
                if (value) {
                    let updatedValue = value;
                    
                    this.replacementMap.forEach((replacement, original) => {
                        const regex = new RegExp(original, 'gi');
                        updatedValue = updatedValue.replace(regex, replacement);
                    });
                    
                    if (value !== updatedValue) {
                        element.setAttribute(attr, updatedValue);
                    }
                }
            });
        });
    }

    // معالجة محتوى النماذج (templates)
    processTemplates() {
        const templates = document.querySelectorAll('template, script[type="text/template"], script[type="text/html"]');
        
        templates.forEach(template => {
            let content = template.innerHTML || template.textContent;
            let updatedContent = content;
            
            this.replacementMap.forEach((replacement, original) => {
                const regex = new RegExp(original, 'gi');
                updatedContent = updatedContent.replace(regex, replacement);
            });
            
            if (content !== updatedContent) {
                if (template.innerHTML) {
                    template.innerHTML = updatedContent;
                } else {
                    template.textContent = updatedContent;
                }
                console.log(`✅ تم تحديث template`);
            }
        });
    }

    // تشغيل شامل للنظام
    runCompleteCleanup() {
        console.log('🧹 بدء تنظيف شامل وعميق...');
        
        // تنظيف متعدد المراحل
        this.processAllContent();
        this.processJavaScriptContent();
        this.processLinks();
        this.processScriptContent();
        this.processTemplates();
        this.deepCleanHiddenElements();
        this.interceptAjaxContent();
        
        // تنظيف إضافي بعد 3 ثوان
        setTimeout(() => {
            this.processAllContent();
            console.log('🎉 انتهى التنظيف الشامل');
        }, 3000);
        
        // تنظيف دوري كل 30 ثانية
        setInterval(() => {
            if (!this.isProcessing) {
                this.processAllContent();
            }
        }, 30000);
    }

    // إحصائيات التنظيف
    getCleanupStats() {
        let foundInstances = 0;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent;
            this.replacementMap.forEach((replacement, original) => {
                const matches = text.match(new RegExp(original, 'gi'));
                if (matches) {
                    foundInstances += matches.length;
                }
            });
        }
        
        return {
            foundInstances,
            isComplete: foundInstances === 0
        };
    }

    // تقرير الحالة
    reportStatus() {
        const stats = this.getCleanupStats();
        
        if (stats.isComplete) {
            console.log('✅ تنظيف النصوص مكتمل بنجاح - لا توجد نصوص مطلوب استبدالها');
        } else {
            console.log(`⚠️ لا يزال هناك ${stats.foundInstances} نص يحتاج للاستبدال`);
        }
        
        return stats;
    }
}

// تشغيل النظام
const completeTextReplacement = new CompleteTextReplacement();

// تشغيل فوري وشامل
completeTextReplacement.runCompleteCleanup();

// تقرير الحالة بعد 5 ثوان
setTimeout(() => {
    const stats = completeTextReplacement.reportStatus();
    
    if (stats.isComplete) {
        // إشعار نجاح للمستخدم
        if (window.enhancedButtonFunctions) {
            window.enhancedButtonFunctions.showNotification('✅ تم تحديث جميع النصوص بنجاح', 'success');
        }
    }
}, 5000);

// تصدير للاستخدام العام
window.CompleteTextReplacement = CompleteTextReplacement;
window.completeTextReplacement = completeTextReplacement;