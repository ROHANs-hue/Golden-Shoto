
import { GoogleGenAI, Type } from "@google/genai";
import { BeltColor, Question } from "./types.ts";

export const generateQuiz = async (belt: BeltColor): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Act as a Sensei for Golden Shoto Karate Academy. 
  Generate 5 high-quality multiple choice questions for a student at the ${belt} belt level.
  Focus on:
  - Technical Japanese terminology (e.g., Kihon, Kata, Kumite terms).
  - Proper stances (Dachi) and strikes (Uchi/Tsuki).
  - Dojo etiquette (Reiho) and philosophy (Dojo Kun).
  
  For every text field, provide both English and a natural Bengali translation.
  Difficulty level: Tailored specifically for ${belt} belt rank.
  Output MUST be in the specified JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              questionBengali: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 options in English"
              },
              optionsBengali: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 options in Bengali"
              },
              correctAnswer: { 
                type: Type.INTEGER,
                description: "Index of the correct answer (0-3)"
              },
              explanation: { type: Type.STRING },
              explanationBengali: { type: Type.STRING }
            },
            required: ["question", "questionBengali", "options", "optionsBengali", "correctAnswer", "explanation", "explanationBengali"]
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    if (!jsonStr) throw new Error("Empty response from Sensei");
    return JSON.parse(jsonStr) as Question[];
  } catch (error) {
    console.error("Dojo API Error:", error);
    throw new Error("The Sensei is currently meditating. Please try again shortly.");
  }
};
