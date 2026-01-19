
import { GoogleGenAI, Type } from "@google/genai";
import { BeltColor, Question, DojoSettings } from "./types.ts";

const DEFAULT_INSTRUCTION = `Act as a Karate Sensei for Golden Shoto Academy.
Generate exactly 5 multiple choice questions for a student at the {BELT} belt rank.
Test knowledge of technical stances (Dachi), strikes (Uchi/Tsuki), terminology, and Dojo etiquette.
Every text field must include an English version and a Bengali translation.
Return exactly 5 questions in a JSON array.`;

export const testApiKey = async (key: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
      config: { maxOutputTokens: 5 }
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const generateQuiz = async (belt: BeltColor, userApiKey?: string): Promise<Question[]> => {
  const apiKey = userApiKey || process.env.API_KEY;
  const isPersonal = !!userApiKey;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("Dojo API Error: No Security Key found. Please add your own Gemini API Key in 'Configure AI Key'.");
  }

  const savedSettings = localStorage.getItem('dojo_settings');
  const settings: DojoSettings = savedSettings ? JSON.parse(savedSettings) : {
    model: 'gemini-3-flash-preview',
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
      maxOutputTokens: settings.maxOutputTokens || 2048,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            questionBengali: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
            optionsBengali: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
            correctAnswer: { type: Type.INTEGER },
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
      model: settings.model || 'gemini-3-flash-preview',
      contents: finalPrompt,
      config: config
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Sensei is silent (Empty response)");
    
    return JSON.parse(resultText) as Question[];
  } catch (error: any) {
    console.error("Master Sensei API Error:", error);
    const msg = error.message || "";
    
    if (msg.includes("429")) {
      throw new Error(`Rate Limit Hit: The ${isPersonal ? 'Personal' : 'Academy'} API key is exhausted. Please wait 60 seconds.`);
    } else if (msg.includes("401") || msg.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key: The key provided is incorrect. Please check your AI Configuration.");
    } else if (msg.includes("403")) {
      throw new Error("Permission Denied: This API key does not have access to Gemini models.");
    }
    
    throw new Error(msg || "The Dojo connection was interrupted. Please verify your internet and API settings.");
  }
};
