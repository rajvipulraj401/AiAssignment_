# AI Text Editor

A simple text editor with AI features. Built with React and Tiptap editor.

## What this does

This is a text editor where you can:

- Write and format text
- Get AI help to improve your writing
- Search the web and add results
- Chat with AI for content ideas

## Features

### Basic Editor

- Rich text editing with Tiptap
- Bold, italic, lists, tables
- Text alignment options

### AI Features

- **Floating Toolbar** - Select text and get AI suggestions
- **Chat Sidebar** - Ask AI questions
- **Text Improvement** - Fix grammar and style
- **Web Search** - Search and insert content
- **Content Generation** - AI writes content for you

## How to use

### Setup

1. Clone this repo
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:5174

### API Key (Optional)

- Get OpenAI API key from https://platform.openai.com
- Click "Setup API Key" in the app
- Enter your key
- Without key, you get demo responses

### Using the Editor

1. **Write text** in the main editor
2. **Select text** to see floating toolbar
3. **Choose AI action** - improve, shorten, expand, etc.
4. **Preview changes** and confirm or cancel
5. **Chat with AI** in the right sidebar

## Examples

### Floating Toolbar

- Select text → Click "Improve" → Get better version
- Select text → Click "Shorten" → Get concise version
- Select text → Click "Table" → Convert to table

### Chat Commands

- "Improve my grammar"
- "Search for React news and insert summary"
- "Write a professional email"
- "Make this text more casual"

## Tech Stack

- React 18
- Vite
- Tiptap (editor)
- Tailwind CSS
- OpenAI API
- Lucide icons

## Project Structure

```
src/
├── components/
│   ├── Editor.jsx           # Main editor
│   ├── ChatSidebar.jsx      # AI chat
│   ├── FloatingToolbar.jsx  # Text selection toolbar
│   └── ApiKeySetup.jsx      # API key setup
├── services/
│   ├── aiService.js         # OpenAI integration
│   ├── searchService.js     # Web search
│   └── agentService.js      # AI agent logic
└── App.jsx                  # Main app
```

## Development

### Local Development

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

### Deploy

- Push to GitHub
- Deploy on Vercel/Netlify
- Works without API key (demo mode)

## API Key Setup

### For Real AI Features

1. Get OpenAI API key
2. Add to app settings
3. All features become fully functional

### Without API Key

- App works in demo mode
- Mock AI responses
- All UI features work
- Perfect for demos

## Troubleshooting

### Common Issues

- **API key not working** - Check if it starts with "sk-"
- **Floating toolbar not showing** - Make sure text is selected
- **Chat not responding** - Check internet connection
- **Search not working** - Try different search terms

### Browser Support

- Modern browsers only
- Needs localStorage for API key
- Works on mobile devices

## Cost

### OpenAI API

- GPT-3.5-turbo: $0.002 per 1K tokens
- Very cheap for text editing
- Free credits for new accounts

### Hosting

- Vercel/Netlify: Free
- GitHub Pages: Free
- No server costs

## Future Ideas

- Real-time collaboration
- Document saving
- Export to PDF/Word
- Voice input
- Custom AI models
- Plugin system

## License

MIT License - feel free to use this code.

## Contributing

1. Fork the repo
2. Make changes
3. Submit pull request

## Support

- Create GitHub issue for bugs
- Check troubleshooting section
- Review OpenAI docs for API issues

---

Built with React, Tiptap, and OpenAI. Works great for writing and editing with AI help.
