/**
 * نظام السلة المتقدم
 * - إدارة كاملة للسلة
 * - تخزين آمن في localStorage
 * - دعم متعدد المتصفحات
 * Emirates Gifts v3.0
 */

class CartSystem {
    constructor() {
        // إعدادات التخزين
        this.STORAGE_KEY = 'emirates_cart_data';
        this.TOTAL_KEY = 'emirates_cart_total';
        this.ITEMS_COUNT_KEY = 'emirates_cart_count';
        
        // تحميل البيانات عند الإنشاء
        this.cart = this.loadCart();
        this.total = this.calculateTotal();
        
        console.log('🛒 نظام السلة بدأ بنجاح');
    }
    
    /**
     * تحميل السلة من localStorage
     */
    loadCart() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
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
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cart));
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
        
        // تحقق إذا المنتج موجود
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // زيادة الكمية
            existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
            console.log(`📦 تم زيادة كمية: ${product.title}`);
        } else {
            // إضافة منتج جديد
            const cartItem = {
                id: product.id,
                title: product.title || 'منتج',
                price: parseFloat(product.price || 0),
                sale_price: parseFloat(product.sale_price || product.price || 0),
                image_link: product.image_link || product.image || '',
                quantity: 1,
                added_at: new Date().toISOString()
            };
            
            this.cart.push(cartItem);
            console.log(`✅ تم إضافة: ${product.title}`);
        }
        
        this.saveCart();
        return true;
    }
    
    /**
     * تحديث كمية المنتج
     */
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        
        if (!item) {
            console.error(`❌ المنتج ${productId} غير موجود`);
            return false;
        }
        
        quantity = Math.max(1, parseInt(quantity) || 1);
        item.quantity = quantity;
        
        this.saveCart();
        console.log(`📝 تحديث كمية: ${item.title} = ${quantity}`);
        return true;
    }
    
    /**
     * حذف منتج من السلة
     */
    removeProduct(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        
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
        console.log('🧽 تم إفراغ السلة');
    }
    
    /**
     * حساب الإجمالي
     */
    calculateTotal() {
        return this.cart.reduce((sum, item) => {
            const price = item.sale_price || item.price || 0;
            return sum + (price * (parseInt(item.quantity) || 1));
        }, 0);
    }
    
    /**
     * تحديث وحفظ الإجمالي
     */
    updateTotal() {
        this.total = this.calculateTotal();
        localStorage.setItem(this.TOTAL_KEY, this.total.toFixed(2));
        localStorage.setItem(this.ITEMS_COUNT_KEY, this.cart.length);
        return this.total;
    }
    
    /**
     * الحصول على بيانات السلة
     */
    getCart() {
        return [...this.cart]; // نسخة
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
     * إرسال حدث مخصص
     */
    dispatchEvent(eventName) {
        const event = new CustomEvent(eventName, {
            detail: {
                cart: this.cart,
                total: this.total,
                count: this.cart.length
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * الحصول على JSON للإرسال
     */
    toJSON() {
        return {
            items: this.cart,
            total: this.getTotal(),
            itemsCount: this.getItemsCount(),
            timestamp: new Date().toISOString()
        };
    }
}

// إنشاء instance عام
window.cartSystem = new CartSystem();

// تصدير للـ modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartSystem;
}