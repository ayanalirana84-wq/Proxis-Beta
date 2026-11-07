export default async function handler(req, res) {
  // Sirf POST requests allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message field is required' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server environment variable OPENROUTER_API_KEY missing' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com", 
        "X-Title": "My Secured AI App"
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5",
        messages: [
          { role: "system", content: "You are a helpful and concise assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'OpenRouter API Error' });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
