import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Table as TableIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import FloatingToolbar from "./FloatingToolbar";

const Editor = forwardRef((props, ref) => {
  const [selectedText, setSelectedText] = useState("");
  const [showToolbar, setShowToolbar] = useState(false); // renamed for simplicity
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 }); // shorter name

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content:
      "<p>Welcome to your collaborative AI editor! Start typing to begin...</p>",
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to);
        setSelectedText(text);

        // get position for toolbar
        const { view } = editor;
        const coords = view.coordsAtPos(from);
        setToolbarPos({ x: coords.left, y: coords.top - 10 });
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
        setSelectedText("");
      }
    },
  });

  const handleTextSelection = (text) => {
    setSelectedText(text);
  };

  // Expose editor methods to parent component
  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
    insertContent: (content) => {
      if (editor) {
        editor.chain().focus().insertContent(content).run();
      }
    },
  }));

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      {/* Editor Toolbar */}
      <div className="border border-gray-200 rounded-t-lg bg-white p-3 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className="p-2 rounded hover:bg-gray-100"
          title="Insert Table"
        >
          <TableIcon size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="border-x border-b border-gray-200 rounded-b-lg bg-white min-h-[500px] p-6 focus:outline-none"
        />

        {/* Floating Toolbar */}
        {showToolbar && selectedText && (
          <FloatingToolbar
            selectedText={selectedText}
            position={toolbarPos}
            onClose={() => setShowToolbar(false)}
            onEditWithAI={(newText) => {
              // actually replace the selected text
              if (editor && selectedText) {
                const { from, to } = editor.state.selection;
                editor
                  .chain()
                  .focus()
                  .deleteRange({ from, to })
                  .insertContent(newText)
                  .run();
              }
            }}
          />
        )}
      </div>
    </div>
  );
});

export default Editor;
