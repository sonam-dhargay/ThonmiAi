
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_PROMPT, TIBETAN_STRINGS } from "../constants";

/**
 * Creates a fresh instance of the Gemini API client.
 */
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTibetanResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    return response.text || TIBETAN_STRINGS.errorAiResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateStreamTibetanResponse = async function* (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
) {
  const ai = getAIClient();
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Stream Error:", error);
    throw error;
  }
};

/**
 * Detects if the user wants to generate an image based on keywords.
 * Expanded with more Tibetan keywords.
 */
export const isImageRequest = (text: string): boolean => {
  const imageKeywords = [
    'པར', 'draw', 'generate image', 'picture', 'image of', 'པར་རིས', 
    'བྲིས', 'བཟོ', 'སྐྲུན', 'བྲིས་ཤིག', 'བཟོས་ཤིག'
  ];
  return imageKeywords.some(kw => text.toLowerCase().includes(kw));
};

/**
 * Generates an image based on a prompt.
 * Uses gemini-2.5-flash-image for high quality generation from text.
 */
export const generateImage = async (prompt: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High resolution cinematic image of: ${prompt}. Interpret Tibetan terms accurately.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};

/**
 * Generates dynamic example prompts.
 */
export const getDynamicExamplePrompts = async (): Promise<string[]> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 4 diverse, creative, and useful example questions or prompts for a Tibetan AI assistant. These should cover science, history, culture, and daily life. Respond ONLY with a JSON array of 4 strings in Tibetan Unicode.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length >= 4) {
        return parsed.slice(0, 4);
      }
    }
    return TIBETAN_STRINGS.examplePrompts;
  } catch (error) {
    console.error("Failed to fetch dynamic prompts:", error);
    return TIBETAN_STRINGS.examplePrompts;
  }
};
