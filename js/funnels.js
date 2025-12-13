/**
 * Sales Funnels System - Conversion Tracking & Analysis
 * Tracks: Views -> Clicks -> Add to Cart -> Checkout -> Purchase
 */
class FunnelTracker {
  constructor(config = {}) {
    this.config = {
      funnelName: config.funnelName || 'sales_funnel',
      enableAnalytics: config.enableAnalytics !== false,
      storageType: config.storageType || 'memory', // memory, sessionStorage, localStorage
      ...config
    };

    this.funnel = {
      id: this.generateFunnelId(),
      name: this.config.funnelName,
      startTime: Date.now(),
      steps: [
        { name: 'view_product', label: 'عرض المنتج', count: 0, timestamp: null },
        { name: 'click_product', label: 'نقر على المنتج', count: 0, timestamp: null },
        { name: 'add_to_cart', label: 'إضافة إلى السلة', count: 0, timestamp: null },
        { name: 'initiate_checkout', label: 'بدء الدفع', count: 0, timestamp: null },
        { name: 'purchase', label: 'شراء', count: 0, timestamp: null }
      ],
      dropoff: {}
    };

    this.init();
  }

  init() {
    console.log(`📢 Funnel Tracker initialized: ${this.funnel.id}`);
    this.attachGlobalListeners();
    this.loadFunnelData();
  }

  generateFunnelId() {
    return `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  attachGlobalListeners() {
    // Track product views
    document.addEventListener('click', (e) => {
      const productCard = e.target.closest('[data-product-id]');
      if (productCard) {
        const productId = productCard.getAttribute('data-product-id');
        this.trackStep('click_product', { productId });
      }
    });

    // Track add to cart
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-add-to-cart]')) {
        const productId = e.target.closest('[data-add-to-cart]').getAttribute('data-product-id');
        this.trackStep('add_to_cart', { productId });
      }
    });

    // Track checkout initiation
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-checkout]')) {
        this.trackStep('initiate_checkout');
      }
    });
  }

  trackProductView(productId, productName = '') {
    this.trackStep('view_product', { productId, productName });
  }

  trackStep(stepName, metadata = {}) {
    const step = this.funnel.steps.find(s => s.name === stepName);
    if (!step) {
      console.warn(`Step not found: ${stepName}`);
      return;
    }

    step.count++;
    step.timestamp = Date.now();

    // Calculate dropoff
    this.calculateDropoff();

    // Store data
    this.saveFunnelData();

    // Send to analytics
    if (this.config.enableAnalytics) {
      this.sendAnalytics(stepName, metadata);
    }

    console.log(`✍️ Funnel Step: ${step.label} (${step.count})`);
  }

  calculateDropoff() {
    const firstStep = this.funnel.steps[0].count;
    if (firstStep === 0) return;

    this.funnel.dropoff = {};
    this.funnel.steps.forEach((step, index) => {
      const previousCount = index === 0 ? firstStep : this.funnel.steps[index - 1].count;
      const dropoffRate = previousCount > 0
        ? ((previousCount - step.count) / previousCount * 100).toFixed(2)
        : 0;

      this.funnel.dropoff[step.name] = {
        rate: parseFloat(dropoffRate),
        users: previousCount - step.count
      };
    });
  }

  getConversionRate() {
    const firstStep = this.funnel.steps[0].count;
    const lastStep = this.funnel.steps[this.funnel.steps.length - 1].count;

    if (firstStep === 0) return 0;
    return ((lastStep / firstStep) * 100).toFixed(2);
  }

  getFunnelData() {
    return {
      ...this.funnel,
      conversionRate: this.getConversionRate(),
      duration: Date.now() - this.funnel.startTime
    };
  }

  saveFunnelData() {
    const data = JSON.stringify(this.getFunnelData());

    switch (this.config.storageType) {
      case 'localStorage':
        localStorage.setItem(this.funnel.id, data);
        break;
      case 'sessionStorage':
        sessionStorage.setItem(this.funnel.id, data);
        break;
      default:
        // In-memory storage
        break;
    }
  }

  loadFunnelData() {
    let storedData = null;

    switch (this.config.storageType) {
      case 'localStorage':
        storedData = localStorage.getItem(this.funnel.id);
        break;
      case 'sessionStorage':
        storedData = sessionStorage.getItem(this.funnel.id);
        break;
    }

    if (storedData) {
      const parsed = JSON.parse(storedData);
      this.funnel = { ...this.funnel, ...parsed };
    }
  }

  sendAnalytics(step, metadata) {
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', step, {
        funnel_name: this.funnel.name,
        funnel_id: this.funnel.id,
        ...metadata
      });
    }

    // Send to custom analytics endpoint
    if (window.fetch) {
      fetch('/api/analytics/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnel_id: this.funnel.id,
          step,
          metadata,
          timestamp: Date.now()
        })
      }).catch(err => console.warn('Analytics endpoint error:', err));
    }
  }

  getVisualization() {
    const total = this.funnel.steps[0].count;
    if (total === 0) return null;

    return this.funnel.steps.map((step, index) => {
      const percentage = ((step.count / total) * 100).toFixed(1);
      const previousCount = index === 0 ? total : this.funnel.steps[index - 1].count;
      const stepDropoff = ((previousCount - step.count) / total * 100).toFixed(1);

      return {
        name: step.label,
        users: step.count,
        percentage: parseFloat(percentage),
        dropoff: parseFloat(stepDropoff),
        width: `${percentage}%`
      };
    });
  }

  renderFunnelChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const visualization = this.getVisualization();
    if (!visualization) {
      container.innerHTML = '<p>لا توجد بيانات في القمع</p>';
      return;
    }

    const html = `
      <div class="funnel-chart">
        <h3>مراحل التحويل: ${this.getConversionRate()}%</h3>
        ${visualization.map(step => `
          <div class="funnel-step">
            <div class="funnel-bar" style="width: ${step.width}">
              <span class="funnel-label">${step.name}</span>
              <span class="funnel-count">${step.users} مستخدم</span>
            </div>
            <div class="funnel-dropoff">سقوط: ${step.dropoff}%</div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
  }

  reset() {
    this.funnel.steps.forEach(step => {
      step.count = 0;
      step.timestamp = null;
    });
    this.funnel.dropoff = {};
    this.saveFunnelData();
    console.log('📢 Funnel reset');
  }

  export() {
    const data = this.getFunnelData();
    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, `${this.funnel.name}_${Date.now()}.csv`);
  }

  convertToCSV(data) {
    let csv = 'Step,Count,Percentage,Dropoff Rate\n';
    const total = data.steps[0].count;

    data.steps.forEach(step => {
      const percentage = ((step.count / total) * 100).toFixed(2);
      const dropoff = data.dropoff[step.name]?.rate || 0;
      csv += `${step.label},${step.count},${percentage}%,${dropoff}%\n`;
    });

    return csv;
  }

  downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Export globally
window.FunnelTracker = FunnelTracker;

console.log('✅ Funnel Tracker loaded');
