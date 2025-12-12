# 🚪 Header & Footer Integration Guide
## Unified Bilingual Component (AR + EN)

**Status:** ✅ Complete  
**Date:** December 12, 2025  
**Applies to:** All pages  

---

## 🌟 Overview

A unified, reusable header and footer component that supports:
- ✅ **Bilingual UI** (Arabic + English)
- ✅ **Automatic Language Switching** (RTL/LTR)
- ✅ **Responsive Design** (Mobile & Desktop)
- ✅ **Consistent Branding** (All pages)
- ✅ **Local Storage** (Language preference persistence)

---

## 📋 File Locations

| File | Location | Purpose |
|------|----------|----------|
| **header-footer.html** | `/public/header-footer.html` | Component source code |
| **products-grid.html** | `/public/products-grid.html` | Integrated example |
| **index-ar.html** | `/public/index-ar.html` | Arabic homepage |
| **index.html** | `/public/en/index.html` | English homepage |

---

## 🌟 Header Component Features

### **Visual Elements**
```html
🎁 Emirates Gifts
  └── Logo + Text (Bilingual)
  └── Navigation Menu
  └── Language Switcher (EN/العربية)
  └── Search Button
  └── Shopping Cart (with count)
  └── Mobile Menu Toggle
```

### **Navigation Links**
- **Home** / الرئيسية
- **Products** / المنتجات
- **About** / عننا
- **Contact** / اتصل بنا

### **Language Switching**
```javascript
switchLanguage('en')  // English
switchLanguage('ar')  // Arabic
```

---

## 🚪 Footer Component Features

### **Sections**
1. **Company Info**
   - About description
   - Social links (Facebook, Instagram, Twitter, TikTok)

2. **Quick Links**
   - Fragrances / العطور
   - Watches / الساعات
   - Care Products / منتجات العناية
   - On Sale / عروض خاصة

3. **Customer Service**
   - Contact Us / اتصل بنا
   - FAQ / أسئلة شائعة
   - Shipping Info / معلومات الشحن
   - Returns / الإرجاع

4. **Legal**
   - Privacy Policy / سياسة الخصوصية
   - Terms & Conditions / الشروط والأحكام
   - Cookie Policy / سياسة الكوكيز
   - Sitemap / خريطة الموقع

5. **Contact Info**
   - Phone / هاتف
   - Email / بريد
   - Address / عنوان
   - Hours / ساعات العمل

### **Bottom Section**
- Payment methods icons
- Copyright notice (bilingual)
- Back to top button

---

## 💻 HTML Integration

### **Copy Header**
```html
<!-- Header Component (Reusable) -->
<header id="main-header" class="main-header">
    <div class="header-container">
        <!-- Logo Section -->
        <div class="logo-section">
            <a href="/" class="logo">
                <span class="logo-icon">🎁</span>
                <span class="logo-text" id="logo-text">Emirates Gifts</span>
            </a>
        </div>
        
        <!-- Navigation Menu -->
        <nav class="nav-menu">
            <ul class="nav-list">
                <li><a href="/" id="nav-home" class="nav-link">Home</a></li>
                <li><a href="/products-grid.html" id="nav-products" class="nav-link">Products</a></li>
                <li><a href="#about" id="nav-about" class="nav-link">About</a></li>
                <li><a href="#contact" id="nav-contact" class="nav-link">Contact</a></li>
            </ul>
        </nav>
        
        <!-- Language & Auth Section -->
        <div class="header-actions">
            <div class="lang-switcher">
                <button class="lang-btn active" id="lang-btn-en" onclick="switchLanguage('en')">EN</button>
                <span class="lang-divider">|</span>
                <button class="lang-btn" id="lang-btn-ar" onclick="switchLanguage('ar')">العربية</button>
            </div>
            <button class="search-btn" id="search-btn">🔍</button>
            <button class="cart-btn" id="cart-btn">🛒 <span class="cart-count">0</span></button>
        </div>
    </div>
</header>
```

### **Copy Footer**
```html
<!-- Footer Component (Reusable) -->
<footer id="main-footer" class="main-footer">
    <!-- See header-footer.html for full footer code -->
</footer>
```

---

## 🌈 CSS Classes

### **Header Classes**
```css
.main-header              /* Main header wrapper */
.header-container        /* Inner container */
.logo-section            /* Logo area */
.logo                    /* Logo link */
.logo-icon              /* Logo emoji */
.logo-text              /* Logo text */
.nav-menu               /* Navigation menu */
.nav-list               /* Navigation list */
.nav-link               /* Navigation link */
.header-actions         /* Actions right side */
.lang-switcher          /* Language buttons */
.lang-btn               /* Individual language button */
.lang-btn.active        /* Active language button */
.search-btn             /* Search button */
.cart-btn               /* Shopping cart button */
.cart-count             /* Cart item count badge */
```

### **Footer Classes**
```css
.main-footer            /* Main footer wrapper */
.footer-container       /* Inner container */
.footer-grid            /* Grid layout */
.footer-section         /* Individual section */
.company-info           /* Company section */
.quick-links            /* Quick links section */
.customer-service       /* Service section */
.legal                  /* Legal section */
.contact-info           /* Contact section */
.social-links           /* Social links container */
.social-link            /* Individual social link */
.footer-bottom          /* Bottom section */
.payment-methods        /* Payment methods */
.footer-copyright       /* Copyright text */
.back-to-top            /* Back to top button */
```

---

## 💫 JavaScript Functions

### **Language Switching**
```javascript
function switchLanguage(lang) {
    // lang: 'en' or 'ar'
    // Sets RTL/LTR
    // Updates all text
    // Saves to localStorage
}
```

### **Content Updates**
```javascript
function updateContentArabic() {
    // Updates all text to Arabic
}

function updateContentEnglish() {
    // Updates all text to English
}
```

### **Scroll to Top**
```javascript
function scrollToTop() {
    // Smooth scroll to top
}
```

### **Mobile Menu**
```javascript
// Automatic mobile menu toggle
// Fires on .mobile-menu-toggle click
```

---

## 💻 Integration Steps

### **1. Copy HTML**
- Copy header from `header-footer.html` into your page
- Copy footer from `header-footer.html` into your page
- Add unique IDs for any page-specific text

### **2. Include Styles**
```html
<!-- In <head> or inline -->
<link rel="stylesheet" href="/header-footer.html" />
```

### **3. Include JavaScript**
```html
<!-- At end of <body> -->
<script src="/header-footer-script.js"></script>
```

### **4. Add Language Detection**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    switchLanguage(savedLanguage);
});
```

---

## 🖋️ Customization

### **Change Logo**
```html
<span class="logo-icon">YOUR-EMOJI</span>
<span class="logo-text">Your Store Name</span>
```

### **Update Navigation Links**
```html
<li><a href="/your-page" id="nav-custom">Your Link</a></li>
```

### **Modify Footer Sections**
Edit footer HTML directly in header-footer.html

### **Custom Colors**
Update `:root` CSS variables:
```css
--primary-color: #NEW-COLOR;
--dark-bg: #NEW-BG;
```

---

## 🌟 Language Support (AR + EN)

### **Automatic Language Switching**
- **EN**: LTR layout, English text
- **AR**: RTL layout, Arabic text

### **Stored in localStorage**
```javascript
localStorage.getItem('language')  // Returns 'en' or 'ar'
localStorage.setItem('language', 'ar')  // Set language
```

### **All Text Bilingual**
- Logo text
- Navigation menu
- Footer sections
- Button labels
- Social links titles

---

## 📱 Mobile Responsive

### **Desktop**
- Full navigation visible
- Horizontal layout
- All sections visible

### **Mobile (< 768px)**
- Mobile menu toggle appears
- Navigation collapses
- Single column layout
- Optimized touch targets

---

## ✅ Validation Checklist

- [ ] Header appears on all pages
- [ ] Footer appears on all pages
- [ ] Language switcher works (EN/AR)
- [ ] RTL layout works for Arabic
- [ ] LTR layout works for English
- [ ] Mobile menu functions
- [ ] Logo links to home
- [ ] Navigation links work
- [ ] Social links functional
- [ ] Responsive on mobile
- [ ] Language persists (localStorage)
- [ ] All text translated

---

## 🔌 SEO Considerations

- ✅ hreflang tags in page headers
- ✅ Proper lang attributes
- ✅ Semantic HTML structure
- ✅ Accessible navigation
- ✅ Mobile-friendly design

---

## 📋 Page Examples

**Integrated Pages:**
- `/products-grid.html` - Products page (complete example)
- `/index-ar.html` - Arabic homepage
- `/en/index.html` - English homepage

**To integrate into other pages:**
1. Copy header from products-grid.html
2. Copy footer from products-grid.html
3. Ensure language switch calls updateUI()
4. Customize page content

---

## 🌍 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 💪 Performance

- No external dependencies
- Pure HTML/CSS/JS
- Lightweight component
- Fast language switching
- localStorage for persistence

---

## 🛠️ Troubleshooting

**Language not changing?**
- Check switchLanguage() function exists
- Verify localStorage support
- Check console for errors

**Layout broken?**
- Verify CSS is included
- Check for conflicting styles
- Test on different browsers

**Mobile menu not working?**
- Check mobile-menu-toggle element
- Verify JavaScript loaded
- Check media query width

---

**Status:** ✅ Production Ready  
**Last Updated:** December 12, 2025  
**All Pages:** Header + Footer Integrated  
