// Checkout JavaScript for English Version

// Global Variables
let orderData = {
    customer: {},
    address: {},
    items: [],
    totals: {}
};

let currentStep = 1;
const TAX_RATE = 0.05;
const FREE_SHIPPING_THRESHOLD = 50;

// Initialize Checkout Page
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckoutPage();
});

function initializeCheckoutPage() {
    loadOrderItems();
    calculateOrderTotals();
    initializeForm();
    initializeCheckoutButton();
    
    console.log('✅ Checkout page initialized');
}

// Load Order Items
function loadOrderItems() {
    const cartItems = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!orderItemsContainer) return;
    
    if (cartItems.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-order">
                <p>No items in cart</p>
                <a href="./products-showcase.html" class="btn-secondary">
                    <i class="fas fa-shopping-bag"></i>
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }
    
    orderData.items = cartItems;
    
    orderItemsContainer.innerHTML = cartItems.map(item => createOrderItemHTML(item)).join('');
}

// Create Order Item HTML
function createOrderItemHTML(item) {
    const totalPrice = (item.price * item.quantity).toFixed(2);
    
    return `
        <div class="order-item">
            <img src="${item.image}" alt="${item.title}" class="order-item-image">
            <div class="order-item-info">
                <div class="order-item-title">${item.title}</div>
                <div class="order-item-details">
                    <span>Qty: ${item.quantity}</span>
                    <span class="order-item-price">$${totalPrice}</span>
                </div>
            </div>
        </div>
    `;
}

// Calculate Order Totals
function calculateOrderTotals() {
    const cartItems = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    
    orderData.totals = { subtotal, shipping, tax, total };
    
    // Update display
    updateTotalsDisplay(subtotal, shipping, tax, total);
}

// Update Totals Display
function updateTotalsDisplay(subtotal, shipping, tax, total) {
    const elements = {
        subtotal: document.getElementById('subtotalAmount'),
        shipping: document.getElementById('shippingAmount'),
        tax: document.getElementById('taxAmount'),
        total: document.getElementById('totalAmount')
    };
    
    if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.shipping) {
        if (shipping === 0) {
            elements.shipping.textContent = 'Free';
            elements.shipping.className = 'free-shipping';
        } else {
            elements.shipping.textContent = `$${shipping.toFixed(2)}`;
        }
    }
    if (elements.tax) elements.tax.textContent = `$${tax.toFixed(2)}`;
    if (elements.total) elements.total.textContent = `$${total.toFixed(2)}`;
}

// Initialize Form
function initializeForm() {
    const form = document.querySelector('.checkout-form');
    if (!form) return;
    
    // Load saved form data
    loadSavedFormData();
    
    // Add form validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', saveFormData);
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    // Emirate change handler
    const emirateSelect = document.getElementById('emirate');
    if (emirateSelect) {
        emirateSelect.addEventListener('change', updateShippingInfo);
    }
}

// Form Validation
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    removeFieldError(field);
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show Field Error
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Remove Field Error
function removeFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Format Phone Number
function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    // Add UAE country code if not present
    if (value && !value.startsWith('971') && !value.startsWith('+971')) {
        if (value.startsWith('0')) {
            value = '971' + value.substring(1);
        } else {
            value = '971' + value;
        }
    }
    
    // Format as +971 XX XXX XXXX
    if (value.startsWith('971') && value.length > 3) {
        const formatted = value.replace(/^971/, '+971 ')
            .replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
        event.target.value = formatted;
    }
}

// Save Form Data
function saveFormData() {
    const formData = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        emirate: document.getElementById('emirate')?.value || '',
        city: document.getElementById('city')?.value || '',
        address: document.getElementById('address')?.value || '',
        postalCode: document.getElementById('postalCode')?.value || '',
        orderNotes: document.getElementById('orderNotes')?.value || ''
    };
    
    localStorage.setItem('emirates-checkout-form-en', JSON.stringify(formData));
}

// Load Saved Form Data
function loadSavedFormData() {
    const savedData = JSON.parse(localStorage.getItem('emirates-checkout-form-en') || '{}');
    
    Object.keys(savedData).forEach(key => {
        const element = document.getElementById(key);
        if (element && savedData[key]) {
            element.value = savedData[key];
        }
    });
}

// Update Shipping Info
function updateShippingInfo() {
    const emirate = document.getElementById('emirate')?.value;
    // You can add different shipping costs based on emirate if needed
    calculateOrderTotals();
}

// Initialize Checkout Button
function initializeCheckoutButton() {
    const completeOrderBtn = document.getElementById('completeOrder');
    
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', function() {
            completeOrder();
        });
    }
}

// Complete Order
function completeOrder() {
    // Validate form
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly', 'error');
        scrollToFirstError();
        return;
    }
    
    // Collect form data
    collectFormData();
    
    // Generate WhatsApp message
    const whatsappMessage = generateWhatsAppMessage();
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    setTimeout(() => {
        showOrderSuccess();
    }, 1000);
    
    // Clear cart after successful order
    setTimeout(() => {
        clearCart();
    }, 2000);
}

// Validate Form
function validateForm() {
    const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 
        'emirate', 'city', 'address'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field) {
            // Validate specific field types
            const fieldEvent = { target: field };
            if (!validateField(fieldEvent)) {
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Scroll to First Error
function scrollToFirstError() {
    const errorField = document.querySelector('.error');
    if (errorField) {
        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorField.focus();
    }
}

// Collect Form Data
function collectFormData() {
    orderData.customer = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || ''
    };
    
    orderData.address = {
        emirate: document.getElementById('emirate')?.value || '',
        city: document.getElementById('city')?.value || '',
        address: document.getElementById('address')?.value || '',
        postalCode: document.getElementById('postalCode')?.value || ''
    };
    
    orderData.notes = document.getElementById('orderNotes')?.value || '';
}

// Generate WhatsApp Message
function generateWhatsAppMessage() {
    const customer = orderData.customer;
    const address = orderData.address;
    const items = orderData.items;
    const totals = orderData.totals;
    
    let message = `🛍sOrder Request - Emirates Gifts Store\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Customer Information
    message += `👤 **Customer Information:**\n`;
    message += `Name: ${customer.firstName} ${customer.lastName}\n`;
    message += `Email: ${customer.email}\n`;
    message += `Phone: ${customer.phone}\n\n`;
    
    // Delivery Address
    message += `📦 **Delivery Address:**\n`;
    message += `Emirate: ${address.emirate}\n`;
    message += `City: ${address.city}\n`;
    message += `Address: ${address.address}\n`;
    if (address.postalCode) {
        message += `Postal Code: ${address.postalCode}\n`;
    }
    message += `\n`;
    
    // Order Items
    message += `📱 **Order Items:**\n`;
    items.forEach((item, index) => {
        message += `${index + 1}. ${item.title}\n`;
        message += `   Price: $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n`;
    
    // Order Summary
    message += `📊 **Order Summary:**\n`;
    message += `Subtotal: $${totals.subtotal.toFixed(2)}\n`;
    message += `Shipping: ${totals.shipping === 0 ? 'Free' : '$' + totals.shipping.toFixed(2)}\n`;
    message += `Tax (5% VAT): $${totals.tax.toFixed(2)}\n`;
    message += `**Total: $${totals.total.toFixed(2)}**\n\n`;
    
    // Special Instructions
    if (orderData.notes) {
        message += `📝 **Special Instructions:**\n${orderData.notes}\n\n`;
    }
    
    // Footer
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Please confirm this order and provide delivery timeline.\n`;
    message += `Thank you for choosing Emirates Gifts Store! 🎆`;
    
    return message;
}

// Show Order Success
function showOrderSuccess() {
    const checkoutSection = document.querySelector('.checkout-section');
    if (!checkoutSection) return;
    
    checkoutSection.innerHTML = `
        <div class="checkout-container">
            <div class="order-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="success-title">Order Submitted Successfully!</h2>
                <p class="success-message">
                    Thank you for your order! We've sent your order details via WhatsApp. 
                    Our team will contact you shortly to confirm your order and provide delivery information.
                </p>
                <div class="success-actions">
                    <a href="./products-showcase.html" class="btn-primary">
                        <i class="fas fa-shopping-bag"></i>
                        Continue Shopping
                    </a>
                    <a href="./" class="btn-secondary">
                        <i class="fas fa-home"></i>
                        Back to Home
                    </a>
                </div>
                <div class="success-info">
                    <div class="info-item">
                        <i class="fab fa-whatsapp"></i>
                        <span>Order sent via WhatsApp</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>Response within 5 minutes</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-truck"></i>
                        <span>Delivery in 1-3 business days</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update checkout steps
    updateCheckoutSteps(3);
}

// Update Checkout Steps
function updateCheckoutSteps(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

// Clear Cart
function clearCart() {
    localStorage.removeItem('emirates-cart-en');
    localStorage.removeItem('emirates-checkout-form-en');
    
    // Update cart counter
    const cartCounters = document.querySelectorAll('.cart-counter');
    cartCounters.forEach(counter => {
        counter.textContent = '0';
        counter.style.display = 'none';
    });
}

// Load Saved Form Data
function loadSavedFormData() {
    const savedData = JSON.parse(localStorage.getItem('emirates-checkout-form-en') || '{}');
    
    Object.keys(savedData).forEach(key => {
        const element = document.getElementById(key);
        if (element && savedData[key]) {
            element.value = savedData[key];
        }
    });
}

// Save Form Data
function saveFormData() {
    const formData = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        emirate: document.getElementById('emirate')?.value || '',
        city: document.getElementById('city')?.value || '',
        address: document.getElementById('address')?.value || '',
        postalCode: document.getElementById('postalCode')?.value || '',
        orderNotes: document.getElementById('orderNotes')?.value || ''
    };
    
    localStorage.setItem('emirates-checkout-form-en', JSON.stringify(formData));
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Form validation CSS additions
const additionalStyles = `
<style>
.field-error {
    color: var(--danger);
    font-size: 12px;
    margin-top: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-weight: var(--font-weight-medium);
}

.field-error::before {
    content: '⚠️';
    font-size: 14px;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: var(--danger);
    background: rgba(220, 53, 69, 0.05);
}

.success-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.success-info {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    color: var(--success);
    font-weight: var(--font-weight-medium);
}

.info-item i {
    font-size: 16px;
}

.empty-order {
    text-align: center;
    padding: 2rem;
    color: rgba(44, 44, 44, 0.6);
}

.empty-order p {
    margin-bottom: 1rem;
    font-size: 16px;
}

@media (max-width: 768px) {
    .success-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .success-actions .btn-primary,
    .success-actions .btn-secondary {
        width: 100%;
        max-width: 280px;
    }
    
    .success-info {
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }
}
</style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Export functions for global access
window.CheckoutPage = {
    completeOrder,
    validateForm,
    clearCart
};

// Make functions globally accessible
window.completeOrder = completeOrder;
window.validateForm = validateForm;
window.clearCart = clearCart;