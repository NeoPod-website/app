"use client";

import tippy from "tippy.js";
import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import React, { useRef, useState, useEffect, forwardRef } from "react";

import "tippy.js/dist/tippy.css";

import styles from "@/components/common/tiptap/tiptap.module.css";

const MentionList = ({ items, command, selectedIndex = 0 }) => {
  const listRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const element = document.querySelector(
      `[data-mention-index="${selectedIndex}"]`,
    );
    if (element && listRef.current) {
      element.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div
      ref={listRef}
      className={`${styles["mention-suggestions"]} hide-scroll`}
    >
      {items.length > 0 ? (
        items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-mention-index={index}
            onClick={() => command(item)}
            onMouseEnter={() => setHoveredIndex(index)}
            className={`flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors ${styles["mention-item"]} ${
              index === selectedIndex || index === hoveredIndex
                ? "bg-gray-600 text-white"
                : "text-gray-200 hover:bg-gray-700"
            }`}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs text-white">
              {item.label.charAt(0).toUpperCase()}
            </div>
            <span>{item.label}</span>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-gray-400">No results</div>
      )}
    </div>
  );
};

const MentionListPortal = forwardRef((props, ref) => (
  <div ref={ref} className="overflow-hidden">
    <MentionList {...props} />
  </div>
));
MentionListPortal.displayName = "MentionListPortal";

const mentionSuggestions = [
  { id: "john", label: "John Doe" },
  { id: "jane", label: "Jane Smith" },
  { id: "task", label: "Task Force" },
  { id: "alex", label: "Alex Johnson" },
  { id: "dope", label: "Dopey" },
  { id: "ragger", label: "Rager" },
  { id: "jhonny", label: "Jhonny" },
  { id: "sarah", label: "Sarah Williams" },
  { id: "mike", label: "Mike Brown" },
  { id: "project", label: "Project X" },
  { id: "meeting", label: "Meeting Notes" },
];

export const MentionConfig = {
  HTMLAttributes: {
    class: styles["mention"],
  },
  suggestion: {
    items: ({ query }) => {
      return mentionSuggestions.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      );
    },
    render: () => {
      let component;
      let popup;

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionListPortal, {
            props,
            editor: props.editor,
          });

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
            theme: "dark",
          })[0];
        },

        onUpdate(props) {
          component?.updateProps(props);
          popup?.setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          const currentIndex = props.selectedIndex ?? 0;

          if (props.event.key === "Escape") {
            popup?.hide();
            return true;
          }

          if (props.event.key === "ArrowUp") {
            const newIndex =
              (props.items.length + currentIndex - 1) % props.items.length;
            component?.updateProps({ ...props, selectedIndex: newIndex });
            return true;
          }

          if (props.event.key === "ArrowDown") {
            const newIndex = (currentIndex + 1) % props.items.length;
            component?.updateProps({ ...props, selectedIndex: newIndex });
            return true;
          }

          if (props.event.key === "Enter" || props.event.key === "Tab") {
            if (props.items.length > 0) {
              props.command(props.items[currentIndex]);
              return true;
            }
          }

          return false;
        },

        onExit() {
          popup?.destroy();
          component?.destroy();
        },
      };
    },
    char: "@",
    minLength: 1,
    pluginKey: new PluginKey("mentions"),
  },
};
