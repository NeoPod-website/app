"use client";

import React from "react";
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
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import styles from "./tiptap.module.css";

import TiptapToolbar from "./TiptapToolbar";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const Tiptap = () => {
  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Link.configure({
        openOnClick: true,
      }),
      Table.configure({
        resizable: true,
      }),
      Image,
      Italic,
      Strike,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
      }),
      ListItem,
      TableRow,
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
      Paragraph,
      Highlight,
      Underline,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      HardBreak,
      Blockquote,
      BulletList,
      TableHeader,
      OrderedList,
      HorizontalRule,
    ],
    content: "<p>NEO POD! 🌎️</p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      dispatch(setCurrentQuest({ description: editor.getHTML() }));
    },
    onSelectionUpdate: ({ editor }) => {
      dispatch(setCurrentQuest({ description: editor.getHTML() }));
    },
  });

  return (
    <>
      <TiptapToolbar editor={editor} />

      <EditorContent
        editor={editor}
        className={`${styles["tiptap-editor"]} ${styles["has-toolbar"]} prose prose-invert min-h-32 max-w-none rounded border border-red-500 p-4 text-white outline-none focus:outline-none focus:ring-0`}
      />
    </>
  );
};

export default Tiptap;
