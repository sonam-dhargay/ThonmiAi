
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_PROMPT, TIBETAN_STRINGS } from "../constants";
import { Tone } from "../types";

/**
 * Creates a fresh instance of the Gemini API client.
 * Using a function to ensure we always pick up the latest API_KEY from the environment.
 */
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const getToneInstruction = (tone: Tone): string => {
  switch (tone) {
    case 'formal':
      return "Ensure your response is very formal, using proper Tibetan honorifics (Zhe-sa).";
    case 'informal':
      return "Use informal, conversational Tibetan (Phal-skad), as if talking to a friend.";
    case 'humorous':
      return "Use a humorous and witty tone while responding in Tibetan.";
    case 'neutral':
    default:
      return "Use a clear, standard, and modern Tibetan tone.";
  }
};

/**
 * Model definitions based on guidelines.
 */
const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const handleApiError = (error: any) => {
  const msg = error?.message || "";
  // Check for permission denied or project not found which requires key re-selection
  if (msg.includes("PERMISSION_DENIED") || msg.includes("403") || msg.includes("Requested entity was not found")) {
    throw new Error("PERMISSION_DENIED");
  }
  throw error;
};

export const generateTibetanResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  tone: Tone = 'neutral'
): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt + "\n\n(Instruction: " + getToneInstruction(tone) + ")" }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    return response.text || TIBETAN_STRINGS.errorAiResponse;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return handleApiError(error);
  }
};

export const generateStreamTibetanResponse = async function* (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  tone: Tone = 'neutral'
) {
  const ai = getAIClient();
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model: TEXT_MODEL,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt + "\n\n(Instruction: " + getToneInstruction(tone) + ")" }] }
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
  } catch (error: any) {
    console.error("Gemini API Stream Error:", error);
    const msg = error?.message || "";
    if (msg.includes("PERMISSION_DENIED") || msg.includes("403") || msg.includes("Requested entity was not found")) {
      yield "PERMISSION_DENIED";
    } else {
      throw error;
    }
  }
};

/**
 * Generates a concise title for a chat session in Tibetan.
 */
export const generateChatTitle = async (firstPrompt: string): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `Generate a very short, concise title (maximum 4-5 words) in Tibetan Unicode for a chat session that begins with this request: "${firstPrompt}". Respond only with the Tibetan text, no translation or explanation.`,
      config: {
        systemInstruction: "You are a helpful assistant that summarizes user intents into short Tibetan titles.",
        temperature: 0.5,
      },
    });
    return response.text?.trim() || firstPrompt.slice(0, 20);
  } catch (error: any) {
    console.error("Title generation failed:", error);
    const msg = error?.message || "";
    if (msg.includes("PERMISSION_DENIED") || msg.includes("403") || msg.includes("Requested entity was not found")) {
      return "PERMISSION_DENIED";
    }
    return firstPrompt.slice(0, 20);
  }
};

/**
 * Detects if the user wants to generate an image based on keywords.
 */
export const isImageRequest = (text: string): boolean => {
  const imageKeywords = [
    'པར', 'draw', 'generate image', 'picture', 'image of', 'པར་རིས་', 
    'བྲིས་', 'བཟོ', 'སྐྲུན་', 'བྲིས་ཤིག', 'བཟོས་ཤིག'
  ];
  return imageKeywords.some(kw => text.toLowerCase().includes(kw));
};

/**
 * Generates an image based on a prompt.
 */
export const generateImage = async (prompt: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
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
  } catch (error: any) {
    console.error("Image generation failed:", error);
    const msg = error?.message || "";
    if (msg.includes("PERMISSION_DENIED") || msg.includes("403") || msg.includes("Requested entity was not found")) {
      throw new Error("PERMISSION_DENIED");
    }
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
      model: TEXT_MODEL,
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
  } catch (error: any) {
    console.error("Failed to fetch dynamic prompts:", error);
    return TIBETAN_STRINGS.examplePrompts;
  }
};
