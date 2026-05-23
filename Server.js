
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
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

app.listen(3002, () => console.log('✅ Serveur Groq démarré sur port 3002'));