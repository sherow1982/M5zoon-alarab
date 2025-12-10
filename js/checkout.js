/**
 * Logic for the checkout page.
 * Manages loading cart data, displaying the form and summary,
 * and handling order submission via WhatsApp.
 */

// 🚫 GLOBAL POPUP BLOCKER
console.log('🚫 ZERO POPUP CHECKOUT ENVIRONMENT');
window.alert = function() { console.log('🚫 Alert blocked'); };
window.confirm = function() { return true; };
window.prompt = function() { return null; };

let cartData = [];

/**
 * Loads cart data and initializes the checkout display.
 */
function loadCheckout() {
    try {
        cartData = JSON.parse(localStorage.getItem('emirates_cart') || '[]');
        console.log(`📦 Loading ${cartData.length} items for checkout`);
        displayCheckout();
    } catch (error) {
        console.error('❌ Checkout loading error:', error);
        displayEmptyCheckout();
    }
}

/**
 * Displays a message and links when the cart is empty.
 */
function displayEmptyCheckout() {
    document.getElementById('checkoutContent').innerHTML = `
        <div class="empty-cart-message">
            <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #D4AF37; margin-bottom: 20px; opacity: 0.6;"></i>
            <h2 style="color: #1B2951; margin-bottom: 15px;">لا توجد منتجات في السلة</h2>
            <p style="color: #666; margin-bottom: 30px;">يجب إضافة منتجات قبل إتمام الطلب</p>
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <a href="./" style="background: linear-gradient(135deg, #D4AF37, #B8860B); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-home"></i> الرئيسية
                </a>
                <a href="./products-showcase.html" style="background: transparent; color: #1B2951; border: 2px solid #D4AF37; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-shopping-bag"></i> ابدأ التسوق
                </a>
            </div>
        </div>
    `;
}

/**
 * Renders the checkout form and order summary.
 */
function displayCheckout() {
    if (cartData.length === 0) {
        displayEmptyCheckout();
        return;
    }

    let total = 0;
    let totalItems = 0;

    const orderItemsHTML = cartData.map(item => {
        const itemPrice = parseFloat(item.price || 0);
        const quantity = item.quantity || 1;
        const itemTotal = itemPrice * quantity;
        total += itemTotal;
        totalItems += quantity;

        return `
            <div class="order-item">
                <img src="${item.image || 'https://via.placeholder.com/60x60/D4AF37/FFFFFF?text=منتج'}" alt="${item.title}" class="item-image-small" onerror="this.src='https://via.placeholder.com/60x60/D4AF37/FFFFFF?text=منتج'">
                <div class="item-details-small">
                    <div class="item-name">${item.title}</div>
                    <div class="item-qty-price">الكمية: ${quantity} × ${itemPrice.toFixed(2)} د.إ</div>
                </div>
                <div class="item-total">${itemTotal.toFixed(2)} د.إ</div>
            </div>
        `;
    }).join('');

    document.getElementById('checkoutContent').innerHTML = `
        <div class="checkout-layout">
            <div class="customer-info">
                <h2 class="section-title"><i class="fas fa-user"></i> بيانات العميل</h2>
                <form id="checkoutForm" novalidate>
                    <div class="form-group"><label class="form-label">اسم العميل <span class="required">*</span></label><input type="text" id="customerName" class="form-input" placeholder="أدخل اسمك الكامل" required><div class="error-message" id="nameError"></div></div>
                    <div class="form-group"><label class="form-label">رقم الهاتف (الإمارات) <span class="required">*</span></label><input type="tel" id="customerPhone" class="form-input" placeholder="05XXXXXXXX" required><div class="form-help">مثال: 0501234567</div><div class="error-message" id="phoneError"></div></div>
                    <div class="form-group"><label class="form-label">عنوان التوصيل <span class="required">*</span></label><textarea id="customerAddress" class="form-input" rows="3" placeholder="أدخل عنوانك بالتفصيل (الإمارة، المنطقة، الشارع...)" required></textarea><div class="error-message" id="addressError"></div></div>
                    <div class="form-group"><label class="form-label">ملاحظات على الطلب</label><textarea id="orderNotes" class="form-input" rows="2" placeholder="أي ملاحظات أو طلبات خاصة..."></textarea></div>
                    <button type="submit" id="submitOrderBtn" class="whatsapp-order-btn"><i class="fab fa-whatsapp"></i> إرسال الطلب عبر واتساب</button>
                </form>
                <div class="security-info">
                    <div style="margin-bottom: 10px; font-weight: 600;"><i class="fas fa-shield-alt"></i> طلب آمن ومضمون</div>
                    <div style="font-size: 0.85rem; line-height: 1.5;"><i class="fas fa-truck"></i> شحن مجاني خلال 1-3 أيام عمل<br><i class="fas fa-undo"></i> إرجاع مجاني خلال 14 يوم + مصاريف شحن<br><i class="fas fa-headset"></i> دعم فني 24/7 عبر واتساب</div>
                </div>
            </div>
            <div class="order-summary">
                <h2 class="section-title"><i class="fas fa-receipt"></i> ملخص الطلب</h2>
                <div class="order-items">${orderItemsHTML}</div>
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
                    <div class="summary-row"><span>عدد المنتجات:</span><span>${totalItems} قطعة</span></div>
                    <div class="summary-row"><span>المجموع الجزئي:</span><span>${total.toFixed(2)} د.إ</span></div>
                    <div class="summary-row"><span>رسوم الشحن:</span><span style="color: #25D366; font-weight: bold;">مجاني ✓</span></div>
                    <div class="summary-row summary-total"><span>الإجمالي النهائي:</span><span>${total.toFixed(2)} د.إ</span></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('checkoutForm').addEventListener('submit', submitOrder);
}

/**
 * Validates a UAE phone number.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid.
 */
function validateUAEPhone(phone) {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    return /^05[0-9]{8}$/.test(cleanPhone);
}

/**
 * Validates the checkout form fields.
 * @returns {boolean} - True if the form is valid.
 */
function validateForm() {
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));

    const name = document.getElementById('customerName');
    const phone = document.getElementById('customerPhone');
    const address = document.getElementById('customerAddress');

    if (!name?.value.trim()) {
        document.getElementById('nameError').textContent = 'يرجى إدخال الاسم';
        name.classList.add('error');
        isValid = false;
    }
    if (!phone?.value.trim()) {
        document.getElementById('phoneError').textContent = 'يرجى إدخال رقم الهاتف';
        phone.classList.add('error');
        isValid = false;
    } else if (!validateUAEPhone(phone.value)) {
        document.getElementById('phoneError').textContent = 'يرجى إدخال رقم هاتف إماراتي صحيح';
        phone.classList.add('error');
        isValid = false;
    }
    if (!address?.value.trim()) {
        document.getElementById('addressError').textContent = 'يرجى إدخال عنوان التوصيل';
        address.classList.add('error');
        isValid = false;
    }
    return isValid;
}

/**
 * Handles the form submission, validates data, and opens WhatsApp.
 * @param {Event} event - The form submission event.
 */
function submitOrder(event) {
    event.preventDefault();
    if (!validateForm() || cartData.length === 0) return;

    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const orderNotes = document.getElementById('orderNotes').value.trim();

    let total = cartData.reduce((sum, item) => sum + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);

    const itemsText = cartData.map((item, i) => 
        `${i+1}. ${item.title}\n   الكمية: ${item.quantity || 1} | السعر: ${parseFloat(item.price || 0).toFixed(2)} د.إ\n   الإجمالي: ${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)} د.إ`
    ).join('\n\n');

    const whatsappMessage = `🎆 *طلب جديد من متجر هدايا الإمارات* 🎆\n\n🙋‍♂️ *بيانات العميل:*\n• الاسم: ${customerName}\n• الهاتف: ${customerPhone}\n• عنوان التوصيل: ${customerAddress}${orderNotes ? `\n\n📝 *ملاحظات:* ${orderNotes}` : ''}\n\n🛒 *تفاصيل الطلب:*\n${itemsText}\n\n💰 *الإجمالي النهائي: ${total.toFixed(2)} د.إ*\n\n🚚 *الشحن:* مجاني (1-3 أيام عمل)\n🔄 *الضمان:* 14 يوم + مصاريف شحن\n\n✅ *يرجى تأكيد استلام الطلب!*`;
    
    const whatsappURL = `https://wa.me/201110760081?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, '_blank');
    console.log('✅ Order submitted via WhatsApp');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('💳 Initializing checkout page...');
    loadCheckout();
    console.log('✅ Checkout page ready!');
});