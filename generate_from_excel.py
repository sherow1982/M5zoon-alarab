#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import html
import pathlib
import sys
import logging

import pandas as pd
from slugify import slugify

# Input Excel (try data/ then root)
CANDIDATES = [
    pathlib.Path("data/products-template.xlsx"),
    pathlib.Path("products-template.xlsx")
]

# --- إعدادات ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

TEMPLATE_FILE = pathlib.Path(__file__).parent / "product_template.html"
OUTPUT_DIR = pathlib.Path("products")
DEFAULT_AVAIL = "https://schema.org/InStock"

def find_excel():
    for p in CANDIDATES:
        if p.exists():
            return p
    raise FileNotFoundError("لم يتم العثور على ملف Excel. يرجى وضعه في data/products-template.xlsx")

def load_config():
    """Loads configuration from the central seo_config.json file."""
    config_path = pathlib.Path(__file__).parent / "seo_config.json"
    if not config_path.exists():
        raise FileNotFoundError(f"ملف الإعدادات غير موجود في {config_path}")
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    return config

def clean_price(val):
    if pd.isna(val):
        return None
    s = str(val).strip()
    keep = "".join(ch for ch in s if ch.isdigit() or ch in ".,")
    if not keep:
        return None
    return keep.replace(",", ".")

def build_jsonld(product_data, config):
    """بناء سكيما JSON-LD كاملة للمنتج."""
    product_defaults = config.get("product_defaults", {})
    
    data = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product_data['title'],
        "image": product_data['image'] or "",
        "description": product_data['desc'] or f"{product_data['title']} - منتج عالي الجودة من {config.get('brand_name')}",
        "brand": {
            "@type": "Brand",
            "name": product_data['brand']
        }
    }

    if product_data.get('price'):
        data["offers"] = {
            "@type": "Offer",
            "url": product_data['link'] or "",
            "price": product_data['price'],
            "priceCurrency": product_data['currency'],
            "availability": product_data['availability'],
            "itemCondition": product_defaults.get("condition", "https://schema.org/NewCondition"),
            "seller": {
                "@type": "Organization",
                "name": config.get("brand_name")
            }
        }
    return json.dumps(data, ensure_ascii=False, indent=2)

def render_html(template_content, context):
    """تعويض المتغيرات في قالب HTML."""
    content = template_content
    for key, value in context.items():
        # تحويل القيم إلى نص وتشفيرها لـ HTML
        safe_value = html.escape(str(value or ''), quote=True)
        content = content.replace(f"{{{{{key}}}}}", safe_value)
        # للمتغيرات التي لا تحتاج تشفير (مثل JSON-LD)
        content = content.replace(f"{{{{{key}_raw}}}}}", str(value or ''))
    return content

def main():
    try:
        config = load_config()
        excel_path = find_excel()
        if not TEMPLATE_FILE.exists():
            raise FileNotFoundError(f"ملف القالب غير موجود: {TEMPLATE_FILE}")
        template_str = TEMPLATE_FILE.read_text(encoding="utf-8")
    except FileNotFoundError as e:
        logger.error(f"❌ خطأ في الإعداد: {e}")
        sys.exit(1)

    default_brand = config.get("brand_name", "Emirates Gifts")
    default_currency = config.get("product_defaults", {}).get("currency", "AED")

    df = pd.read_excel(excel_path, engine="openpyxl").fillna("")  # requires openpyxl
    OUTPUT_DIR.mkdir(exist_ok=True)

    products = []
    used_slugs = set()

    for _, row in df.iterrows():
        title = (row.get("title") or "").strip()
        if not title:
            continue

        desc = (row.get("desc") or "").strip()
        image = (row.get("image") or "").strip()
        link = (row.get("link") or "").strip()
        price = clean_price(row.get("price"))
        currency = (row.get("currency") or default_currency).strip()
        brand = (row.get("brand") or default_brand).strip()
        availability_raw = (row.get("availability") or "InStock").strip()
        availability = f"https://schema.org/{availability_raw}" if "schema.org" not in availability_raw else availability_raw
        
        # slug
        custom_slug = (row.get("slug") or "").strip()
        slug = custom_slug or slugify(title)
        base = slug
        i = 1
        while slug in used_slugs:
            slug = f"{base}-{i}"
            i += 1
        used_slugs.add(slug)

        product_record = {
            "title": title, "desc": desc, "image": image, "link": link,
            "price": price, "currency": currency, "brand": brand,
            "availability": availability, "slug": slug
        }

        json_ld_str = build_jsonld(product_record, config)
        display_price = f"{price} {currency}" if price else ""

        html_context = {
            "title": title,
            "description": desc,
            "image_url": image,
            "buy_link": link,
            "display_price": display_price,
            "json_ld_raw": json_ld_str
        }
        html_page = render_html(template_str, html_context)

        # write HTML
        (OUTPUT_DIR / f"{slug}.html").write_text(html_page, encoding="utf-8", errors="xmlcharrefreplace")

        # accumulate JSON for index
        products.append({
            "title": title,
            "price": display_price,
            "image": image,
            "link": link,
            "slug": slug,
            "desc": desc
        })

    # write products.json
    (OUTPUT_DIR / "products.json").write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    logger.info(f"✅ تم إنشاء {len(products)} صفحة منتج في المجلد: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
