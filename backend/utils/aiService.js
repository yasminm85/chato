import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeGrammar = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a grammar assistant. Analyze: "${text}".
    If correct, reply "CORRECT". If error, JSON {"aiText": "...", "rule": "..."}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text().trim();

    if (aiMessage === "CORRECT") return null;
    return JSON.parse(aiMessage.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error("🚨 Gemini Error:", error);
    return null;
  }
};