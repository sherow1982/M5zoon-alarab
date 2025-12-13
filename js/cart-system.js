/**
 * نظام السلة المتقدم - مع دعم تطبيع البيانات
 * - إدارة كاملة للسلة
 * - تخزين آمن في localStorage
 * - دعم متعدد المفاتيح
 * - تطبيع البيانات من جميع الصيغ
 * Emirates Gifts v3.2
 */

class CartSystem {
    constructor() {
        // مفاتيح التخزين المحتملة (بالترتيب الأولوي)
        this.STORAGE_KEYS = [
            'emirates_cart_data',      // المفتاح الجديد
            'emirates_shopping_cart',  // بديل 1
            'emirates_cart',           // بديل 2
            'cart'                     // بديل 3
        ];
        
        this.TOTAL_KEYS = [
            'emirates_cart_total',     // المفتاح الجديد
            'totalPrice',              // بديل
            'emirates_cart_total_price', // بديل
            'total'                    // بديل
        ];
        
        // تحميل البيانات عند الإنشاء
        this.cart = this.loadCart();
        this.total = this.calculateTotal();
        
        console.log('🛒 نظام السلة بدء بنجاح');
        console.log('📦 عدد العناصر:', this.cart.length);
    }
    
    /**
     * تطبيع بيانات المنتج من جميع الصيغ
     */
    normalizeItem(item) {
        if (!item || typeof item !== 'object') return null;
        
        try {
            const title = (item.title || item.title_ar || item.product_title || item.name || 'منتج').toString().trim() || 'منتج';
            const cleanTitle = title.replace(/[<>&"']/g, '').substring(0, 150);
            
            return {
                id: item.id,
                title: cleanTitle,
                price: parseFloat(item.price || 0) || 0,
                sale_price: parseFloat(item.sale_price || item.price || 0) || 0,
                image_link: item.image_link || item.image || item.url || '',
                image: item.image || item.image_link || item.url || '',
                quantity: Math.max(1, parseInt(item.quantity || 1)),
                added_at: item.added_at || new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ خطأ تطبيع:', error, item);
            return null;
        }
    }
    
    /**
     * تحميل السلة من localStorage مع دعم المفاتيح المتعددة
     */
    loadCart() {
        try {
            // البحث عن المفاتيح الموجودة
            for (const key of this.STORAGE_KEYS) {
                const stored = localStorage.getItem(key);
                if (stored) {
                    try {
                        const data = JSON.parse(stored);
                        if (Array.isArray(data) && data.length > 0) {
                            console.log(`✅ تم تحميل السلة من: ${key}`);
                            // تطبيع جميع العناصر
                            const normalized = data
                                .map(item => this.normalizeItem(item))
                                .filter(item => item !== null);
                            
                            if (normalized.length > 0) {
                                console.log(`✅ تم تطبيع ${normalized.length} عنصر`);
                                return normalized;
                            }
                        }
                    } catch (e) {
                        console.warn(`⚠️ خطأ في قراءة ${key}:`, e);
                    }
                }
            }
            
            console.log('📦 السلة فارغة');
            return [];
        } catch (error) {
            console.error('❌ خطأ تحميل السلة:', error);
            return [];
        }
    }
    
    /**
     * حفظ السلة في localStorage
     */
    saveCart() {
        try {
            const data = JSON.stringify(this.cart);
            
            // حفظ في جميع المفاتيح للتوافقية
            for (const key of this.STORAGE_KEYS) {
                localStorage.setItem(key, data);
            }
            
            this.updateTotal();
            this.dispatchEvent('cartUpdated');
            
            console.log('✅ تم حفظ السلة');
        } catch (error) {
            console.error('❌ خطأ حفظ السلة:', error);
        }
    }
    
    /**
     * إضافة منتج للسلة
     */
    addProduct(product) {
        if (!product || !product.id) {
            console.error('❌ بيانات المنتج غير صحيحة');
            return false;
        }
        
        // تطبيع المنتج أولاً
        const normalized = this.normalizeItem(product);
        if (!normalized) return false;
        
        // التحقق إذا المنتج موجود
        const existingItem = this.cart.find(item => String(item.id) === String(normalized.id));
        
        if (existingItem) {
            existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
            console.log(`📦 تم زيادة كمية: ${normalized.title}`);
        } else {
            this.cart.push(normalized);
            console.log(`✅ تم إضافة: ${normalized.title}`);
        }
        
        this.saveCart();
        return true;
    }
    
    /**
     * تحديث كمية المنتج
     */
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => String(item.id) === String(productId));
        
        if (!item) {
            console.error(`❌ المنتج ${productId} غير موجود`);
            return false;
        }
        
        quantity = Math.max(1, parseInt(quantity) || 1);
        item.quantity = quantity;
        
        this.saveCart();
        return true;
    }
    
    /**
     * حذف منتج من السلة
     */
    removeProduct(productId) {
        const index = this.cart.findIndex(item => String(item.id) === String(productId));
        
        if (index === -1) {
            console.error(`❌ المنتج ${productId} غير موجود`);
            return false;
        }
        
        const removed = this.cart.splice(index, 1)[0];
        this.saveCart();
        console.log(`🗑️ تم حذف: ${removed.title}`);
        return true;
    }
    
    /**
     * إفراغ السلة
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
        console.log('🯙 تم إفراغ السلة');
    }
    
    /**
     * حساب الإجمالي
     */
    calculateTotal() {
        return this.cart.reduce((sum, item) => {
            if (!item) return sum;
            const price = parseFloat(item.sale_price || item.price || 0) || 0;
            const quantity = Math.max(1, parseInt(item.quantity || 1));
            return sum + (price * quantity);
        }, 0);
    }
    
    /**
     * تحديث وحفظ الإجمالي
     */
    updateTotal() {
        this.total = this.calculateTotal();
        
        // حفظ الإجمالي في المفاتيح المختلفة
        const totalStr = this.total.toFixed(2);
        for (const key of this.TOTAL_KEYS) {
            localStorage.setItem(key, totalStr);
        }
        
        return this.total;
    }
    
    /**
     * الحصول على بيانات السلة (مطبّعة)
     */
    getCart() {
        return this.cart
            .map(item => this.normalizeItem(item))
            .filter(item => item !== null);
    }
    
    /**
     * الحصول على عدد العناصر
     */
    getItemsCount() {
        return this.cart.length;
    }
    
    /**
     * الحصول على الإجمالي
     */
    getTotal() {
        return this.updateTotal();
    }
    
    /**
     * إرسال حدث
     */
    dispatchEvent(eventName) {
        const event = new CustomEvent(eventName, {
            detail: { cart: this.cart, total: this.total, count: this.cart.length }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * JSON للإرسال
     */
    toJSON() {
        return {
            items: this.getCart(),
            total: this.getTotal(),
            itemsCount: this.getItemsCount(),
            timestamp: new Date().toISOString()
        };
    }
}

// إنشاء instance
window.cartSystem = new CartSystem();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartSystem;
}