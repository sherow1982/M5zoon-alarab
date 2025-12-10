# Contributing to Emirates Gifts

🎁 شكراً لاهتمامك بـ Emirates Gifts! هذا الملف يشرح كيفية المساهمة.

## 🚠 Getting Started

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/sherow1982/emirates-gifts.git
cd emirates-gifts

# Install Python dependencies
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run local server
python -m http.server 8000
```

### Folder Structure

```
emirates-gifts/
├── index.html              # Arabic homepage
├── en/                     # English version
├── products-showcase.html  # Products listing
├── cart.html              # Shopping cart
├── checkout.html          # Checkout page
├── css/                   # Stylesheets
├── js/                    # JavaScript files
├── assets/                # Images & media
├── products/              # Product JSON data
│   ├── perfumes.json
│   └── watches.json
├── data/                  # Data files
├── generate_feed.py       # Google Feed generator (Python)
├── generate_sitemap.py    # Sitemap generator (Python)
├── sitemap.xml           # SEO Sitemap
├── merchant-feed.xml     # Google Shopping Feed
├── robots.txt            # SEO Robots
└── README.md            # Documentation
```

## ✏️ Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

#### Adding New Products

**File:** `products/perfumes.json` or `products/watches.json`

```json
{
  "id": "product-001",
  "name": "Product Name",
  "nameAr": "اسم المنتج",
  "category": "perfumes",
  "price": 199.99,
  "currency": "AED",
  "description": "Product description...",
  "descriptionAr": "وصف المنتج...",
  "image": "https://example.com/image.jpg",
  "availability": "in stock",
  "brand": "Brand Name",
  "gtin": "123456789012",
  "sku": "SKU-001"
}
```

#### Updating HTML Pages

- Keep HTML valid and semantic
- Use proper heading hierarchy (h1, h2, h3...)
- Include proper alt text for images
- Test responsive design

#### Adding JavaScript Features

- Keep code in `js/main.js` or create new module files
- Use ES6+ syntax
- Add comments for complex logic
- Test in browsers (Chrome, Firefox, Safari, Edge)

### 3. Update Feeds

After changing products:

```bash
# Generate new feeds
python generate_feed.py
python generate_sitemap.py

# Verify the output
cat merchant-feed.xml
cat sitemap.xml
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new products to perfumes collection"
```

**Commit Message Format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` CSS/styling changes
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Test additions

### 5. Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🧪 Testing

Before submitting:

```bash
# 1. Test locally
python -m http.server 8000
# Open http://localhost:8000

# 2. Test mobile responsiveness
# DevTools > Toggle device toolbar (Ctrl+Shift+M)

# 3. Test accessibility
# Wave Browser Extension
# https://wave.webaim.org/

# 4. Test Performance
# Google PageSpeed Insights
# https://pagespeed.web.dev/

# 5. Test SEO
# Google Search Console
# https://search.google.com/search-console

# 6. Validate HTML/CSS
# https://validator.w3.org/
```

## 📋 Code Guidelines

### HTML
- Use semantic HTML5 elements
- Always include alt text for images
- Use proper lang and dir attributes
- Keep indentation consistent (2 spaces)

### CSS
- Use CSS variables for colors
- Mobile-first approach
- BEM naming convention for classes
- Keep selectors specific but not too deep

### JavaScript
- Use const/let (avoid var)
- Arrow functions for callbacks
- Use meaningful variable names
- Add error handling
- Comment complex logic

### Python
```bash
# Format code
black *.py

# Check style
flake8 *.py
```

## 🌍 Multi-Language Support

When adding content:

1. **Arabic Version** (RTL)
   - File: `index.html`
   - Direction: `dir="rtl"`
   - Language: `lang="ar-AE"`

2. **English Version** (LTR)
   - File: `en/index.html`
   - Direction: `dir="ltr"`
   - Language: `lang="en"`

3. **Add hreflang Tags**
```html
<!-- In Arabic page -->
<link rel="alternate" hreflang="en" href=".../en/">

<!-- In English page -->
<link rel="alternate" hreflang="ar" href=".../">
```

## 📱 Responsive Design Breakpoints

```css
/* Mobile First */

/* Tablets & up */
@media (min-width: 768px) { ... }

/* Desktop & up */
@media (min-width: 1024px) { ... }

/* Large screens */
@media (min-width: 1280px) { ... }
```

## 🔄 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- GitHub Pages setup
- Custom domain configuration
- Google Merchant Center integration
- Google Search Console setup

## 🐛 Reporting Issues

Found a bug? Create an issue:

1. Go to Issues tab
2. Click "New Issue"
3. Provide:
   - Clear title
   - Description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if relevant

## 📝 Documentation

Update relevant docs when:
- Adding new features
- Changing deployment process
- Modifying project structure
- Updating dependencies

## 🔐 Security

Do NOT commit:
- API keys or secrets
- Private credentials
- Database passwords
- Email addresses (use contact form instead)

Use `.gitignore` for sensitive files.

## 📚 Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Google Merchant Center Help](https://support.google.com/merchants)
- [Google Search Console Help](https://support.google.com/webmasters)
- [Web.dev Performance](https://web.dev/performance/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 👥 Code of Conduct

- Be respectful to contributors
- Provide constructive feedback
- Help others learn
- Follow best practices
- Report issues professionally

## 🙏 Thank You!

Your contributions help make Emirates Gifts better for everyone!

---

**Questions?** Create an issue or contact the maintainers.

**Last Updated:** December 2024
