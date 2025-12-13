/**
 * Webhook Handler - Run on Val.com or Vercel
 * Deploy: val.run or vercel
 */

const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // وقاية
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { action, order, csvRow } = req.body;
        
        if (action !== 'save_order' || !order || !csvRow) {
            return res.status(400).json({ error: 'Invalid data' });
        }
        
        console.log(`📅 Saving order: ${order.orderId}`);
        
        // 1. حفظ JSON على GitHub
        await saveOrderJSON(order);
        console.log(`✅ JSON saved: ${order.orderId}`);
        
        // 2. تحديث CSV
        await updateCSV(csvRow);
        console.log(`✅ CSV updated`);
        
        // 3. الرد
        return res.status(200).json({
            success: true,
            orderId: order.orderId,
            message: 'حفظ بنجاح'
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * حفظ Order JSON
 */
async function saveOrderJSON(order) {
    const OWNER = 'sherow1982';
    const REPO = 'emirates-gifts';
    const TOKEN = process.env.GITHUB_TOKEN;
    
    const filename = `orders/${order.orderId.replace('#', '')}-${Date.now()}.json`;
    const content = Buffer.from(JSON.stringify(order, null, 2)).toString('base64');
    
    const response = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `📅 New order: ${order.orderId}`,
                content: content
            })
        }
    );
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`GitHub API error: ${error.message}`);
    }
}

/**
 * تحديث CSV
 */
async function updateCSV(csvRow) {
    const OWNER = 'sherow1982';
    const REPO = 'emirates-gifts';
    const TOKEN = process.env.GITHUB_TOKEN;
    const FILE = 'orders/new-orders.csv';
    
    // قراءة CSV الحالي
    let sha = null;
    let currentContent = '';
    
    try {
        const getResponse = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`,
            {
                headers: {
                    'Authorization': `token ${TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        if (getResponse.ok) {
            const data = await getResponse.json();
            sha = data.sha;
            currentContent = Buffer.from(data.content, 'base64').toString('utf-8');
        }
    } catch (e) {
        console.log('⚠️ CSV file not found, will create new');
    }
    
    // إضافة السطر الجديد
    const newContent = currentContent + (currentContent ? '\n' : '') + csvRow;
    const content = Buffer.from(newContent).toString('base64');
    
    // رفع
    const updateResponse = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `📄 Add order row`,
                content: content,
                sha: sha
            })
        }
    );
    
    if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(`CSV update failed: ${error.message}`);
    }
}
