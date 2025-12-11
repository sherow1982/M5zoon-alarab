/**
 * Initializes dynamic SEO content (JSON-LD) and footer details.
 * This script is designed to be run on multiple pages.
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Initializing dynamic SEO and Footer content...");

    fetch('./seo_config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(config => {
            if (!config || !config.business_details) {
                console.error("Incomplete or invalid seo_config.json");
                return;
            }
            
            const details = config.business_details;

            // 1. Update Footer Contact Info (if elements exist)
            const contactList = document.querySelector('#footer-contact-info ul');
            if (contactList) {
                contactList.innerHTML = `
                    <li><i class="fas fa-phone" aria-hidden="true"></i><a href="tel:${details.telephone}">${details.telephone}</a></li>
                    <li><i class="fas fa-envelope" aria-hidden="true"></i><a href="mailto:${details.email}">${details.email}</a></li>
                    <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i><span>${details.address.addressLocality}, ${details.address.addressCountry === 'AE' ? 'الإمارات العربية المتحدة' : details.address.addressCountry}</span></li>
                    <li><i class="fas fa-clock" aria-hidden="true"></i><span>خدمة العملاء: 24/7</span></li>
                `;
            }

            // 2. Generate and inject Organization JSON-LD Schema (if not already present)
            if (!document.querySelector('script[type="application/ld+json"]')) {
                const schema = {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": details.name,
                    "url": config.base_url,
                    "logo": `${config.base_url}${config.default_image}`,
                    "contactPoint": { "@type": "ContactPoint", "telephone": details.telephone, "contactType": "Customer Service" },
                    "address": details.address,
                    "sameAs": [ details.whatsapp ]
                };
                const scriptTag = document.createElement('script');
                scriptTag.type = 'application/ld+json';
                scriptTag.textContent = JSON.stringify(schema, null, 2);
                document.head.appendChild(scriptTag);
                console.log("✅ Organization JSON-LD schema injected.");
            }
        })
        .catch(error => console.error('Error loading dynamic SEO/Footer config:', error));
});