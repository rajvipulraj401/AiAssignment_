import React, { useRef, useState, useEffect } from "react";
import Editor from "./components/Editor";
import ChatSidebar from "./components/ChatSidebar";
import ApiKeySetup from "./components/ApiKeySetup";

const App = () => {
  const editorRef = useRef(null);
  const [apiKey, setApiKey] = useState(null);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);

  useEffect(() => {
    // Check if API key exists
    const storedKey = localStorage.getItem("openai_api_key");
    if (storedKey && storedKey !== "your_openai_api_key_here") {
      setApiKey(storedKey);
    } else {
      setShowApiKeySetup(true);
    }
  }, []);

  const handleApiKeySet = (key) => {
    setApiKey(key);
    setShowApiKeySetup(false);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* main editor */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">AI Editor</h1>
            {!apiKey && (
              <button
                onClick={() => setShowApiKeySetup(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Setup API Key
              </button>
            )}
          </div>
        </header>

        {showApiKeySetup && (
          <div className="p-6">
            <ApiKeySetup onApiKeySet={handleApiKeySet} />
          </div>
        )}

        <div className="flex-1 p-6">
          <Editor ref={editorRef} />
        </div>
      </div>

      {/* chat panel */}
      <div className="w-96 border-l border-gray-200 bg-white">
        <ChatSidebar editorRef={editorRef} />
      </div>
    </div>
  );
};

export default App;
