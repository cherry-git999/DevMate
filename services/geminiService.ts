import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini chat session using a current Gemini model.
 */
export const createChatSession = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  // Gemini SDK expects the API key as a string and chat is started from a model.
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    // Use a currently supported Gemini model.
    // If this still errors, try another supported model from ListModels.
    model: "gemini-2.5-flash",
  });

  return model.startChat({
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });
};

export const sendMessageOnce = async (
  chat: any,
  message: string
): Promise<string> => {
  const result = await chat.sendMessage(message);
  return result.response.text();
};
