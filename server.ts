import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Route for AI Box Counting
  app.post("/api/ai/analyze-boxes", async (req, res) => {
    try {
      const { imageData, mimeType } = req.body;

      if (!imageData) {
        return res.status(400).json({ error: "No image data provided" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                text: "Analyze this image and count how many boxes (caixas) or packages are present. Return ONLY a JSON object with a 'count' field. Example: { \"count\": 5 }. If no boxes are found, return { \"count\": 0 }."
              },
              {
                inlineData: {
                  mimeType: mimeType || "image/jpeg",
                  data: imageData.split(',')[1] || imageData
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{"count": 0}');
      res.json(result);
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to analyze image", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
