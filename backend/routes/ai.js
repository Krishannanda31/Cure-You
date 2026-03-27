const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are CureYou AI, a helpful health companion for patients in Faridabad, India.
You help users with:
- Understanding symptoms and which type of doctor to see
- Explaining lab test results in plain, simple language (Hindi/English/Hinglish is fine)
- Comparing medicine options and explaining generic vs branded alternatives
- Answering questions about healthcare in India
- Providing first-aid guidance for emergencies

IMPORTANT RULES:
- Always recommend seeing a doctor for serious symptoms — never replace professional medical advice
- Be warm, direct, and speak like a knowledgeable friend — not a cold medical robot
- Use Hinglish naturally if the user does (mix of Hindi and English)
- Keep responses concise and actionable
- For emergencies (chest pain, stroke, severe breathing issues), ALWAYS say call 108 immediately
- You know about Faridabad hospitals: Amrita Hospital (Sector 88), Fortis Escorts (NIT), Metro Heart Institute (Sector 16A), Sarvodaya Hospital (Sector 8), Asian Institute of Medical Sciences (Sector 21A)

Start each response with the most important information first.`;

router.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json({ reply: 'CureYou AI is not configured yet. Please add your ANTHROPIC_API_KEY to the .env file.' });
  }

  try {
    const messages = [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: 'AI service error', details: err.message });
  }
});

module.exports = router;
