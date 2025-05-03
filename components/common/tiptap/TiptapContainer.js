"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
import { Placeholder } from "@tiptap/extension-placeholder";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CharacterCount from "@tiptap/extension-character-count";

import styles from "./tiptap.module.css";

import TiptapToolbar from "./TiptapToolbar";
import { TabIndent } from "./TiptapExternalExtension";

import { MentionConfig } from "@/utils/MentionConfig";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const Tiptap = ({
  initialContent = "<p>NEO POD! 🌎️</p>",
  onUpdate = null,
}) => {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border border-gray-600 table-auto",
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "mx-auto rounded",
        },
      }),
      Italic,
      Strike,
      Heading.configure({
        levels: [3, 4, 5, 6],
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      Mention.configure(MentionConfig),
      ListItem,
      TableRow,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start gap-2",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "task-list",
        },
      }),
      // Use enhanced TabIndent with configuration
      TabIndent.configure({
        indentSize: 4,
        maxIndent: 10,
        indentSpaceChar: "\u00a0", // Non-breaking space
        doubleEnterUnindent: true, // Enable double Enter unindenting
      }),
      Paragraph,
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 text-gray-900 px-1 rounded",
        },
      }),
      Underline,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      HardBreak,
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-500 pl-4 italic",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-6",
        },
      }),
      TableHeader,
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-6",
        },
      }),
      HorizontalRule,
      Placeholder.configure({
        placeholder: "Start writing...",
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-empty",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
      // Add character count extension
      CharacterCount,
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none overflow-hidden",
      },

      handleKeyDown: (view, event) => {
        if (event.key === "Tab" || (event.shiftKey && event.key === "Tab")) {
          return false;
        }

        // Add support for custom keyboard shortcuts here
        if ((event.ctrlKey || event.metaKey) && event.key === "b") {
          editor.commands.toggleBold();
          return true;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === "i") {
          editor.commands.toggleItalic();
          return true;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === "u") {
          editor.commands.toggleUnderline();
          return true;
        }

        return false;
      },
    },

    onUpdate: ({ editor }) => {
      // Call the redux dispatch
      dispatch(setCurrentQuest({ description: editor.getHTML() }));

      // Call custom onUpdate if provided
      if (onUpdate && typeof onUpdate === "function") {
        onUpdate(editor.getHTML());
      }
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  return (
    <div className="tiptap-editor-container">
      {editor && <TiptapToolbar editor={editor} />}

      <EditorContent
        editor={editor}
        className={`${styles["tiptap-editor"]} ${styles["has-toolbar"]} prose prose-invert min-h-32 max-w-none rounded border ${isFocused ? "border-blue-500" : "border-gray-700"} p-4 text-white outline-none transition-all duration-200 focus:outline-none focus:ring-0`}
      />

      {/* Editor status indicators */}
      <div className="mt-2 flex items-center justify-between px-1 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          {isFocused && (
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>

        <div>
          {editor && (
            <span>
              {editor.storage.characterCount.characters() || 0} characters
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
