/**
 * Script to update orders XLSX file from JSON backups
 * With red color for new orders, black for viewed
 * Run with: node scripts/update-orders-xlsx.js
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ORDERS_JSON_DIR = path.join(__dirname, '../orders');
const OUTPUT_FILE = path.join(__dirname, '../orders/new-orders.xlsx');

/**
 * Read all order JSON files
 */
function getAllOrderFiles() {
    const files = fs.readdirSync(ORDERS_JSON_DIR).filter(f => 
        f.endsWith('.json') && f !== 'orders.json'
    );
    return files.map(f => ({
        name: f,
        path: path.join(ORDERS_JSON_DIR, f),
        data: JSON.parse(fs.readFileSync(path.join(ORDERS_JSON_DIR, f), 'utf8'))
    }));
}

/**
 * Create or update XLSX
 */
async function updateXLSX() {
    console.log('📋 Reading orders from JSON files...');
    const orderFiles = getAllOrderFiles();
    
    if (orderFiles.length === 0) {
        console.log('⚠️  No order files found');
        return;
    }
    
    // Create new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('الطلبات الجديدة');
    
    // Set up columns
    worksheet.columns = [
        { header: 'رقم الطلب', key: 'orderId', width: 15 },
        { header: 'الاسم', key: 'fullName', width: 20 },
        { header: 'الهاتف', key: 'phone', width: 15 },
        { header: 'المدينة', key: 'city', width: 12 },
        { header: 'المنتجات', key: 'items', width: 30 },
        { header: 'الإجمالي', key: 'total', width: 10 },
        { header: 'التاريخ', key: 'date', width: 18 },
        { header: 'الحالة', key: 'status', width: 10 }
    ];
    
    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2a5298' }
    };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };
    
    // Add order rows
    orderFiles.forEach((file, index) => {
        const order = file.data;
        const row = worksheet.addRow({
            orderId: order.orderId,
            fullName: order.fullName,
            phone: order.phone,
            city: order.city,
            items: order.items,
            total: order.total,
            date: order.date,
            status: order.isNew ? '🆕 جديد' : '✅ معالج'
        });
        
        // Red color for new orders
        if (order.isNew) {
            row.font = { color: { argb: 'FFFF5252' }, bold: true };
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFE0E0' }
            };
        } else {
            row.font = { color: { argb: 'FF000000' } };
        }
        
        row.alignment = { horizontal: 'right', vertical: 'center', wrapText: true };
    });
    
    // Save file
    await workbook.xlsx.writeFile(OUTPUT_FILE);
    console.log(`✅ XLSX file saved: ${OUTPUT_FILE}`);
    console.log(`📊 Total orders: ${orderFiles.length}`);
}

// Run
updateXLSX().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});