/**
 * Emirates Gifts - Products API
 * Loads all products from data/products.json
 * Supports filtering, searching, and pagination
 */

class ProductsAPI {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main';
    this.dataUrl = `${this.baseUrl}/data/products.json`;
    this.products = [];
    this.cache = null;
    this.cacheExpiry = 60 * 60 * 1000; // 1 hour
  }

  // Get all products
  async getAllProducts() {
    return this.loadProducts();
  }

  // Load products from JSON
  async loadProducts() {
    try {
      // Check cache first
      if (this.cache && this.isCacheValid()) {
        return this.cache;
      }

      const response = await fetch(this.dataUrl);
      if (!response.ok) throw new Error(`Failed to load products: ${response.status}`);
      
      const data = await response.json();
      this.products = Array.isArray(data) ? data : data.products || [];
      
      // Cache the products
      this.cache = this.products;
      this.cacheTime = Date.now();
      
      console.log(`✅ Loaded ${this.products.length} products`);
      return this.products;
    } catch (error) {
      console.error('❌ Error loading products:', error);
      return [];
    }
  }

  // Check if cache is still valid
  isCacheValid() {
    return this.cacheTime && (Date.now() - this.cacheTime) < this.cacheExpiry;
  }

  // Search products by name or ID
  searchProducts(query) {
    if (!query) return this.products;
    const q = query.toLowerCase();
    return this.products.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.slug && p.slug.toLowerCase().includes(q))
    );
  }

  // Get product by ID or slug
  getProductById(id) {
    return this.products.find(p => p.id === id || p.slug === id);
  }

  // Get products by category
  getByCategory(category) {
    if (!category) return this.products;
    return this.products.filter(p => 
      p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get products with pagination
  getPaginated(page = 1, limit = 20) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      page,
      limit,
      total: this.products.length,
      totalPages: Math.ceil(this.products.length / limit),
      products: this.products.slice(start, end)
    };
  }

  // Get featured products
  getFeatured(limit = 6) {
    return this.products
      .filter(p => p.featured === true)
      .slice(0, limit);
  }

  // Get trending products
  getTrending(limit = 10) {
    return this.products
      .filter(p => p.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  // Get new products
  getNew(limit = 10) {
    return this.products
      .filter(p => p.new === true)
      .slice(0, limit);
  }

  // Get products on sale
  getOnSale(limit = 15) {
    return this.products
      .filter(p => p.discount && p.discount > 0)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, limit);
  }

  // Get product count by category
  getCategoryStats() {
    const stats = {};
    this.products.forEach(p => {
      const cat = p.category || 'Other';
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return stats;
  }

  // Get price range
  getPriceRange() {
    if (this.products.length === 0) return { min: 0, max: 0 };
    const prices = this.products.map(p => parseFloat(p.price) || 0).filter(p => p > 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  // Filter products by price
  filterByPrice(minPrice, maxPrice) {
    return this.products.filter(p => {
      const price = parseFloat(p.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });
  }

  // Get random products
  getRandom(limit = 5) {
    const shuffled = [...this.products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  // Export products as CSV
  exportAsCSV() {
    if (this.products.length === 0) return '';
    
    const headers = Object.keys(this.products[0]);
    const csv = [
      headers.join(','),
      ...this.products.map(p => 
        headers.map(h => {
          const value = p[h];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    return csv;
  }

  // Get product statistics
  getStats() {
    return {
      total: this.products.length,
      categories: this.getCategoryStats(),
      priceRange: this.getPriceRange(),
      avgRating: (this.products.reduce((sum, p) => sum + (p.rating || 0), 0) / this.products.length).toFixed(2),
      onSaleCount: this.products.filter(p => p.discount && p.discount > 0).length
    };
  }
}

// Create global instance
const productsAPI = new ProductsAPI();

// Auto-load products when script loads
if (typeof window !== 'undefined') {
  productsAPI.loadProducts().catch(err => console.error('Failed to load products:', err));
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductsAPI;
}
