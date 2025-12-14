/**
 * Enhanced Product Carousel & Funnel Tracker with Quantity Counter
 * Features:
 * - Image carousel with touch/click controls
 * - Quantity counter (+ / -)
 * - Funnel tracking for conversion analytics
 * - Smooth animations
 * - Mobile responsive
 */

(function() {
  'use strict';

  /**
   * IMAGE CAROUSEL
   */
  class ProductCarousel {
    constructor(selector) {
      this.container = document.querySelector(selector);
      if (!this.container) return;

      this.images = this.container.querySelectorAll('[data-carousel-item]');
      this.currentIndex = 0;
      this.isAutoplay = true;
      this.autoplayInterval = null;
      this.touchStartX = 0;
      this.touchEndX = 0;

      this.init();
    }

    init() {
      this.createControls();
      this.setupEventListeners();
      this.startAutoplay();
      this.showImage(0);
      console.log('✅ Carousel initialized with', this.images.length, 'images');
    }

    createControls() {
      // Previous button
      const prevBtn = this.container.querySelector('[data-carousel-prev]');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.prev());
      }

      // Next button
      const nextBtn = this.container.querySelector('[data-carousel-next]');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.next());
      }

      // Dots/indicators
      const dotsContainer = this.container.querySelector('[data-carousel-dots]');
      if (dotsContainer) {
        this.images.forEach((_, index) => {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.setAttribute('data-slide', index);
          if (index === 0) dot.classList.add('active');
          dot.addEventListener('click', () => this.goTo(index));
          dotsContainer.appendChild(dot);
        });
        this.dots = dotsContainer.querySelectorAll('.carousel-dot');
      }
    }

    setupEventListeners() {
      // Touch events
      this.container.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.stopAutoplay();
      });

      this.container.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.startAutoplay();
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }

    handleSwipe() {
      const swipeThreshold = 50;
      const diff = this.touchStartX - this.touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }

    showImage(index) {
      // Hide all
      this.images.forEach(img => img.classList.remove('active'));
      
      // Show current
      if (this.images[index]) {
        this.images[index].classList.add('active');
        this.currentIndex = index;

        // Update dots
        if (this.dots) {
          this.dots.forEach(dot => dot.classList.remove('active'));
          if (this.dots[index]) this.dots[index].classList.add('active');
        }
      }
    }

    next() {
      const nextIndex = (this.currentIndex + 1) % this.images.length;
      this.goTo(nextIndex);
    }

    prev() {
      const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.goTo(prevIndex);
    }

    goTo(index) {
      this.showImage(index);
      this.resetAutoplay();
    }

    startAutoplay() {
      if (!this.isAutoplay) return;
      
      this.autoplayInterval = setInterval(() => {
        this.next();
      }, 5000); // Change every 5 seconds
    }

    stopAutoplay() {
      clearInterval(this.autoplayInterval);
    }

    resetAutoplay() {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  /**
   * QUANTITY COUNTER
   */
  class QuantityCounter {
    constructor(selector) {
      this.container = document.querySelector(selector);
      if (!this.container) return;

      this.input = this.container.querySelector('input[type="number"]');
      this.minBtn = this.container.querySelector('[data-quantity-minus]');
      this.plusBtn = this.container.querySelector('[data-quantity-plus]');
      this.minValue = parseInt(this.input?.getAttribute('min') || 1);
      this.maxValue = parseInt(this.input?.getAttribute('max') || 999);

      this.init();
    }

    init() {
      if (this.minBtn) {
        this.minBtn.addEventListener('click', () => this.decrease());
      }

      if (this.plusBtn) {
        this.plusBtn.addEventListener('click', () => this.increase());
      }

      if (this.input) {
        this.input.addEventListener('change', () => this.validate());
        this.input.addEventListener('keydown', (e) => this.handleKeyboard(e));
      }

      this.updateButtonStates();
      console.log('✅ Quantity counter initialized');
    }

    getQuantity() {
      return parseInt(this.input?.value || 1);
    }

    setQuantity(value) {
      const quantity = Math.max(this.minValue, Math.min(this.maxValue, value));
      if (this.input) {
        this.input.value = quantity;
        this.updateButtonStates();
        this.dispatchChange();
      }
    }

    increase() {
      this.setQuantity(this.getQuantity() + 1);
    }

    decrease() {
      this.setQuantity(this.getQuantity() - 1);
    }

    validate() {
      let value = this.getQuantity();
      
      if (isNaN(value) || value < this.minValue) {
        value = this.minValue;
      } else if (value > this.maxValue) {
        value = this.maxValue;
      }
      
      this.setQuantity(value);
    }

    handleKeyboard(e) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.increase();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.decrease();
      }
    }

    updateButtonStates() {
      const quantity = this.getQuantity();
      
      // Disable minus if at minimum
      if (this.minBtn) {
        this.minBtn.disabled = quantity <= this.minValue;
      }
      
      // Disable plus if at maximum
      if (this.plusBtn) {
        this.plusBtn.disabled = quantity >= this.maxValue;
      }
    }

    dispatchChange() {
      if (this.input) {
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  /**
   * FUNNEL TRACKER
   */
  class FunnelTracker {
    constructor() {
      this.steps = {
        view: 0,
        click: 0,
        add_to_cart: 0,
        checkout: 0,
        purchase: 0
      };

      this.load();
      this.trackView();
    }

    track(step, data = {}) {
      if (!this.steps.hasOwnProperty(step)) return;

      this.steps[step]++;
      this.save();

      // Send to GA
      if (window.gtag) {
        gtag('event', `funnel_${step}`, {
          product_id: data.productId,
          product_name: data.productName,
          quantity: data.quantity,
          price: data.price
        });
      }

      console.log(`📊 Funnel tracked: ${step}`, this.steps);
    }

    trackView() {
      this.track('view');
    }

    trackClick() {
      this.track('click');
    }

    trackAddToCart(productData) {
      this.track('add_to_cart', productData);
    }

    trackCheckout() {
      this.track('checkout');
    }

    trackPurchase(orderData) {
      this.track('purchase', orderData);
    }

    getConversionRate(from = 'view', to = 'add_to_cart') {
      if (this.steps[from] === 0) return 0;
      return ((this.steps[to] / this.steps[from]) * 100).toFixed(2);
    }

    getStats() {
      return {
        steps: this.steps,
        conversionRate: this.getConversionRate(),
        timestamp: new Date().toISOString()
      };
    }

    save() {
      try {
        localStorage.setItem('funnel_data', JSON.stringify(this.steps));
      } catch (e) {
        console.error('⚠️ Cannot save funnel data:', e);
      }
    }

    load() {
      try {
        const data = localStorage.getItem('funnel_data');
        if (data) {
          this.steps = JSON.parse(data);
        }
      } catch (e) {
        console.error('⚠️ Cannot load funnel data:', e);
      }
    }
  }

  /**
   * INITIALIZE ON DOM READY
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel
    window.productCarousel = new ProductCarousel('[data-product-carousel]');

    // Initialize quantity counter
    window.quantityCounter = new QuantityCounter('[data-quantity-counter]');

    // Initialize funnel tracker
    window.funnelTracker = new FunnelTracker();

    // Hook add-to-cart button
    const cartBtn = document.getElementById('add-to-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productId = new URLSearchParams(window.location.search).get('id');
        const quantity = window.quantityCounter?.getQuantity() || 1;
        const productName = document.getElementById('product-title')?.textContent || 'Product';
        const price = document.getElementById('current-price')?.textContent || '0';

        // Track in funnel
        window.funnelTracker?.trackAddToCart({
          productId,
          productName,
          quantity,
          price
        });

        console.log('🛒 Adding to cart:', { productId, quantity, productName });
      });
    }

    console.log('✅ Product carousel & funnel tracker ready!');
  });

  // Export globally
  window.ProductCarousel = ProductCarousel;
  window.QuantityCounter = QuantityCounter;
  window.FunnelTracker = FunnelTracker;
})();
