require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// In-memory usage tracking for the free plan
const freePlanUsage = {}; // { userId: { count: number, date: 'YYYY-MM-DD' } }

// OpenAI client setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Endpoints ---

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Ask Birbal API!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { userId, plan, message } = req.body;

  if (!userId || !plan || !message) {
    return res.status(400).json({ error: 'Missing required fields: userId, plan, message' });
  }

  console.log(`[Request] User: ${userId}, Plan: ${plan}, Questions: ${freePlanUsage[userId] ? freePlanUsage[userId].count + 1 : 1}`);

  // --- Plan & Rate Limiting ---
  if (plan === 'free') {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const userData = freePlanUsage[userId];

    if (userData && userData.date === today) {
      if (userData.count >= 3) {
        return res.status(429).json({ error: 'You have reached your daily limit of 3 questions.' });
      }
      userData.count++;
    } else {
      // First question of the day or a new day
      freePlanUsage[userId] = { count: 1, date: today };
    }
  }
  // For premium plans, no limit is enforced.

    try {
    // --- Real OpenAI API Call ---
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Ask Birbal, a helpful AI mentor for CBSE students and parents. Answer clearly, politely, and to the point." },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message });
  }

});

// --- Server ---

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});