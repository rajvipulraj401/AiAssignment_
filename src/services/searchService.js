// Search Service for web search functionality
export const searchService = {
  // Search using DuckDuckGo Instant Answer API (free)
  async searchWeb(query) {
    try {
      // Using DuckDuckGo Instant Answer API
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(
          query
        )}&format=json&no_html=1&skip_disambig=1`
      );
      const data = await response.json();

      if (data.Abstract) {
        return {
          success: true,
          results: [
            {
              title: data.Heading || query,
              content: data.Abstract,
              url: data.AbstractURL || "",
              source: "DuckDuckGo",
            },
          ],
        };
      }

      // Fallback to basic search results
      return {
        success: true,
        results: [
          {
            title: `Search results for: ${query}`,
            content: `Found information about "${query}". This is a demo search result. In a real implementation, you would integrate with a more comprehensive search API.`,
            url: "",
            source: "Demo",
          },
        ],
      };
    } catch (error) {
      console.error("Search Error:", error);
      return {
        success: false,
        results: [
          {
            title: "Search Error",
            content: "Unable to perform web search. Please try again later.",
            url: "",
            source: "Error",
          },
        ],
      };
    }
  },

  // Format search results for display
  formatSearchResults(results) {
    if (!results.success || !results.results.length) {
      return "No search results found.";
    }

    let formatted = "**Search Results:**\n\n";
    results.results.forEach((result, index) => {
      formatted += `${index + 1}. **${result.title}**\n`;
      formatted += `${result.content}\n`;
      if (result.url) {
        formatted += `Source: ${result.url}\n`;
      }
      formatted += "\n";
    });

    return formatted;
  },
};

export default searchService;
