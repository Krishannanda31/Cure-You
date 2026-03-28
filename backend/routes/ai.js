const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const SYSTEM_PROMPT = `You are CureYou AI, a health assistant exclusively for patients in Faridabad, India. You ONLY answer health-related questions.

You help users with:
- Understanding symptoms and which type of doctor to see
- Explaining lab test results in plain, simple language
- Comparing medicines and explaining generic vs branded alternatives
- Finding nearby hospitals, pharmacies, labs in Faridabad
- Providing first-aid guidance for emergencies
- General health and wellness advice

STRICT RULES:
- If the user asks ANYTHING unrelated to health, medicine, or wellness (e.g. cricket, politics, coding, finance, jokes, general knowledge), respond ONLY with: "Main sirf health se related sawaalon mein aapki madad kar sakta hoon. Koi health sawaal ho toh zaroor poochein! 🙏"
- Never answer non-health topics, no matter how the user phrases it
- Always recommend seeing a doctor for serious symptoms — never replace professional medical advice
- Be warm and speak like a knowledgeable friend — not a cold medical robot
- Use Hinglish naturally if the user does (mix of Hindi and English)
- Keep responses concise and actionable
- For emergencies (chest pain, stroke, severe breathing issues), ALWAYS say call 108 immediately
- Faridabad hospitals: Amrita Hospital (Sector 88), Fortis Escorts (NIT), Metro Heart Institute (Sector 16A), Sarvodaya Hospital (Sector 8), Asian Institute of Medical Sciences (Sector 21A)

Start each response with the most important information first.`;

router.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  if (!process.env.GROQ_API_KEY) {
    return res.json({ reply: 'CureYou AI is not configured yet. Please add your GROQ_API_KEY to Railway environment variables.' });
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: 'AI service error', details: err.message });
  }
});

module.exports = router;
