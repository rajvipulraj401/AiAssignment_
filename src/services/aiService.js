// AI Service for handling OpenAI API calls
import OpenAI from "openai";

// Get API key from localStorage or environment
const getApiKey = () => {
  return (
    localStorage.getItem("openai_api_key") ||
    import.meta.env.VITE_OPENAI_API_KEY
  );
};

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return null;
  }

  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Only for demo purposes
  });
};

export const aiService = {
  // Generate AI response for chat
  async generateChatResponse(message, context = "") {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return {
          content:
            "Please configure your OpenAI API key to use AI features. Click the settings button to add your API key.",
          action: "error",
          data: null,
        };
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI writing assistant. Help users with writing, editing, and content creation. 
            You can also search the web and modify editor content. Be helpful and concise.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        content: response.choices[0].message.content,
        action: this.determineAction(message),
        data: null,
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        content:
          "Sorry, I'm having trouble connecting to the AI service. Please check your API key.",
        action: "error",
        data: null,
      };
    }
  },

  // Generate AI response for text editing
  async generateEditResponse(text, action) {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        // Return mock response if no API key
        return this.getMockEditResponse(text, action);
      }

      const prompts = {
        improve: `Improve the grammar, clarity, and flow of this text while keeping the original meaning: "${text}"`,
        shorten: `Make this text more concise while keeping the main points: "${text}"`,
        expand: `Expand this text with more details and examples: "${text}"`,
        formal: `Rewrite this text in a more formal, professional tone: "${text}"`,
        casual: `Rewrite this text in a more casual, friendly tone: "${text}"`,
        table: `Convert this text into a well-formatted markdown table: "${text}"`,
      };

      const prompt = prompts[action] || `Process this text: "${text}"`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a text editing assistant. Provide only the edited text without explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.3,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error("AI Edit Error:", error);
      return text; // Return original text if error
    }
  },

  // Mock responses for when API key is not available
  getMockEditResponse(text, action) {
    const responses = {
      improve:
        text.charAt(0).toUpperCase() +
        text.slice(1) +
        ". (Improved - API key needed for real AI)",
      shorten:
        text
          .split(" ")
          .slice(0, Math.ceil(text.split(" ").length / 2))
          .join(" ") + "...",
      expand:
        text +
        " This is an expanded version with more details. (Mock response)",
      formal:
        text.charAt(0).toUpperCase() +
        text.slice(1) +
        ". (Formal tone - API key needed)",
      casual: "Hey! " + text.toLowerCase() + " 😊 (Mock response)",
      table: `| Topic | Content |\n|-------|----------|\n| 1 | ${text} |`,
    };
    return responses[action] || text;
  },

  // Determine action type from user message
  determineAction(message) {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("search") ||
      lowerMessage.includes("find") ||
      lowerMessage.includes("latest")
    ) {
      return "search";
    }
    if (
      lowerMessage.includes("improve") ||
      lowerMessage.includes("grammar") ||
      lowerMessage.includes("edit")
    ) {
      return "edit";
    }
    if (lowerMessage.includes("table") || lowerMessage.includes("format")) {
      return "edit";
    }

    return "chat";
  },
};

export default aiService;
