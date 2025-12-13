/**
 * Logic for the shopping cart page.
 * Manages loading, displaying, and updating cart items from localStorage.
 */

// 🚫 GLOBAL POPUP BLOCKER
console.log('🚫 ZERO POPUP CART ENVIRONMENT');
window.alert = function() { console.log('🚫 Alert blocked'); };
window.confirm = function() { return true; };
window.prompt = function() { return null; };

let cartData = [];

// مفاتيح localStorage المحتملة
const STORAGE_KEYS = {
    primary: 'emirates_shopping_cart',
    fallback1: 'emirates_cart',
    fallback2: 'cart',
    total: 'emirates_cart_total',
    totalFallback: 'totalPrice'
};

/**
 * Loads cart data from localStorage.
 */
function loadCart() {
    try {
        // جرب المفاتيح بالترتيب
        for (const key of [STORAGE_KEYS.primary, STORAGE_KEYS.fallback1, STORAGE_KEYS.fallback2]) {
            const data = localStorage.getItem(key);
            if (data) {
                cartData = JSON.parse(data);
                console.log(`📦 تم تحميل ${cartData.length} عنصر من ${key}`);
                displayCart();
                return;
            }
        }
        
        // إذا لم نجد بيانات
        cartData = [];
        console.log('📦 السلة فارغة (لم يتم العثور على بيانات)');
        displayCart();
    } catch (error) {
        console.error('❌ خطأ تحميل السلة:', error);
        cartData = [];
        displayCart();
    }
}

/**
 * Renders the cart content on the page.
 */
function displayCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (!cartData || cartData.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>سلة التسوق فارغة</h2>
                <p>لم تقم بإضافة أي منتجات بعد. اكتشف مجموعتنا المميزة!</p>
                <div class="cart-actions">
                    <a href="./" class="btn-primary">
                        <i class="fas fa-shopping-bag"></i> ابدأ التسوق
                    </a>
                    <a href="./products-showcase.html" class="btn-secondary">
                        <i class="fas fa-star"></i> شاهد جميع المنتجات
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let totalItems = 0;
    
    const itemsHTML = cartData.map(item => {
        const itemPrice = parseFloat(item.sale_price || item.price || 0);
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = itemPrice * quantity;
        total += itemTotal;
        totalItems += quantity;
        
        return `
            <div class="cart-item">
                <img src="${item.image_link || item.image || 'https://via.placeholder.com/80x80/D4AF37/FFFFFF?text=منتج'}" 
                     alt="${item.title}" 
                     class="item-image"
                     onerror="this.src='https://via.placeholder.com/80x80/D4AF37/FFFFFF?text=منتج'">
                <div class="item-details">
                    <div class="item-title">${item.title}</div>
                    <div class="item-price">${itemPrice.toFixed(2)} د.إ للقطعة</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-qty" data-item-id="${item.id}" data-quantity="${quantity}" aria-label="تقليل الكمية"><i class="fas fa-minus"></i></button>
                        <span class="quantity">${quantity}</span>
                        <button class="quantity-btn increase-qty" data-item-id="${item.id}" data-quantity="${quantity}" aria-label="زيادة الكمية"><i class="fas fa-plus"></i></button>
                        <button class="remove-btn" data-item-id="${item.id}" aria-label="إزالة المنتج"><i class="fas fa-trash"></i> حذف</button>
                    </div>
                </div>
                <div class="item-total-price">${itemTotal.toFixed(2)} د.إ</div>
            </div>
        `;
    }).join('');
    
    cartContent.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items-section">
                <h2 class="section-title">منتجاتك المختارة (${totalItems} قطعة)</h2>
                ${itemsHTML}
            </div>
            <div class="cart-summary">
                <h3 class="summary-title"><i class="fas fa-calculator"></i> ملخص الطلب</h3>
                <div class="summary-row"><span>عدد المنتجات:</span><span>${totalItems} قطعة</span></div>
                <div class="summary-row"><span>المجموع الجزئي:</span><span>${total.toFixed(2)} د.إ</span></div>
                <div class="summary-row"><span>رسوم الشحن:</span><span class="free-shipping">مجاني ✓</span></div>
                <div class="summary-row summary-total"><span>الإجمالي النهائي:</span><span>${total.toFixed(2)} د.إ</span></div>
                <div class="summary-actions">
                    <a href="./checkout.html" class="checkout-btn"><i class="fas fa-credit-card"></i> إتمام الطلب فوراً</a>
                    <a href="./products-showcase.html" class="continue-btn"><i class="fas fa-plus"></i> إضافة منتجات أخرى</a>
                    <button id="clearCartBtn" class="clear-btn"><i class="fas fa-trash-alt"></i> إفراغ السلة</button>
                </div>
                <div class="shipping-info">
                    <div><i class="fas fa-truck"></i> توصيل خلال 1-3 أيام عمل</div>
                    <div><i class="fas fa-undo"></i> ضمان إرجاع 14 يوم + مصاريف شحن</div>
                </div>
            </div>
        </div>
    `;
    
    // حفظ الإجمالي في localStorage
    localStorage.setItem(STORAGE_KEYS.total, total.toFixed(2));
    localStorage.setItem(STORAGE_KEYS.totalFallback, total.toFixed(2));

    setupEventListeners();
}

/**
 * Updates the quantity of an item in the cart.
 * @param {string} itemId - The ID of the item to update.
 * @param {number} newQuantity - The new quantity.
 */
function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeItem(itemId);
        return;
    }
    const item = cartData.find(item => String(item.id) === String(itemId));
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        displayCart();
        console.log(`📝 تحديث الكمية: ${item.title} = ${newQuantity}`);
    }
}

/**
 * Removes an item from the cart.
 * @param {string} itemId - The ID of the item to remove.
 */
function removeItem(itemId) {
    cartData = cartData.filter(item => String(item.id) !== String(itemId));
    saveCart();
    displayCart();
    console.log(`🗑️ تم حذف المنتج: ${itemId}`);
}

/** Clears all items from the cart. */
function clearCart() {
    cartData = [];
    saveCart();
    displayCart();
    console.log('🧻 تم إفراغ السلة');
}

/** Saves the current cart data to localStorage. */
function saveCart() {
    // احفظ في جميع المفاتيح المحتملة
    const data = JSON.stringify(cartData);
    localStorage.setItem(STORAGE_KEYS.primary, data);
    localStorage.setItem(STORAGE_KEYS.fallback1, data);
    localStorage.setItem(STORAGE_KEYS.fallback2, data);
    console.log('💾 تم حفظ السلة');
}

/**
 * Sets up event listeners for cart actions using event delegation.
 */
function setupEventListeners() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    cartContent.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const itemId = target.dataset.itemId;

        if (target.classList.contains('increase-qty')) {
            updateQuantity(itemId, parseInt(target.dataset.quantity) + 1);
        } else if (target.classList.contains('decrease-qty')) {
            updateQuantity(itemId, parseInt(target.dataset.quantity) - 1);
        } else if (target.classList.contains('remove-btn')) {
            removeItem(itemId);
        } else if (target.id === 'clearCartBtn') {
            clearCart();
        }
    });
}

// Initialize the cart page on DOM content loaded.
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 تهيئة صفحة السلة...');
    loadCart();
    console.log('✅ صفحة السلة جاهزة!');
});