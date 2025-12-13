/**
 * API Handler - Save Orders to GitHub
 * Deploy on: Vercel, Netlify, or Val.com
 */

const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    try {
        const { order } = req.body;
        if (!order) return res.status(400).json({ error: 'No order data' });
        
        console.log(`📝 Saving order: ${order.orderId}`);
        
        const OWNER = 'sherow1982';
        const REPO = 'emirates-gifts';
        const TOKEN = process.env.GITHUB_TOKEN;
        
        // Save JSON
        const filename = `orders/${order.orderId.replace('#', '')}-${Date.now()}.json`;
        const content = Buffer.from(JSON.stringify(order, null, 2)).toString('base64');
        
        await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `📄 New order: ${order.orderId}`,
                    content: content
                })
            }
        );
        
        // Update CSV
        const csvRow = `${order.orderId},${order.fullName},${order.phone},${order.city},"${order.items}",${order.total},${order.date}`;
        const csvFile = 'orders/new-orders.csv';
        
        let sha = null;
        let csvContent = '';
        
        try {
            const getRes = await fetch(
                `https://api.github.com/repos/${OWNER}/${REPO}/contents/${csvFile}`,
                { headers: { 'Authorization': `token ${TOKEN}` } }
            );
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
                csvContent = Buffer.from(data.content, 'base64').toString('utf-8');
            }
        } catch (e) {}
        
        const newCSV = csvContent + (csvContent ? '\n' : '') + csvRow;
        const csvEncoded = Buffer.from(newCSV).toString('base64');
        
        await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${csvFile}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `📄 Add order row`,
                    content: csvEncoded,
                    sha: sha
                })
            }
        );
        
        return res.status(200).json({
            success: true,
            orderId: order.orderId,
            message: 'تم حفظ الطلب بنجاح'
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        return res.status(500).json({ error: error.message });
    }
};