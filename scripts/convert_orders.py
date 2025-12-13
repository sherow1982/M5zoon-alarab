#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Emirates Gifts - Convert Orders JSONL to Excel
"""

import json
import pandas as pd
import os
from pathlib import Path

def convert_orders_to_excel():
    """
    تحويل orders.jsonl إلى Excel
    """
    # المسارات
    input_file = Path('data/orders.jsonl')
    output_file = Path('data/Orders.xlsx')
    
    # تأكد من وجود الملف
    if not input_file.exists():
        print(f'❌ File not found: {input_file}')
        return False
    
    try:
        # اقرأ JSONL
        orders = []
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    try:
                        order = json.loads(line)
                        orders.append(order)
                    except json.JSONDecodeError as e:
                        print(f'⚠️  Failed to parse line: {e}')
                        continue
        
        if not orders:
            print('⚠️  No orders found in file')
            return False
        
        # نقل إلى DataFrame
        df = pd.DataFrame(orders)
        
        # ترتيب الأعمدة
        cols = ['orderId', 'fullName', 'phone', 'city', 'items', 'total', 'date', 'savedAt']
        existing_cols = [c for c in cols if c in df.columns]
        df = df[existing_cols]
        
        # أسماء عربية للأعمدة
        column_names = {
            'orderId': 'رقم الطلب',
            'fullName': 'الاسم',
            'phone': 'الهاتف',
            'city': 'المدينة',
            'items': 'المنتجات',
            'total': 'الإجمالي',
            'date': 'التاريخ',
            'savedAt': 'وقت الحفظ'
        }
        
        df.rename(columns=column_names, inplace=True)
        
        # تأكد من وجود المجلد
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # احفظ كـ Excel
        df.to_excel(output_file, index=False, sheet_name='الطلبيات', engine='openpyxl')
        
        print(f'✅ Excel file created: {output_file}')
        print(f'📊 Total orders: {len(df)}')
        print(f'📋 Columns: {list(df.columns)}')
        
        return True
        
    except Exception as e:
        print(f'❌ Error: {str(e)}')
        return False

if __name__ == '__main__':
    success = convert_orders_to_excel()
    exit(0 if success else 1)
