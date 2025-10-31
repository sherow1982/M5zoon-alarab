#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete Google Merchant Feed Generator - مولد فيد جوجل شامل
يعمل مع جميع منتجات المتجر وينشئ رابط واحد فقط
"""

import json
import html
from datetime import datetime
import re

# إعدادات المتجر
STORE = {
    'name': 'متجر هدايا الإمارات',
    'url': 'https://emirates-gifts.arabsad.com',
    'brand': 'Emirates Gifts',
    'currency': 'AED',
    'country': 'AE'
}

def escape_xml(text):
    """تنظيف النص لـ XML"""
    if not text:
        return ''
    return html.escape(str(text).strip())

def get_category_info(title, source):
    """تحديد فئة المنتج"""
    if source == 'otor':
        return {
            'type': 'perfume',
            'google_cat': 'Health &amp; Beauty &gt; Personal Care &gt; Cosmetics &gt; Fragrance',
            'desc_type': 'عطور فاخرة',
            'prefix': 'PERF'
        }
    else:
        return {
            'type': 'watch',
            'google_cat': 'Apparel &amp; Accessories &gt; Jewelry &gt; Watches',
            'desc_type': 'ساعات فاخرة',
            'prefix': 'WATCH'
        }

def create_item_xml(product, source, index):
    """إنشاء XML لمنتج واحد"""
    cat = get_category_info(product.get('title', ''), source)
    
    # استخراج البيانات
    pid = product.get('id', index)
    title = escape_xml(product.get('title', ''))
    price = float(product.get('sale_price', product.get('price', 0)) or 0)
    img = escape_xml(product.get('image_link', ''))
    
    # تخطي المنتجات بدون أسعار
    if price <= 0:
        return ''
    
    # إنشاء المعرفات
    gtin = f"1234567{('00' if cat['type'] == 'perfume' else '10')}{str(pid).zfill(4)}0"
    mpn = f"EG-{cat['prefix']}-{pid}"
    desc = f"{title} - {cat['desc_type']} عالية الجودة مع توصيل مجاني في الإمارات"
    
    return f'''    <item>
        <g:id>{cat['prefix']}_{pid}</g:id>
        <title>{title}</title>
        <description>{escape_xml(desc)}</description>
        <link>{STORE['url']}</link>
        <g:image_link>{img}</g:image_link>
        <g:condition>new</g:condition>
        <g:availability>in_stock</g:availability>
        <g:price>{price} {STORE['currency']}</g:price>
        <g:brand>{STORE['brand']}</g:brand>
        <g:gtin>{gtin}</g:gtin>
        <g:mpn>{mpn}</g:mpn>
        <g:google_product_category>{cat['google_cat']}</g:google_product_category>
        <g:product_type>{cat['desc_type']}</g:product_type>
        <g:age_group>adult</g:age_group>
        <g:gender>unisex</g:gender>
        <g:shipping>
            <g:country>{STORE['country']}</g:country>
            <g:service>شحن مجاني</g:service>
            <g:price>0 {STORE['currency']}</g:price>
        </g:shipping>
        <g:shipping_weight>0.5 kg</g:shipping_weight>
        <g:tax>
            <g:country>{STORE['country']}</g:country>
            <g:rate>0</g:rate>
        </g:tax>
    </item>
'''

def generate_complete_feed():
    """إنشاء فيد شامل نهائي"""
    print("🛍 بدء إنشاء Google Merchant Feed شامل...")
    
    # تحميل البيانات
    all_products = []
    
    # عطور
    try:
        with open('data/otor.json', 'r', encoding='utf-8') as f:
            perfumes = json.load(f)
            all_products.extend([(p, 'otor') for p in perfumes])
        print(f"🌸 تم تحميل {len(perfumes)} عطر")
    except:
        print("⚠️ لم يتم العثور على ملف العطور")
    
    # ساعات
    try:
        with open('data/sa3at.json', 'r', encoding='utf-8') as f:
            watches = json.load(f)
            all_products.extend([(w, 'sa3at') for w in watches])
        print(f"⌚ تم تحميل {len(watches)} ساعة")
    except:
        print("⚠️ لم يتم العثور على ملف الساعات")
    
    if not all_products:
        print("❌ لا توجد منتجات")
        return False
    
    # إنشاء XML header
    feed_start = f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title>{escape_xml(STORE['name'])}</title>
        <link>{STORE['url']}</link>
        <description>عطور وساعات فاخرة عالية الجودة مع توصيل مجاني</description>
        <language>ar-AE</language>
        <lastBuildDate>{datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}</lastBuildDate>
        <generator>Emirates Gifts Complete Feed Generator</generator>
'''
    
    feed_end = '''    </channel>
</rss>'''
    
    # معالجة المنتجات
    items_xml = []
    stats = {'perfume': 0, 'watch': 0, 'skipped': 0}
    
    for i, (product, source) in enumerate(all_products, 1):
        item = create_item_xml(product, source, i)
        if item.strip():
            items_xml.append(item)
            if source == 'otor':
                stats['perfume'] += 1
            else:
                stats['watch'] += 1
        else:
            stats['skipped'] += 1
    
    # تجميع الفيد
    complete_feed = feed_start + ''.join(items_xml) + feed_end
    
    # حفظ الملف
    with open('google-merchant-feed.xml', 'w', encoding='utf-8') as f:
        f.write(complete_feed)
    
    # عرض النتائج
    total = stats['perfume'] + stats['watch']
    print(f"\n✅ تم إنشاء الفيد بنجاح!")
    print(f"🌸 عطور: {stats['perfume']}")
    print(f"⌚ ساعات: {stats['watch']}")
    print(f"❌ متخطى: {stats['skipped']}")
    print(f"📊 إجمالي: {total}")
    print(f"\n🔗 رابط الفيد: {STORE['url']}/google-merchant-feed.xml")
    
    return True

if __name__ == '__main__':
    generate_complete_feed()