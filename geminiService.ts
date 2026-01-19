
import { GoogleGenAI, Type } from "@google/genai";
import { BeltColor, Question, DojoSettings } from "./types.ts";

const DEFAULT_INSTRUCTION = `Act as a Karate Sensei for Golden Shoto Academy.
Generate exactly 5 multiple choice questions for a student at the {BELT} belt rank.
Test knowledge of technical stances (Dachi), strikes (Uchi/Tsuki), terminology, and Dojo etiquette.
Every text field must include an English version and a Bengali translation.
Return exactly 5 questions in a JSON array.`;

export const generateQuiz = async (belt: BeltColor, userApiKey?: string): Promise<Question[]> => {
  // Prioritize the student's personal API key, then fallback to environment variable
  const apiKey = userApiKey || process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("Dojo API Error: No Security Key found. Please add your own Gemini API Key in 'Sensei Settings' or contact your Sensei.");
  }

  // Retrieve custom settings or use defaults
  const savedSettings = localStorage.getItem('dojo_settings');
  const settings: DojoSettings = savedSettings ? JSON.parse(savedSettings) : {
    model: 'gemini-3-pro-preview',
    systemInstruction: DEFAULT_INSTRUCTION,
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    useGoogleSearch: false
  };

  const ai = new GoogleGenAI({ apiKey });
  const finalPrompt = settings.systemInstruction.replace('{BELT}', belt);

  try {
    const config: any = {
      temperature: settings.temperature || 0.7,
      topP: settings.topP,
      topK: settings.topK,
      maxOutputTokens: settings.maxOutputTokens,
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
              minItems: 4,
              maxItems: 4
            },
            optionsBengali: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4
            },
            correctAnswer: { 
              type: Type.INTEGER,
              description: "Index 0-3"
            },
            explanation: { type: Type.STRING },
            explanationBengali: { type: Type.STRING }
          },
          required: ["question", "questionBengali", "options", "optionsBengali", "correctAnswer", "explanation", "explanationBengali"]
        }
      }
    };

    if (settings.useGoogleSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-pro-preview',
      contents: finalPrompt,
      config: config
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Sensei is silent (Empty API response)");
    
    return JSON.parse(resultText) as Question[];
  } catch (error: any) {
    console.error("Master Sensei API Error:", error);
    if (error.message?.includes("429")) {
      throw new Error("Free Tier Rest: Please wait 60 seconds for the next session or use your own API Key.");
    }
    throw new Error(error.message || "The Dojo connection was interrupted. Please verify your API Key.");
  }
};
