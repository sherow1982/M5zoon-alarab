/**
 * Carousel System - Advanced Image Carousel
 * Features: Auto-play, Navigation, Touch support, Responsive
 */
class CarouselManager {
  constructor(config = {}) {
    this.config = {
      autoplay: config.autoplay !== false,
      autoplaySpeed: config.autoplaySpeed || 5000,
      transitionSpeed: config.transitionSpeed || 600,
      enableDots: config.enableDots !== false,
      enableArrows: config.enableArrows !== false,
      enableTouchSwipe: config.enableTouchSwipe !== false,
      loop: config.loop !== false,
      ...config
    };

    this.state = {
      currentIndex: 0,
      isTransitioning: false,
      autoplayInterval: null,
      touchStart: null,
      touchEnd: null
    };
  }

  init(carouselSelector) {
    this.carousel = document.querySelector(carouselSelector);
    if (!this.carousel) {
      console.error(`Carousel not found: ${carouselSelector}`);
      return;
    }

    this.items = this.carousel.querySelectorAll('.carousel-item');
    this.totalItems = this.items.length;

    if (this.totalItems === 0) return;

    this.setupDOM();
    this.attachEventListeners();
    this.updateCarousel();

    if (this.config.autoplay) {
      this.startAutoplay();
    }

    console.log(`🎠 Carousel initialized with ${this.totalItems} items`);
  }

  setupDOM() {
    // Create carousel wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'carousel-wrapper';

    // Move items to wrapper
    this.items.forEach((item, index) => {
      item.classList.add('carousel-item');
      item.setAttribute('data-index', index);
      this.wrapper.appendChild(item.cloneNode(true));
    });

    this.carousel.innerHTML = '';
    this.carousel.appendChild(this.wrapper);
    this.items = this.wrapper.querySelectorAll('.carousel-item');

    // Create navigation dots
    if (this.config.enableDots) {
      this.createDots();
    }

    // Create navigation arrows
    if (this.config.enableArrows) {
      this.createArrows();
    }
  }

  createDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';

    for (let i = 0; i < this.totalItems; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('data-slide', i);
      dot.setAttribute('aria-label', `اذهب إلى الشريحة ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    this.carousel.appendChild(dotsContainer);
    this.dots = dotsContainer.querySelectorAll('.carousel-dot');
  }

  createArrows() {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-arrow carousel-prev';
    prevBtn.setAttribute('aria-label', 'الشريحة السابقة');
    prevBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;
    prevBtn.addEventListener('click', () => this.prevSlide());

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-arrow carousel-next';
    nextBtn.setAttribute('aria-label', 'الشريحة التالية');
    nextBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
    nextBtn.addEventListener('click', () => this.nextSlide());

    this.carousel.appendChild(prevBtn);
    this.carousel.appendChild(nextBtn);
  }

  attachEventListeners() {
    // Pause autoplay on hover
    this.carousel.addEventListener('mouseenter', () => {
      if (this.config.autoplay) this.stopAutoplay();
    });

    this.carousel.addEventListener('mouseleave', () => {
      if (this.config.autoplay) this.startAutoplay();
    });

    // Touch support
    if (this.config.enableTouchSwipe) {
      this.carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
      this.carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
  }

  handleTouchStart(e) {
    this.state.touchStart = e.changedTouches[0].clientX;
  }

  handleTouchEnd(e) {
    this.state.touchEnd = e.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.state.touchStart - this.state.touchEnd;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  nextSlide() {
    if (this.state.isTransitioning) return;
    this.goToSlide((this.state.currentIndex + 1) % this.totalItems);
  }

  prevSlide() {
    if (this.state.isTransitioning) return;
    this.goToSlide((this.state.currentIndex - 1 + this.totalItems) % this.totalItems);
  }

  goToSlide(index) {
    if (index === this.state.currentIndex || this.state.isTransitioning) return;

    this.state.isTransitioning = true;
    this.state.currentIndex = index;

    this.updateCarousel();

    setTimeout(() => {
      this.state.isTransitioning = false;
    }, this.config.transitionSpeed);
  }

  updateCarousel() {
    // Update items
    this.items.forEach((item, index) => {
      item.classList.remove('active', 'prev', 'next');
      if (index === this.state.currentIndex) {
        item.classList.add('active');
      }
    });

    // Update dots
    if (this.dots) {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.state.currentIndex);
      });
    }

    // Apply transition
    this.wrapper.style.transition = `transform ${this.config.transitionSpeed}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    this.wrapper.style.transform = `translateX(-${this.state.currentIndex * 100}%)`;
  }

  startAutoplay() {
    if (this.state.autoplayInterval) return;

    this.state.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.config.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.state.autoplayInterval) {
      clearInterval(this.state.autoplayInterval);
      this.state.autoplayInterval = null;
    }
  }

  destroy() {
    this.stopAutoplay();
    this.carousel.innerHTML = '';
  }
}

// Export for use
window.CarouselManager = CarouselManager;

console.log('✅ Carousel manager loaded');
