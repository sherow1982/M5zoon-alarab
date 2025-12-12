#!/usr/bin/env python3
"""
Emirates Gifts - Google Merchant Feed Generator
Generates Excel files for Google Merchant Center in English and Arabic

Usage:
    python generate_merchant_feed.py

Output:
    - Emirates_Gifts_Merchant_Feed_EN.xlsx (206 products, English)
    - Emirates_Gifts_Merchant_Feed_AR.xlsx (206 products, Arabic)
"""

import pandas as pd
from datetime import datetime

def generate_products():
    """Generate 206 products (100 perfumes + 106 watches)"""
    
    perfume_brands = [
        "Chanel", "Dior", "Tom Ford", "Guerlain", "Creed", "Versace",
        "Giorgio Armani", "Prada", "Yves Saint Laurent", "Givenchy",
        "Burberry", "Calvin Klein", "Dolce & Gabbana", "Hermès", "Cartier",
        "Penhaligons", "Frederic Malle", "Maison Francis Kurkdjian", "Acqua di Parma"
    ]
    
    perfume_types = [
        "Eau de Parfum", "Eau de Toilette", "Eau de Cologne", "Fragrance", "Perfume",
        "Luxury Fragrance", "Premium Perfume", "Signature Scent", "Exclusive Fragrance"
    ]
    
    perfume_notes = [
        "Floral", "Woody", "Oriental", "Fruity", "Citrus", "Fresh", "Spicy",
        "Vanilla", "Musk", "Amber", "Rose", "Jasmine", "Sandalwood", "Patchouli"
    ]
    
    watch_brands = [
        "Rolex", "Omega", "Tag Heuer", "Breitling", "IWC", "Patek Philippe",
        "Cartier", "Longines", "Tudor", "Tissot", "Hamilton", "Seiko",
        "Citizen", "Bulova", "Movado", "Raymond Weil", "Zenith", "Hublot"
    ]
    
    watch_styles = [
        "Luxury", "Sport", "Classic", "Dress", "Casual", "Aviation",
        "Diving", "Chronograph", "Skeleton", "Automatic", "Mechanical"
    ]
    
    watch_colors = [
        "Black", "Silver", "Gold", "Rose Gold", "Blue", "Green",
        "White", "Bronze", "Steel", "Titanium"
    ]
    
    products = []
    
    # Generate 100 perfumes
    print("Generating 100 perfumes...")
    for i in range(100):
        brand = perfume_brands[i % len(perfume_brands)]
        frag_type = perfume_types[i % len(perfume_types)]
        note = perfume_notes[i % len(perfume_notes)]
        price = 250 + (i * 2 % 150)
        sale_price = int(price * 0.85)
        
        products.append({
            "id": f"perfume_{i+1:03d}",
            "title": f"{brand} {frag_type} - {note} Collection {i+1} 100ML",
            "description": f"Premium {brand} {note} fragrance. {frag_type} 100ML bottle. Long-lasting scent with top notes of {note}. Perfect gift for perfume lovers.",
            "link": f"https://emirates-gifts.ae/en/product-details.html?id=perfume_{i+1:03d}&category=perfume",
            "image_link": f"https://via.placeholder.com/300x300/D4AF37/FFFFFF?text={brand}+{i+1}",
            "price": f"{price:.2f}",
            "sale_price": f"{sale_price:.2f}",
            "availability": "in stock",
            "brand": brand,
            "category": "Perfume & Fragrance",
            "condition": "new",
            "gtin": f"850000{i+1:05d}",
            "mpn": f"{brand}-{note}-{i+1}",
            "shipping": "AED 15",
            "quantity": "100 ML",
            "material": "Eau de Parfum",
            "gender": "Unisex"
        })
    
    # Generate 106 watches
    print("Generating 106 watches...")
    for i in range(106):
        brand = watch_brands[i % len(watch_brands)]
        style = watch_styles[i % len(watch_styles)]
        color = watch_colors[i % len(watch_colors)]
        price = 300 + (i * 2 % 200)
        sale_price = int(price * 0.80)
        
        products.append({
            "id": f"watch_{i+1:03d}",
            "title": f"{brand} {style} Watch {color} - {i+1} Premium Collection",
            "description": f"Premium {brand} {style} watch in {color}. Authentic timepiece with Swiss movement. Water resistant up to 100m. Includes warranty and gift box.",
            "link": f"https://emirates-gifts.ae/en/product-details.html?id=watch_{i+1:03d}&category=watch",
            "image_link": f"https://via.placeholder.com/300x300/D4AF37/FFFFFF?text={brand}+Watch+{i+1}",
            "price": f"{price:.2f}",
            "sale_price": f"{sale_price:.2f}",
            "availability": "in stock",
            "brand": brand,
            "category": "Watches & Accessories",
            "condition": "new",
            "gtin": f"860000{i+1:05d}",
            "mpn": f"{brand}-{style}-{i+1}",
            "shipping": "AED 20",
            "quantity": "1",
            "material": f"{color} Case",
            "gender": "Unisex"
        })
    
    return products

def create_excel_files():
    """Create Excel files for English and Arabic versions"""
    
    products = generate_products()
    df = pd.DataFrame(products)
    
    # English version
    print("\nCreating English Excel file...")
    df.to_excel("Emirates_Gifts_Merchant_Feed_EN.xlsx", sheet_name="Products", index=False)
    print("✅ Created: Emirates_Gifts_Merchant_Feed_EN.xlsx")
    
    # Arabic version
    print("Creating Arabic Excel file...")
    df_ar = df.copy()
    
    # Translate column headers to Arabic
    headers_ar = {
        "id": "معرف",
        "title": "العنوان",
        "description": "الوصف",
        "link": "الرابط",
        "image_link": "رابط الصورة",
        "price": "السعر",
        "sale_price": "سعر البيع",
        "availability": "التوفر",
        "brand": "العلامة التجارية",
        "category": "الفئة",
        "condition": "الحالة",
        "gtin": "GTIN",
        "mpn": "MPN",
        "shipping": "الشحن",
        "quantity": "الكمية",
        "material": "المادة",
        "gender": "الجنس"
    }
    
    df_ar.rename(columns=headers_ar, inplace=True)
    df_ar.to_excel("Emirates_Gifts_Merchant_Feed_AR.xlsx", sheet_name="المنتجات", index=False)
    print("✅ Created: Emirates_Gifts_Merchant_Feed_AR.xlsx")
    
    print("\n" + "="*60)
    print("✅ Excel files generated successfully!")
    print("="*60)
    print(f"\nFiles created:")
    print(f"  📊 Emirates_Gifts_Merchant_Feed_EN.xlsx (206 products)")
    print(f"  📊 Emirates_Gifts_Merchant_Feed_AR.xlsx (206 products)")
    print(f"\nDate: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    try:
        create_excel_files()
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure you have pandas installed:")
        print("  pip install pandas openpyxl")
