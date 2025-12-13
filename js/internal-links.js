/**
 * Internal Linking System - SEO Backlinking & Navigation
 * Features: Smart link recommendations, breadcrumbs, related products, internal linking strategy
 */
class InternalLinkSystem {
  constructor(config = {}) {
    this.config = {
      enableAutoLinks: config.enableAutoLinks !== false,
      maxLinksPerPage: config.maxLinksPerPage || 5,
      minLinkDensity: config.minLinkDensity || 0.5,
      maxLinkDensity: config.maxLinkDensity || 3,
      targetNewWindow: config.targetNewWindow === true,
      ...config
    };

    this.siteStructure = {
      home: { url: '/', title: 'الرئيسية', priority: 10 },
      categories: {},
      products: {},
      pages: {
        about: { url: '/about', title: 'من نحن', priority: 7 },
        privacy: { url: '/privacy-policy', title: 'سياسة الخصوصية', priority: 5 },
        terms: { url: '/terms', title: 'شروط الخدمة', priority: 5 },
        contact: { url: '/contact', title: 'اتصل بنا', priority: 8 },
        returns: { url: '/returns', title: 'سياسة الإرجاع', priority: 6 },
        shipping: { url: '/shipping', title: 'سياسة التوصيل', priority: 6 }
      }
    };

    this.linkGraph = {};
    this.init();
  }

  init() {
    this.buildSiteStructure();
    this.generateBreadcrumbs();
    this.generateRelatedLinks();
    this.optimizeInternalLinks();
    console.log('✅ Internal Link System initialized');
  }

  buildSiteStructure() {
    // Detect and map site structure from DOM
    const categoryLinks = document.querySelectorAll('[data-category]');
    const productItems = document.querySelectorAll('[data-product-id]');

    categoryLinks.forEach(cat => {
      const categoryId = cat.getAttribute('data-category');
      const categoryName = cat.textContent.trim();
      const categoryUrl = cat.getAttribute('href') || `/category/${categoryId}`;

      this.siteStructure.categories[categoryId] = {
        id: categoryId,
        name: categoryName,
        url: categoryUrl,
        priority: 8
      };
    });

    productItems.forEach(prod => {
      const productId = prod.getAttribute('data-product-id');
      const productName = prod.getAttribute('data-product-name') || 'منتج';
      const productUrl = prod.getAttribute('href') || `/product/${productId}`;

      this.siteStructure.products[productId] = {
        id: productId,
        name: productName,
        url: productUrl,
        priority: 5
      };
    });
  }

  generateBreadcrumbs(currentPath = window.location.pathname) {
    const breadcrumbContainer = document.querySelector('[data-breadcrumbs]');
    if (!breadcrumbContainer) return;

    const breadcrumbs = this.parsePath(currentPath);
    const breadcrumbHTML = this.renderBreadcrumbs(breadcrumbs);
    breadcrumbContainer.innerHTML = breadcrumbHTML;

    // Add schema markup for breadcrumbs
    this.addBreadcrumbSchema(breadcrumbs);
  }

  parsePath(path) {
    const breadcrumbs = [
      { name: 'الرئيسية', url: '/', schema: true }
    ];

    const parts = path.split('/').filter(p => p);

    if (parts[0] === 'category' && this.siteStructure.categories[parts[1]]) {
      const cat = this.siteStructure.categories[parts[1]];
      breadcrumbs.push({
        name: cat.name,
        url: cat.url,
        schema: true
      });
    } else if (parts[0] === 'product' && this.siteStructure.products[parts[1]]) {
      const prod = this.siteStructure.products[parts[1]];
      breadcrumbs.push({
        name: prod.name,
        url: prod.url,
        schema: true
      });
    } else if (parts[0] === 'page' || this.siteStructure.pages[parts[0]]) {
      const page = this.siteStructure.pages[parts[0]];
      if (page) {
        breadcrumbs.push({
          name: page.title,
          url: page.url,
          schema: true
        });
      }
    }

    return breadcrumbs;
  }

  renderBreadcrumbs(breadcrumbs) {
    return `
      <nav aria-label="breadcrumbs" class="breadcrumbs">
        ${breadcrumbs.map((crumb, index) => `
          <li class="breadcrumb-item" ${index === breadcrumbs.length - 1 ? 'aria-current="page"' : ''}>
            ${index === breadcrumbs.length - 1
              ? `<span>${crumb.name}</span>`
              : `<a href="${crumb.url}" class="breadcrumb-link">${crumb.name}</a>`
            }
          </li>
          ${index < breadcrumbs.length - 1 ? '<li class="breadcrumb-separator">/</li>' : ''}
        `).join('')}
      </nav>
    `;
  }

  addBreadcrumbSchema(breadcrumbs) {
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs
        .filter(b => b.schema)
        .map((b, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': b.name,
          'item': new URL(b.url, window.location.origin).toString()
        }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
  }

  generateRelatedLinks(contentText = '') {
    const relatedContainer = document.querySelector('[data-related-links]');
    if (!relatedContainer) return;

    const relatedLinks = this.findRelatedContent(contentText);
    const html = this.renderRelatedLinks(relatedLinks);
    relatedContainer.innerHTML = html;
  }

  findRelatedContent(contentText) {
    const keywords = this.extractKeywords(contentText || document.body.innerText);
    const relatedItems = [];

    // Find related products
    Object.values(this.siteStructure.products).forEach(product => {
      const relevance = keywords.filter(k => product.name.toLowerCase().includes(k.toLowerCase())).length;
      if (relevance > 0) {
        relatedItems.push({
          ...product,
          relevance,
          type: 'product'
        });
      }
    });

    // Sort by relevance and return top items
    return relatedItems
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, this.config.maxLinksPerPage);
  }

  extractKeywords(text) {
    // Simple keyword extraction (can be improved)
    const words = text
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 20);

    return [...new Set(words)];
  }

  renderRelatedLinks(items) {
    if (items.length === 0) return '';

    return `
      <div class="related-links">
        <h3>منتجات ذات صلة</h3>
        <ul class="related-links-list">
          ${items.map(item => `
            <li>
              <a href="${item.url}" class="related-link" title="${item.name}">
                ${item.name}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  optimizeInternalLinks() {
    if (!this.config.enableAutoLinks) return;

    const contentElements = document.querySelectorAll('[data-optimize-links]');

    contentElements.forEach(el => {
      this.linkifyContent(el);
    });
  }

  linkifyContent(element) {
    const text = element.innerText;
    const allItems = { ...this.siteStructure.categories, ...this.siteStructure.products };

    Object.values(allItems).forEach(item => {
      const regex = new RegExp(`\\b${item.name}\\b`, 'gi');
      if (regex.test(text)) {
        element.innerHTML = element.innerHTML.replace(
          regex,
          `<a href="${item.url}" class="internal-link" title="${item.name}">${item.name}</a>`
        );
      }
    });
  }

  getSitemap() {
    const urls = [
      { url: this.siteStructure.home.url, priority: this.siteStructure.home.priority }
    ];

    Object.values(this.siteStructure.categories).forEach(cat => {
      urls.push({ url: cat.url, priority: cat.priority });
    });

    Object.values(this.siteStructure.products).forEach(prod => {
      urls.push({ url: prod.url, priority: prod.priority });
    });

    Object.values(this.siteStructure.pages).forEach(page => {
      urls.push({ url: page.url, priority: page.priority });
    });

    return urls.sort((a, b) => b.priority - a.priority);
  }

  generateSitemapXML() {
    const urls = this.getSitemap();
    const baseUrl = window.location.origin;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(item => {
      const fullUrl = new URL(item.url, baseUrl).toString();
      const priority = (item.priority / 10).toFixed(1);

      xml += '  <url>\n';
      xml += `    <loc>${fullUrl}</loc>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
  }

  downloadSitemap() {
    const xml = this.generateSitemapXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getInternalLinkReport() {
    const report = {
      totalPages: Object.keys(this.siteStructure.pages).length,
      totalCategories: Object.keys(this.siteStructure.categories).length,
      totalProducts: Object.keys(this.siteStructure.products).length,
      totalInternalLinks: this.countInternalLinks(),
      averageLinksPerPage: this.getAverageLinksPerPage(),
      sitemapUrl: window.location.origin + '/sitemap.xml'
    };

    return report;
  }

  countInternalLinks() {
    return document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]').length;
  }

  getAverageLinksPerPage() {
    const totalLinks = this.countInternalLinks();
    const totalPages = 1 + Object.keys(this.siteStructure.pages).length;
    return (totalLinks / totalPages).toFixed(2);
  }
}

// Export globally
window.InternalLinkSystem = InternalLinkSystem;

console.log('✅ Internal Link System loaded');
