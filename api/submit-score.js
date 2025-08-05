export default async function handler(req, res) 
{
    const allowedOrigins = 
    [
        'https://cyber-dog-run.vercel.app',
        'https://cyber-dog-run-git-main-slevichs-projects.vercel.app'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) 
    {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') 
    {
        return res.status(200).end();
    }

    if (req.method !== 'POST') 
    {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, score } = req.body;

    if (!name || score === undefined || score < 0 || name.trim().length === 0) 
    {
        return res.status(400).json({ error: 'Invalid data: name and score are required' });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;
    const cleanName = name.trim().substring(0, 50);

    try 
    {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/scores`, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({ name, score })
        });

        if (response.ok) 
        {
            res.status(200).json({ success: true, message: 'Score submitted successfully' });
        } 
        else 
        {
            const error = await response.text();
            res.status(500).json({ error: 'Failed to save score', details: error });
        }
    } 
    catch (err) 
    {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
}