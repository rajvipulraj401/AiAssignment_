import React, { useState } from "react";
import {
  Wand2,
  Check,
  X,
  Type,
  Table,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { aiService } from "../services/aiService";

const FloatingToolbar = ({ selectedText, position, onClose, onEditWithAI }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const handleEditWithAI = async (action) => {
    try {
      console.log("AI action:", action, "text:", selectedText);

      // Use real AI service for text editing
      const response = await aiService.generateEditResponse(
        selectedText,
        action
      );
      setAiSuggestion(response);
      setShowPreview(true);
    } catch (error) {
      console.error("AI error:", error);
      // Fallback to mock response if AI fails
      const fallbackResponse = getMockResponse(action, selectedText);
      setAiSuggestion(fallbackResponse);
      setShowPreview(true);
    }
  };

  // TODO: implement real AI prompts
  const getPromptForAction = (action, text) => {
    // placeholder prompts for now
    return `Process this text: "${text}"`;
  };

  const getMockResponse = (action, text) => {
    // quick mock responses - will replace with real AI
    if (action === "improve") {
      return text.charAt(0).toUpperCase() + text.slice(1) + ". (Improved)";
    }
    if (action === "shorten") {
      const words = text.split(" ");
      return words.slice(0, Math.ceil(words.length / 2)).join(" ") + "...";
    }
    if (action === "expand") {
      return text + " This is an expanded version with more details.";
    }
    if (action === "formal") {
      return text.charAt(0).toUpperCase() + text.slice(1) + ". (Formal tone)";
    }
    if (action === "casual") {
      return "Hey! " + text.toLowerCase() + " 😊";
    }
    if (action === "table") {
      return `| Topic | Content |\n|-------|----------|\n| 1 | ${text} |`;
    }
    return text; // fallback
  };

  const handleConfirm = () => {
    onEditWithAI(aiSuggestion);
    setShowPreview(false);
    onClose();
  };

  const handleCancel = () => {
    setShowPreview(false);
    setAiSuggestion("");
  };

  return (
    <>
      {/* Floating Toolbar */}
      <div
        className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <button
          onClick={() => handleEditWithAI("improve")}
          className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
          title="Improve Grammar"
        >
          <Wand2 size={14} />
          <span>Improve</span>
        </button>

        <button
          onClick={() => handleEditWithAI("shorten")}
          className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
          title="Make Shorter"
        >
          <Minimize2 size={14} />
          <span>Shorten</span>
        </button>

        <button
          onClick={() => handleEditWithAI("expand")}
          className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
          title="Make Longer"
        >
          <Maximize2 size={14} />
          <span>Expand</span>
        </button>

        <button
          onClick={() => handleEditWithAI("formal")}
          className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
          title="Make Formal"
        >
          <Type size={14} />
          <span>Formal</span>
        </button>

        <button
          onClick={() => handleEditWithAI("table")}
          className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
          title="Convert to Table"
        >
          <Table size={14} />
          <span>Table</span>
        </button>

        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded text-xs"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Suggestion Preview</h3>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Original Text:
                </h4>
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm">{selectedText}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  AI Suggestion:
                </h4>
                <div className="bg-blue-50 p-3 rounded border">
                  <p className="text-sm whitespace-pre-wrap">{aiSuggestion}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Confirm & Replace
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center justify-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingToolbar;
