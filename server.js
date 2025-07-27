// server.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.get('/test-gemini', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const result = await model.generateContent('Say hello');
    res.send(result.response.text());
  } catch (err) {
    console.error('Gemini test error:', err);
    res.status(500).send('Gemini test failed');
  }
});
app.post('/analyze-pothole', async (req, res) => {
  console.log("Received data:", req.body);
  try {
    const { sensorBuffer } = req.body;

    if (!sensorBuffer || !Array.isArray(sensorBuffer)) {
      return res.status(400).json({ error: "sensorBuffer must be an array" });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `
You are an AI model that detects potholes from smartphone accelerometer data.

### How to detect:
- Potholes cause a **sharp vertical Z-axis spike** (usually > 2.5g).
- X/Y values remain normal.
- Normal Z values are between 0.9g to 1.1g.

### Example 1 (pothole):
[
  { x: 0.01, y: 0.03, z: 0.98 },
  { x: 0.02, y: 0.01, z: 0.99 },
  { x: 0.03, y: 0.02, z: 3.2 },
  { x: 0.01, y: -0.01, z: 0.97 }
]
Answer: true

### Example 2 (normal):
[
  { x: 0.01, y: 0.02, z: 1.00 },
  { x: 0.01, y: 0.02, z: 1.03 },
  { x: 0.00, y: 0.01, z: 0.99 },
  { x: -0.01, y: 0.02, z: 1.00 }
]
Answer: false

### Example 3 (your data):
${JSON.stringify(sensorBuffer)}

Answer only "true" or "false".
`;

    const result = await model.generateContent([prompt]);
    const text = result.response.text().trim().toLowerCase();

    console.log("Gemini:", text);

    res.json({ confirmed: text.includes("true") });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Failed to analyze data with Gemini' });
  }
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
