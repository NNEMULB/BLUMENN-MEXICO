
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateDesignImage = async (prompt: string, variant: string = ""): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: `Luxury high-end fashion T-shirt graphic design. ${prompt}. ${variant}. 
            Style: Exquisite 3D heavy-density embroidery on premium black cotton fabric. 
            Details: Intricate stitching patterns, metallic silver and deep ruby silk threads, raised textures, baroque and gothic luxury aesthetics. 
            Composition: Masterpiece center piece, high-fashion streetwear, clean black background. 
            Lighting: Professional studio product lighting emphasizing textile texture. 8k resolution, professional atelier quality.`
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('Embroidery session failed');
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error('Needlework data not found');
  } catch (error) {
    console.error('Atelier Error:', error);
    throw error;
  }
};
