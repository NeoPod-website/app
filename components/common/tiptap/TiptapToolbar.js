"use client";

import {
  X,
  Bold,
  List,
  Link,
  Undo,
  Redo,
  Plus,
  Image,
  Table,
  Quote,
  Minus,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  Highlighter,
  ListOrdered,
  AlignCenter,
  CheckSquare,
  ChevronDown,
  Strikethrough,
} from "lucide-react";

import { useState, useRef } from "react";
import styles from "./tiptap.module.css";

const TiptapToolbar = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [toolbarExpanded, setToolbarExpanded] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Insert the image with the data URL
        editor.chain().focus().setImage({ src: event.target.result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  // Modern button styling with tooltip
  const formatButton =
    "p-2 rounded-md transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 relative group";
  const activeButton = "bg-blue-600 hover:bg-blue-700 text-white";
  const iconSize = 18;

  // Button groups
  const buttonGroups = [
    // Text Formatting
    {
      name: "formatting",
      title: "Text Formatting",
      buttons: [
        {
          title: "Bold",
          icon: <Bold size={iconSize} />,
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive("bold"),
        },
        {
          title: "Italic",
          icon: <Italic size={iconSize} />,
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive("italic"),
        },
        {
          title: "Underline",
          icon: <Underline size={iconSize} />,
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive("underline"),
        },
        {
          title: "Strike",
          icon: <Strikethrough size={iconSize} />,
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: editor.isActive("strike"),
        },
        {
          title: "Highlight",
          icon: <Highlighter size={iconSize} />,
          action: () => editor.chain().focus().toggleHighlight().run(),
          isActive: editor.isActive("highlight"),
        },
      ],
    },
    // Lists
    {
      name: "lists",
      title: "Lists",
      buttons: [
        {
          title: "Bullet List",
          icon: <List size={iconSize} />,
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive("bulletList"),
        },
        {
          title: "Ordered List",
          icon: <ListOrdered size={iconSize} />,
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive("orderedList"),
        },
        {
          title: "Task List",
          icon: <CheckSquare size={iconSize} />,
          action: () => editor.chain().focus().toggleTaskList().run(),
          isActive: editor.isActive("taskList"),
        },
      ],
    },
    // Alignment
    {
      name: "alignment",
      title: "Alignment",
      buttons: [
        {
          title: "Align Left",
          icon: <AlignLeft size={iconSize} />,
          action: () => editor.chain().focus().setTextAlign("left").run(),
          isActive: editor.isActive({ textAlign: "left" }),
        },
        {
          title: "Align Center",
          icon: <AlignCenter size={iconSize} />,
          action: () => editor.chain().focus().setTextAlign("center").run(),
          isActive: editor.isActive({ textAlign: "center" }),
        },
        {
          title: "Align Right",
          icon: <AlignRight size={iconSize} />,
          action: () => editor.chain().focus().setTextAlign("right").run(),
          isActive: editor.isActive({ textAlign: "right" }),
        },
      ],
    },
    // Media
    {
      name: "media",
      title: "Media",
      buttons: [
        {
          title: "Add Link",
          icon: <Link size={iconSize} />,
          action: () => setShowLinkInput(!showLinkInput),
          isActive: editor.isActive("link"),
        },
        {
          title: "Add Image",
          icon: <Image size={iconSize} />,
          action: () => fileInputRef.current.click(),
          isActive: false,
          hasHiddenInput: true,
        },
      ],
    },
    // Other Elements
    {
      name: "other",
      title: "Other Elements",
      buttons: [
        {
          title: "Table",
          icon: <Table size={iconSize} />,
          action: addTable,
          isActive: editor.isActive("table"),
        },
        {
          title: "Quote",
          icon: <Quote size={iconSize} />,
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive("blockquote"),
        },
        {
          title: "Horizontal Rule",
          icon: <Minus size={iconSize} />,
          action: () => editor.chain().focus().setHorizontalRule().run(),
          isActive: false,
        },
        {
          title: "Undo",
          icon: <Undo size={iconSize} />,
          action: () => editor.chain().focus().undo().run(),
          isActive: false,
        },
        {
          title: "Redo",
          icon: <Redo size={iconSize} />,
          action: () => editor.chain().focus().redo().run(),
          isActive: false,
        },
      ],
    },
  ];

  return (
    <>
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Mobile Toolbar Toggle */}
      <div className="mb-2 flex justify-center lg:hidden">
        <button
          onClick={() => setToolbarExpanded(!toolbarExpanded)}
          className="flex items-center justify-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-gray-200"
        >
          {toolbarExpanded ? "Hide Toolbar" : "Show Toolbar"}
          <ChevronDown
            size={16}
            className={`transform transition-transform ${toolbarExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Main Toolbar */}
      <div
        className={`tiptap-toolbar mb-4 flex flex-wrap gap-1 rounded-t-lg border-b border-gray-600 bg-gray-800 p-2 shadow-md transition-all ${
          styles["tiptap-toolbar"]
        } ${toolbarExpanded ? "max-h-96" : "max-h-0 overflow-hidden lg:max-h-96"} lg:overflow-visible`}
      >
        {/* Heading Select */}
        <div className="mr-2 flex items-center border-r border-gray-600 pr-2">
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: parseInt(value) })
                  .run();
              }
            }}
            className="rounded-md bg-gray-700 p-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>
        </div>

        {/* Button Groups */}
        {buttonGroups.map((group) => (
          <div
            key={group.name}
            className="mr-2 flex flex-wrap items-center border-r border-gray-600 pr-2"
          >
            {group.buttons.map((button, index) => (
              <div key={index} className="relative">
                <button
                  onClick={button.action}
                  className={`${formatButton} ${button.isActive ? activeButton : "text-gray-200"}`}
                  title={button.title}
                >
                  {button.icon}
                  <span className="sr-only">{button.title}</span>
                  {button.isActive && (
                    <div className="bg-blue-400 absolute bottom-0 left-0 h-1 w-full rounded-b"></div>
                  )}
                </button>
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {button.title}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Table Controls */}
        {editor.isActive("table") && (
          <div className="flex flex-wrap items-center gap-1 border-l border-gray-600 pl-2">
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className={`${formatButton} text-gray-200`}
              title="Add Column Before"
            >
              <Plus size={16} />
              <span className="ml-1 hidden sm:inline">Col Before</span>
            </button>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className={`${formatButton} text-gray-200`}
              title="Add Column After"
            >
              <Plus size={16} />
              <span className="ml-1 hidden sm:inline">Col After</span>
            </button>
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className={`${formatButton} text-gray-200`}
              title="Add Row Before"
            >
              <Plus size={16} />
              <span className="ml-1 hidden sm:inline">Row Before</span>
            </button>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className={`${formatButton} text-gray-200`}
              title="Add Row After"
            >
              <Plus size={16} />
              <span className="ml-1 hidden sm:inline">Row After</span>
            </button>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className={`${formatButton} text-red-400 hover:bg-red-800 hover:text-white`}
              title="Delete Table"
            >
              <X size={16} />
              <span className="ml-1 hidden sm:inline">Delete Table</span>
            </button>
          </div>
        )}
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="mb-2 flex flex-col items-center rounded-md border border-gray-600 bg-gray-800 p-2 shadow-md sm:flex-row">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="mb-2 w-full flex-grow rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 sm:mb-0 sm:mr-2 sm:w-auto"
          />
          <div className="flex gap-2">
            <button
              onClick={addLink}
              className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2 transition-colors"
            >
              Add Link
            </button>
            <button
              onClick={() => setShowLinkInput(false)}
              className="rounded-md bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Input (For URL option) */}
      {showImageInput && (
        <div className="mb-2 flex flex-col items-center rounded-md border border-gray-600 bg-gray-800 p-2 shadow-md sm:flex-row">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="mb-2 w-full flex-grow rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 sm:mb-0 sm:mr-2 sm:w-auto"
          />
          <div className="flex gap-2">
            <button
              onClick={addImage}
              className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2 transition-colors"
            >
              Add Image
            </button>
            <button
              onClick={() => setShowImageInput(false)}
              className="rounded-md bg-gray-600 px-4 py-2 transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TiptapToolbar;
