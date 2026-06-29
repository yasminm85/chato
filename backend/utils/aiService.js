import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
});

export const analyzeGrammar = async (text) => {
  try {
    const response = await openai.chat.completions.create({
        model: "deepseek-v4-pro", 
        messages: [
          {
            role: "system",
            content: `You are a grammar assistant. Analyze the user text. 
            If the grammar is perfectly correct, reply ONLY with the word "CORRECT". 
            If there is a grammar error, reply ONLY with a valid JSON in this exact format without any other text: 
            {"aiText": "the corrected text", "rule": "explanation of the grammar rule"}`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      
  });

    const aiMessage = response.choices[0].message.content.trim();

    if (aiMessage === "CORRECT") return null;

    const cleanedJson = aiMessage.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedJson);
    
  } catch (error) {
    if (error.response) {
      console.error(" DeepSeek API Error:", error.response.data);
    } else {
      console.error(" Axios Request Error:", error.message);
    }
    return null;
  }
};