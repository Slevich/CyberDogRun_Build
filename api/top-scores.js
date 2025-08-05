export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?select=name,score,created_at&order=score.desc&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const error = await response.text();
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch top scores' });
    }
  } catch (err) {
    console.error('Connection error:', err);
    res.status(500).json({ error: 'Connection failed' });
  }
}