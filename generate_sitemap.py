#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import pathlib
import json
import subprocess
from datetime import datetime, timezone
from urllib.parse import urljoin, quote
from xml.etree.ElementTree import Element, SubElement, tostring as xml_tostring
from xml.dom import minidom

BASE_URL = ""

def get_file_mtime_iso(path: pathlib.Path) -> str:
    """Return file modification time in ISO-8601 UTC format."""
    dt = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).replace(microsecond=0)
    return dt.isoformat()

def ensure_trailing_slash(u: str) -> str:
    return u if u.endswith("/") else u + "/"

def build_url(base_url: str, products_dir: pathlib.Path, file_path: pathlib.Path) -> str:
    """Builds a clean, SEO-friendly URL."""
    rel_path = file_path.relative_to(products_dir).with_suffix('').as_posix()
    # Example: products/watch/watch_1/index.html -> watch/watch_1
    if rel_path.endswith('/index'):
        rel_path = rel_path[:-6]
    
    # Ensure we are using the correct base for products
    products_base = urljoin(ensure_trailing_slash(base_url), "product/")
    return urljoin(products_base, quote(rel_path, safe="/-_.~"))

def prettify_xml(elem: Element) -> bytes:
    """Renders an XML element to a pretty-printed string."""
    rough_string = xml_tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ", encoding="utf-8")

def get_base_url_from_config():
    """Reads the base_url from seo_config.json."""
    global BASE_URL
    config_path = pathlib.Path(__file__).parent / "seo_config.json"
    if not config_path.exists():
        print(f"Error: Config file not found at {config_path}", file=sys.stderr)
        sys.exit(1)
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    BASE_URL = config.get("base_url")
    if not BASE_URL:
        print("Error: base_url not found in seo_config.json", file=sys.stderr)
        sys.exit(1)

def generate_product_sitemap():
    """Generates sitemap for product detail pages."""
    products_dir = pathlib.Path("products")
    if not products_dir.exists():
        print("Warning: Missing products/ directory, skipping product sitemap.", file=sys.stderr)
        return []

    urlset = Element("urlset", attrib={"xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"})
    
    product_files = sorted(products_dir.rglob("*.html"))
    if not product_files:
        print("No product HTML files found, skipping product sitemap.", file=sys.stderr)
        return []

    for f in product_files:
        # Generate clean URL: /product/watch/watch_1/
        rel_path = f.relative_to(products_dir).parent.as_posix()
        loc = urljoin(ensure_trailing_slash(BASE_URL), f"product/{rel_path}/")
        
        lastmod = get_file_mtime_iso(f)
        
        url_element = SubElement(urlset, "url")
        SubElement(url_element, "loc").text = loc
        SubElement(url_element, "lastmod").text = lastmod
        SubElement(url_element, "changefreq").text = "weekly"
        SubElement(url_element, "priority").text = "0.8"

    sitemap_path = pathlib.Path("sitemap-products.xml")
    sitemap_path.write_bytes(prettify_xml(urlset))
    print(f"Generated {len(product_files)} URLs in {sitemap_path}")
    return [urljoin(BASE_URL, sitemap_path.name)]

def generate_static_pages_sitemap():
    """Generates sitemap for static pages like index.html, about.html, etc."""
    urlset = Element("urlset", attrib={"xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9", "xmlns:xhtml": "http://www.w3.org/1999/xhtml"})
    
    static_pages = [
        {"path": "index.html", "priority": "1.0", "freq": "daily"},
        {"path": "products-showcase.html", "priority": "0.9", "freq": "daily"},
        {"path": "about.html", "priority": "0.7", "freq": "monthly"},
        {"path": "privacy-policy.html", "priority": "0.5", "freq": "yearly"},
        {"path": "terms-conditions.html", "priority": "0.5", "freq": "yearly"},
        {"path": "shipping-policy.html", "priority": "0.5", "freq": "monthly"},
        {"path": "return-policy.html", "priority": "0.5", "freq": "monthly"},
    ]

    for page in static_pages:
        ar_path = pathlib.Path(page["path"])
        en_path = pathlib.Path("en") / page["path"]

        if ar_path.exists() and en_path.exists():
            ar_loc = urljoin(BASE_URL, ar_path.as_posix())
            en_loc = urljoin(BASE_URL, en_path.as_posix())
            
            # Entry for Arabic URL
            url_ar = SubElement(urlset, "url")
            SubElement(url_ar, "loc").text = ar_loc
            SubElement(url_ar, "lastmod").text = get_file_mtime_iso(ar_path)
            SubElement(url_ar, "changefreq").text = page["freq"]
            SubElement(url_ar, "priority").text = page["priority"]
            SubElement(url_ar, "xhtml:link", rel="alternate", hreflang="en", href=en_loc)
            SubElement(url_ar, "xhtml:link", rel="alternate", hreflang="ar", href=ar_loc)
            SubElement(url_ar, "xhtml:link", rel="alternate", hreflang="x-default", href=ar_loc)

            # Entry for English URL
            url_en = SubElement(urlset, "url")
            SubElement(url_en, "loc").text = en_loc
            SubElement(url_en, "lastmod").text = get_file_mtime_iso(en_path)
            SubElement(url_en, "changefreq").text = page["freq"]
            SubElement(url_en, "priority").text = page["priority"]
            SubElement(url_en, "xhtml:link", rel="alternate", hreflang="en", href=en_loc)
            SubElement(url_en, "xhtml:link", rel="alternate", hreflang="ar", href=ar_loc)
            SubElement(url_en, "xhtml:link", rel="alternate", hreflang="x-default", href=ar_loc)

    sitemap_path = pathlib.Path("sitemap-pages.xml")
    sitemap_path.write_bytes(prettify_xml(urlset))
    print(f"Generated {len(static_pages) * 2} static page URLs in {sitemap_path}")
    return [urljoin(BASE_URL, sitemap_path.name)]

def generate_sitemap_index(sitemap_files: list):
    """Generates the main sitemap index file."""
    if not sitemap_files:
        print("No sitemaps to index.", file=sys.stderr)
        return

    sitemapindex = Element("sitemapindex", attrib={"xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"})
    
    for sitemap_url in sitemap_files:
        sitemap_element = SubElement(sitemapindex, "sitemap")
        SubElement(sitemap_element, "loc").text = sitemap_url
        # lastmod is optional in sitemap index, but good practice
        # For simplicity, we use today's date
        SubElement(sitemap_element, "lastmod").text = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    index_path = pathlib.Path("sitemap-index.xml")
    index_path.write_bytes(prettify_xml(sitemapindex))
    print(f"Generated sitemap index at {index_path} with {len(sitemap_files)} entries.")

def main():
    print("🚀 Starting sitemap generation...")
    get_base_url_from_config()
    
    all_sitemaps = []
    all_sitemaps.extend(generate_static_pages_sitemap())
    all_sitemaps.extend(generate_product_sitemap())
    
    # Add other sitemaps if they exist
    if pathlib.Path("hreflang-sitemap.xml").exists():
        all_sitemaps.append(urljoin(BASE_URL, "hreflang-sitemap.xml"))

    generate_sitemap_index(all_sitemaps)
    print("✅ Sitemap generation complete.")

if __name__ == "__main__":
    main()
