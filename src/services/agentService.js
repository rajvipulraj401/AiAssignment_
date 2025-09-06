// Agent Service for handling complex multi-step tasks
import { aiService } from "./aiService";
import { searchService } from "./searchService";

export const agentService = {
  // Main agent function that handles complex tasks
  async processTask(userInput, editorRef = null) {
    try {
      const lowerInput = userInput.toLowerCase();

      // Check if it's a search and insert task
      if (this.isSearchAndInsertTask(lowerInput)) {
        return await this.handleSearchAndInsert(userInput, editorRef);
      }

      // Check if it's a content generation task
      if (this.isContentGenerationTask(lowerInput)) {
        return await this.handleContentGeneration(userInput, editorRef);
      }

      // Default to regular AI response
      return await aiService.generateChatResponse(userInput);
    } catch (error) {
      console.error("Agent Error:", error);
      return {
        content:
          "I encountered an error while processing your request. Please try again.",
        action: "error",
        data: null,
      };
    }
  },

  // Check if task involves search and insert
  isSearchAndInsertTask(input) {
    const searchKeywords = ["search", "find", "latest", "news", "information"];
    const insertKeywords = ["insert", "add", "put", "write", "create"];

    return (
      searchKeywords.some((keyword) => input.includes(keyword)) &&
      insertKeywords.some((keyword) => input.includes(keyword))
    );
  },

  // Check if task involves content generation
  isContentGenerationTask(input) {
    const contentKeywords = ["write", "create", "generate", "make", "draft"];
    const contentTypes = [
      "article",
      "summary",
      "report",
      "document",
      "content",
    ];

    return (
      contentKeywords.some((keyword) => input.includes(keyword)) &&
      contentTypes.some((keyword) => input.includes(keyword))
    );
  },

  // Handle search and insert tasks
  async handleSearchAndInsert(userInput, editorRef) {
    try {
      // Extract search query from user input
      const searchQuery = this.extractSearchQuery(userInput);

      // Perform web search
      const searchResults = await searchService.searchWeb(searchQuery);

      if (!searchResults.success) {
        return {
          content: "I couldn't perform the search. Please try again.",
          action: "error",
          data: null,
        };
      }

      // Generate summary using AI
      const summaryPrompt = `Based on these search results, create a concise summary:\n\n${searchService.formatSearchResults(
        searchResults
      )}`;
      const aiResponse = await aiService.generateChatResponse(summaryPrompt);

      // If editor reference is provided, insert the content
      if (editorRef && editorRef.current) {
        const summary = aiResponse.content;
        editorRef.current
          .chain()
          .focus()
          .insertContent(
            `\n\n## Search Results: ${searchQuery}\n\n${summary}\n\n`
          )
          .run();
      }

      return {
        content: `I found information about "${searchQuery}" and ${
          editorRef
            ? "inserted a summary into the editor"
            : "here are the results"
        }:\n\n${aiResponse.content}`,
        action: "search",
        data: {
          query: searchQuery,
          results: searchResults.results,
          inserted: !!editorRef,
        },
      };
    } catch (error) {
      console.error("Search and Insert Error:", error);
      return {
        content:
          "I encountered an error while searching and inserting content. Please try again.",
        action: "error",
        data: null,
      };
    }
  },

  // Handle content generation tasks
  async handleContentGeneration(userInput, editorRef) {
    try {
      // Generate content using AI
      const aiResponse = await aiService.generateChatResponse(userInput);

      // If editor reference is provided, insert the content
      if (editorRef && editorRef.current) {
        editorRef.current
          .chain()
          .focus()
          .insertContent(`\n\n${aiResponse.content}\n\n`)
          .run();
      }

      return {
        content: `I've generated content for you${
          editorRef ? " and inserted it into the editor" : ""
        }:\n\n${aiResponse.content}`,
        action: "edit",
        data: {
          generated: true,
          inserted: !!editorRef,
        },
      };
    } catch (error) {
      console.error("Content Generation Error:", error);
      return {
        content:
          "I encountered an error while generating content. Please try again.",
        action: "error",
        data: null,
      };
    }
  },

  // Extract search query from user input
  extractSearchQuery(input) {
    // Simple extraction - look for text after search keywords
    const searchPatterns = [
      /search for (.+)/i,
      /find (.+)/i,
      /latest news on (.+)/i,
      /information about (.+)/i,
    ];

    for (const pattern of searchPatterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // Fallback: return the input without common words
    return input
      .replace(/\b(search|find|latest|news|on|about|for)\b/gi, "")
      .trim();
  },
};

export default agentService;
