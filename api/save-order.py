#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Emirates Gifts - Order Saving API
Saves orders to CSV file on GitHub via Git API
"""

import json
import csv
import os
from datetime import datetime
import sys

def save_order_to_csv(order_data):
    """
    حفظ الطلب في ملف CSV
    """
    csv_file = 'data/orders.csv'
    
    # تأكد من وجود مجلد data
    os.makedirs('data', exist_ok=True)
    
    # اقرأ البيانات الموجودة أو أنشئ ملف جديد
    file_exists = os.path.isfile(csv_file)
    
    with open(csv_file, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'رقم الطلب',
            'الاسم',
            'الهاتف',
            'المدينة',
            'المنتجات',
            'الإجمالي',
            'التاريخ',
            'وقت الحفظ'
        ])
        
        # اكتب الـ header إذا كان الملف جديد
        if not file_exists:
            writer.writeheader()
        
        # اكتب البيانات
        writer.writerow({
            'رقم الطلب': order_data.get('orderId', ''),
            'الاسم': order_data.get('fullName', ''),
            'الهاتف': order_data.get('phone', ''),
            'المدينة': order_data.get('city', ''),
            'المنتجات': order_data.get('items', ''),
            'الإجمالي': order_data.get('total', ''),
            'التاريخ': order_data.get('date', ''),
            'وقت الحفظ': datetime.now().isoformat()
        })
    
    print(f'✅ Order {order_data.get("orderId")} saved to CSV')
    return True

def main():
    """
    معالج الطلب الرئيسي
    """
    try:
        # اقرأ البيانات من stdin
        data = sys.stdin.read()
        order_data = json.loads(data)
        
        # احفظ الطلب
        save_order_to_csv(order_data)
        
        return 0
    except Exception as e:
        print(f'❌ Error: {str(e)}')
        return 1

if __name__ == '__main__':
    sys.exit(main())
