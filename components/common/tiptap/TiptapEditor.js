import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Mention from "@tiptap/extension-mention";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Paragraph from "@tiptap/extension-paragraph";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";
import HardBreak from "@tiptap/extension-hard-break";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import TableHeader from "@tiptap/extension-table-header";
import OrderedList from "@tiptap/extension-ordered-list";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

const TiptapEditor = () => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Blockquote,
      HorizontalRule,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      HardBreak,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
      }),
    ],
    content: "<p>NEO POD! 🌎️</p>",
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const activeButton = "bg-blue-600 hover:bg-blue-700";
  const formatButton = "p-2 rounded hover:bg-gray-700 transition-colors";

  return (
    <div className="tiptap-editor w-full rounded border border-gray-400 bg-black p-4 text-white">
      <div className="mb-4 flex flex-wrap gap-1 border-b border-gray-600 p-2">
        {/* Text Formatting */}
        <div className="mr-2 flex border-r border-gray-600 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${formatButton} ${editor.isActive("bold") ? activeButton : ""}`}
            title="Bold"
          >
            <span className="font-bold">B</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${formatButton} ${editor.isActive("italic") ? activeButton : ""}`}
            title="Italic"
          >
            <span className="italic">I</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${formatButton} ${editor.isActive("underline") ? activeButton : ""}`}
            title="Underline"
          >
            <span className="underline">U</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${formatButton} ${editor.isActive("strike") ? activeButton : ""}`}
            title="Strike"
          >
            <span className="line-through">S</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`${formatButton} ${editor.isActive("highlight") ? activeButton : ""}`}
            title="Highlight"
          >
            <span className="bg-yellow-300 px-1 text-black">H</span>
          </button>
        </div>

        {/* Headings */}
        <div className="mr-2 flex border-r border-gray-600 pr-2">
          <select
            onChange={(e) => {
              if (e.target.value === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: parseInt(e.target.value) })
                  .run();
              }
            }}
            className="rounded bg-gray-800 p-2"
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>
        </div>

        {/* Lists */}
        <div className="mr-2 flex border-r border-gray-600 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${formatButton} ${editor.isActive("bulletList") ? activeButton : ""}`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${formatButton} ${editor.isActive("orderedList") ? activeButton : ""}`}
            title="Ordered List"
          >
            1. List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`${formatButton} ${editor.isActive("taskList") ? activeButton : ""}`}
            title="Task List"
          >
            ☑ Tasks
          </button>
        </div>

        {/* Alignment */}
        <div className="mr-2 flex border-r border-gray-600 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`${formatButton} ${editor.isActive({ textAlign: "left" }) ? activeButton : ""}`}
            title="Align Left"
          >
            ←
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`${formatButton} ${editor.isActive({ textAlign: "center" }) ? activeButton : ""}`}
            title="Align Center"
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`${formatButton} ${editor.isActive({ textAlign: "right" }) ? activeButton : ""}`}
            title="Align Right"
          >
            →
          </button>
        </div>

        {/* Media */}
        <div className="mr-2 flex border-r border-gray-600 pr-2">
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`${formatButton} ${editor.isActive("link") ? activeButton : ""}`}
            title="Add Link"
          >
            🔗 Link
          </button>
          <button
            onClick={() => setShowImageInput(!showImageInput)}
            className={formatButton}
            title="Add Image"
          >
            🖼️ Image
          </button>
        </div>

        {/* Table */}
        <div className="mr-2 flex border-r border-gray-600 pr-2">
          <button
            onClick={addTable}
            className={formatButton}
            title="Insert Table"
          >
            Table
          </button>
          {editor.isActive("table") && (
            <>
              <button
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className={formatButton}
                title="Add Column Before"
              >
                + Col Before
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className={formatButton}
                title="Add Column After"
              >
                + Col After
              </button>
              <button
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className={formatButton}
                title="Add Row Before"
              >
                + Row Before
              </button>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className={formatButton}
                title="Add Row After"
              >
                + Row After
              </button>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className={formatButton}
                title="Delete Table"
              >
                Delete Table
              </button>
            </>
          )}
        </div>

        {/* Other Elements */}
        <div className="flex">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${formatButton} ${editor.isActive("blockquote") ? activeButton : ""}`}
            title="Blockquote"
          >
            Quote
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={formatButton}
            title="Horizontal Rule"
          >
            HR
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className={formatButton}
            title="Undo"
          >
            ↩
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className={formatButton}
            title="Redo"
          >
            ↪
          </button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="mb-2 flex items-center rounded bg-gray-800 p-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="mr-2 flex-grow rounded bg-gray-700 p-2 text-white"
          />
          <button onClick={addLink} className="bg-blue-600 rounded p-2">
            Add Link
          </button>
          <button
            onClick={() => setShowLinkInput(false)}
            className="ml-2 rounded bg-gray-600 p-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="mb-2 flex items-center rounded bg-gray-800 p-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="mr-2 flex-grow rounded bg-gray-700 p-2 text-white"
          />
          <button onClick={addImage} className="bg-blue-600 rounded p-2">
            Add Image
          </button>
          <button
            onClick={() => setShowImageInput(false)}
            className="ml-2 rounded bg-gray-600 p-2"
          >
            Cancel
          </button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-invert min-h-32 max-w-none rounded border border-gray-600 p-4"
      />
    </div>
  );
};

export default TiptapEditor;
