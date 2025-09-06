import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Search,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";
import { agentService } from "../services/agentService";

const ChatSidebar = ({ editorRef }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hi! I'm your AI assistant. Still working on the real AI integration, but I can help with basic stuff for now.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Use real AI agent service
      const aiResponse = await agentService.processTask(inputValue, editorRef);

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        action: aiResponse.action, // 'chat', 'edit', 'search'
        data: aiResponse.data,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI error:", error);
      // quick error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          content: "Oops, something went wrong. Try again?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // This function is now handled by agentService
  // Keeping for backward compatibility
  const generateAIResponse = async (userInput) => {
    return await agentService.processTask(userInput, editorRef);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageIcon = (type) => {
    if (type === "ai") return <Bot size={16} className="text-blue-600" />;
    return <User size={16} className="text-gray-600" />;
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "search":
        return <Search size={14} className="text-green-600" />;
      case "edit":
        return <FileText size={14} className="text-purple-600" />;
      default:
        return <Sparkles size={14} className="text-blue-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-blue-600" />
          <h2 className="font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Ask me anything or select text to edit
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "ai" && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {getMessageIcon(message.type)}
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.action && (
                    <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
                      {getActionIcon(message.action)}
                      <span className="capitalize">{message.action}</span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.type === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>

            {message.type === "user" && (
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {getMessageIcon(message.type)}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything or request help with your writing..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          💡 Try: "Improve my grammar", "Search for React news", or "Create a
          table"
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
