
import { GoogleGenAI, Type } from "@google/genai";
import { BeltColor, Question } from "./types";

export const generateQuiz = async (belt: BeltColor): Promise<Question[]> => {
  // Always use a new instance to ensure the most up-to-date API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Generate 5 high-quality multiple choice questions for a Karate student at the ${belt} belt level.
  For every text field, provide both English and a natural Bengali translation.
  Focus on:
  - Technical Japanese terminology (e.g., Kihon, Kata, Kumite terms).
  - Proper stances (Dachi) and strikes (Uchi/Tsuki).
  - Dojo etiquette (Reiho) and philosophy (Dojo Kun).
  
  Tailor difficulty specifically for ${belt} belt rank. 
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
                description: "Array of 4 options in English",
              },
              optionsBengali: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 4 options in Bengali",
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
    return JSON.parse(jsonStr) as Question[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to meditate on the questions. Please try again.");
  }
};
