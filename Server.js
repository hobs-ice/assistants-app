
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log("=== GROQ DEBUG ===");

console.log({
  exists: !!process.env.GROQ_API_KEY,
  length: process.env.GROQ_API_KEY?.length,
  preview: process.env.GROQ_API_KEY?.slice(0, 10),
  raw: JSON.stringify(process.env.GROQ_API_KEY)
});


console.log('GROQ KEY:', GROQ_API_KEY ? 'présente' : 'ABSENTE');
app.post('/api/claude', async (req, res) => {
  console.log('📨 Requête reçue');
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: req.body.messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    const data = await response.json();
    console.log('✅ Réponse Groq reçue');
    const text = data.choices?.[0]?.message?.content || data.error?.message || 'Erreur Groq';
res.json({ content: [{ text }] });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/test', (req, res) => {
  res.json({ message: 'OK' });
});


const ALPHA_KEY = process.env.ALPHA_VANTAGE_KEY || 'ta_cle_ici';
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.params.symbol}&apikey=${ALPHA_KEY}`
    );
    const data = await response.json();
    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      return res.status(404).json({ error: 'Symbole non trouvé' });
    }
    res.json({
      nom: req.params.symbol,
      prix: parseFloat(quote['05. price']),
      variation: parseFloat(quote['10. change percent']),
      ouverture: parseFloat(quote['02. open']),
      haut: parseFloat(quote['03. high']),
      bas: parseFloat(quote['04. low']),
      devise: 'USD',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/music', async (req, res) => {
  try {
    const { term, type } = req.query;
    let url;
    if (type === 'charts') {
      url = `https://itunes.apple.com/fr/rss/topsongs/limit=20/json`;
    } else if (type === 'albums') {
      url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=album&limit=10&country=fr`;
    } else {
      url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=20&country=fr`;
    }
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/games', async (req, res) => {
  try {
    const { search, category } = req.query;
    let url = 'https://www.freetogame.com/api/games';
    if (category && category !== 'all') url += `?category=${category}`;
    const response = await fetch(url);
    const data = await response.json();
    if (search) {
      const filtered = data.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.genre.toLowerCase().includes(search.toLowerCase())
      );
      return res.json(filtered.slice(0, 10));
    }
    res.json(data.slice(0, 20));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/legifrance', async (req, res) => {
  try {
    const response = await fetch('https://api.piste.gouv.fr/dila/legifrance/lf-engine-app/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer TA_CLE_LEGIFRANCE`,
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3002, () => console.log('✅ Serveur Groq démarré sur port 3002'));