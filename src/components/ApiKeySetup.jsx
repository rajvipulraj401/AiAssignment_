import React, { useState } from "react";
import { Key, AlertCircle, CheckCircle } from "lucide-react";

const ApiKeySetup = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setStatus("");

    try {
      // Store API key in localStorage for demo purposes
      localStorage.setItem("openai_api_key", apiKey);

      // Test the API key with a simple request
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        onApiKeySet(apiKey);
      } else {
        setStatus("error");
        localStorage.removeItem("openai_api_key");
      }
    } catch (error) {
      setStatus("error");
      localStorage.removeItem("openai_api_key");
    } finally {
      setIsValidating(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
        <CheckCircle size={20} />
        <span>API Key configured successfully!</span>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-800 mb-2">
            OpenAI API Key Required
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            To use the AI features, you need to provide your OpenAI API key. Get
            one from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              OpenAI Platform
            </a>
            .
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isValidating}
              />
            </div>
            <button
              type="submit"
              disabled={!apiKey.trim() || isValidating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Key size={16} />
              {isValidating ? "Validating..." : "Set Key"}
            </button>
          </form>

          {status === "error" && (
            <p className="text-red-600 text-sm mt-2">
              Invalid API key. Please check and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
