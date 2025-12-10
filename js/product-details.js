/**
 * Logic for the product details page.
 * Fetches product data based on URL parameters and displays it.
 * Also injects SEO metadata and JSON-LD schema.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing product details page...');
    loadProductData();
});

/**
 * Gets product ID and category from URL parameters.
 * @returns {{id: string|null, category: string|null}}
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        category: params.get('category'),
    };
}

/**
 * Fetches product data from the relevant JSON file.
 */
async function loadProductData() {
    const { id, category } = getUrlParams();

    if (!id || !category) {
        showError('المعرّف أو الفئة غير موجودة في الرابط.');
        return;
    }

    const dataFile = category === 'perfume' ? './data/otor.json' : './data/sa3at.json';

    try {
        const [productResponse, configResponse] = await Promise.all([
            fetch(dataFile),
            fetch('./seo_config.json')
        ]);

        if (!productResponse.ok) throw new Error(`فشل تحميل ملف البيانات: ${dataFile}`);
        if (!configResponse.ok) throw new Error('فشل تحميل ملف الإعدادات seo_config.json');

        const products = await productResponse.json();
        const config = await configResponse.json();
        
        const product = products.find(p => String(p.id) === String(id));

        if (!product) {
            showError('لم يتم العثور على المنتج المطلوب.');
            return;
        }

        displayProduct(product, category, config);
        injectSchema(product, category, config);

    } catch (error) {
        console.error('Error loading product data:', error);
        showError('حدث خطأ أثناء تحميل بيانات المنتج.');
    }
}

/**
 * Displays the fetched product data on the page.
 * @param {object} product - The product data object.
 * @param {string} category - The product category.
 * @param {object} config - The SEO configuration object.
 */
function displayProduct(product, category, config) {
    const { title, image_link, price, sale_price } = product;

    // Update page title and meta description
    document.title = `${title} | ${config.brand_name}`;
    document.getElementById('page-title').textContent = document.title;
    document.getElementById('page-description').setAttribute('content', `${title} - منتج عالي الجودة من ${config.brand_name}`);
    document.getElementById('canonical-url').setAttribute('href', window.location.href);

    // Calculate prices and savings
    const oldPrice = parseFloat(price || 0);
    const newPrice = parseFloat(sale_price || oldPrice);
    const savings = oldPrice - newPrice;
    const discountPercent = oldPrice > 0 && savings > 0 ? Math.round((savings / oldPrice) * 100) : 0;

    // Update DOM elements
    document.getElementById('product-image').src = image_link || config.default_image;
    document.getElementById('product-image').alt = title;
    document.getElementById('product-title').textContent = title;
    document.getElementById('breadcrumb-product').textContent = title;
    document.getElementById('category-badge').textContent = category === 'perfume' ? 'عطور' : 'ساعات';

    document.getElementById('old-price').textContent = `${oldPrice.toFixed(0)} د.إ`;
    document.getElementById('current-price').textContent = `${newPrice.toFixed(0)} د.إ`;
    
    const discountBadge = document.getElementById('discount-badge');
    if (discountPercent > 0) {
        discountBadge.textContent = `-${discountPercent}%`;
        discountBadge.style.display = 'block';
    } else {
        discountBadge.style.display = 'none';
    }

    const savingsEl = document.getElementById('savings');
    if (savings > 0) {
        savingsEl.textContent = `وفر ${savings.toFixed(0)} د.إ`;
        savingsEl.style.display = 'inline-block';
    } else {
        savingsEl.style.display = 'none';
    }

    document.getElementById('product-description-text').textContent = 
        `${title} - منتج فاخر عالي الجودة من ${config.brand_name}. ✨ جودة مضمونة وأسعار تنافسية. 🚚 توصيل مجاني خلال 1-3 أيام عمل. 🔄 ضمان الاستبدال خلال 14 يوم. 💳 دفع عند الاستلام متاح.`;

    // Update WhatsApp link
    const whatsappMessage = encodeURIComponent(`مرحباً، أرغب في طلب:\n${title}\nالسعر: ${newPrice.toFixed(0)} د.إ`);
    document.getElementById('whatsapp-btn').href = `https://wa.me/${config.business_details.telephone.replace(/\+/g, '')}?text=${whatsappMessage}`;

    // Show product container and hide loading/error messages
    document.getElementById('loading-container').classList.add('hide');
    document.getElementById('error-container').classList.add('hide');
    document.getElementById('product-container').classList.remove('hide');

    console.log('✅ Product displayed successfully:', title);
}

/**
 * Injects Product and LocalBusiness JSON-LD schema into the page head.
 * @param {object} product - The product data object.
 * @param {string} category - The product category.
 * @param {object} config - The SEO configuration object.
 */
function injectSchema(product, category, config) {
    const { title, image_link, sale_price, price } = product;
    const url = window.location.href;
    const currentPrice = sale_price || price || 0;
    const priceValidUntil = new Date();
    priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title,
        "image": [image_link || ''],
        "description": `${title} - هدية فريدة من ${config.brand_name}`,
        "brand": { "@type": "Brand", "name": config.brand_name },
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": config.product_defaults.currency,
            "price": String(currentPrice),
            "priceValidUntil": priceValidUntil.toISOString().split('T')[0],
            "itemCondition": config.product_defaults.condition,
            "availability": config.product_defaults.availability,
            "seller": { "@type": "Organization", "name": config.brand_name }
        }
    };

    // Remove old schema scripts
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());

    // Inject new product schema
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.textContent = JSON.stringify(productSchema, null, 2);
    document.head.appendChild(scriptTag);

    console.log('✅ Schema markup injected for:', title);
}

/**
 * Displays an error message on the page.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.querySelector('p').textContent = message;
    document.getElementById('loading-container').classList.add('hide');
    errorContainer.classList.remove('hide');
}