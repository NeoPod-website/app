import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

export const TabIndent = Extension.create({
  name: "tabIndent",

  addOptions() {
    return {
      indentSize: 4, // Number of spaces for each indent level
      maxIndent: 10, // Maximum indent levels
      indentSpaceChar: "\u00a0", // Non-breaking space
      doubleEnterUnindent: true, // Whether pressing Enter twice should unindent
    };
  },

  addAttributes() {
    return {
      indent: {
        default: 0,
        parseHTML: (element) => {
          return element.style.paddingLeft
            ? parseInt(element.style.paddingLeft, 10) / 24
            : 0;
        },
        renderHTML: (attributes) => {
          if (!attributes.indent) {
            return {};
          }
          return {
            style: `margin-left: ${attributes.indent * 24}px`,
          };
        },
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: [
          "paragraph",
          "heading",
          "blockquote",
          "codeBlock",
          "bulletList",
          "orderedList",
          "taskList",
        ],
        attributes: {
          indent: {
            default: 0,
            renderHTML: (attributes) => {
              if (!attributes.indent) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indent * 24}px`,
              };
            },
            parseHTML: (element) => {
              return element.style.marginLeft
                ? parseInt(element.style.marginLeft, 10) / 24
                : 0;
            },
          },
        },
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // Get current selection
        const { selection } = editor.state;
        const { $from, $to, empty } = selection;

        // Check if we're in a list - if so, properly handle list indentation
        if (
          editor.isActive("bulletList") ||
          editor.isActive("orderedList") ||
          editor.isActive("taskList")
        ) {
          // Only let default behavior work if at the start of a list item
          const node = $from.node();
          if ($from.parentOffset === 0) {
            // Let the default list indentation work
            // This will correctly indent the bullet/number along with the content
            return false;
          }
        }

        // Case 1: Selection spans multiple lines/paragraphs - indent all selected blocks
        if (!empty && $from.pos !== $to.pos) {
          // Find the top-level blocks within the selection
          const startPos = $from.start();
          const endPos = $to.end();

          // Get all positions of block starts in the selection
          const positions = [];
          let pos = startPos;

          // Find start positions of all blocks in selection
          const doc = editor.state.doc;
          doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
            if (node.isBlock && node.type.name !== "listItem") {
              const nodeTypes = [
                "paragraph",
                "heading",
                "blockquote",
                "codeBlock",
              ];
              if (nodeTypes.includes(node.type.name)) {
                positions.push(pos);
              }
            }
          });

          // Increase indent for each block
          positions.forEach((position) => {
            const node = doc.nodeAt(position);
            if (node) {
              const currentIndent = node.attrs.indent || 0;
              editor.commands.updateAttributes(
                node.type.name,
                {
                  indent: Math.min(this.options.maxIndent, currentIndent + 1),
                },
                { at: position },
              );
            }
          });

          return true;
        }

        // Case 2: Cursor is at the start of a node - indent the whole node
        if (empty && $from.parentOffset === 0) {
          const node = $from.parent;
          const currentIndent = node.attrs.indent || 0;

          if (node.type.name !== "listItem") {
            editor.commands.updateAttributes(node.type.name, {
              indent: Math.min(this.options.maxIndent, currentIndent + 1),
            });
            return true;
          }
        }

        // Case 3: Simple cursor or selection within a single block
        // Insert the specified number of spaces
        const spaces = this.options.indentSpaceChar.repeat(
          this.options.indentSize,
        );
        editor.commands.insertContent(spaces);
        return true;
      },

      "Shift-Tab": ({ editor }) => {
        // Get current selection
        const { selection } = editor.state;
        const { $from, $to, empty } = selection;

        // Check if we're in a list and at start of item - let default behavior work
        if (
          (editor.isActive("bulletList") ||
            editor.isActive("orderedList") ||
            editor.isActive("taskList")) &&
          $from.parentOffset === 0
        ) {
          return false;
        }

        // Case 1: Multiple blocks selected - outdent all of them
        if (!empty && $from.pos !== $to.pos) {
          // Find the top-level blocks within the selection
          const startPos = $from.start();
          const endPos = $to.end();

          // Get all positions of block starts in the selection
          const positions = [];

          // Find start positions of all blocks in selection
          const doc = editor.state.doc;
          doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
            if (node.isBlock && node.type.name !== "listItem") {
              const nodeTypes = [
                "paragraph",
                "heading",
                "blockquote",
                "codeBlock",
              ];
              if (nodeTypes.includes(node.type.name)) {
                positions.push(pos);
              }
            }
          });

          // Decrease indent for each block
          positions.forEach((position) => {
            const node = doc.nodeAt(position);
            if (node) {
              const currentIndent = node.attrs.indent || 0;
              if (currentIndent > 0) {
                editor.commands.updateAttributes(
                  node.type.name,
                  {
                    indent: currentIndent - 1,
                  },
                  { at: position },
                );
              }
            }
          });

          return true;
        }

        // Case 2: Cursor at start of block - outdent the whole block node
        if (empty && $from.parentOffset === 0) {
          const node = $from.parent;
          const currentIndent = node.attrs.indent || 0;

          if (currentIndent > 0 && node.type.name !== "listItem") {
            editor.commands.updateAttributes(node.type.name, {
              indent: currentIndent - 1,
            });
            return true;
          }
        }

        // Case 3: Within a block - try to remove indentation at cursor
        if (empty) {
          const currentPos = $from.pos;
          const textBefore = $from.nodeBefore?.text || "";
          const indentSize = this.options.indentSize;

          // Check if we have spaces before the cursor that we can remove
          let spacesToRemove = 0;
          let i = 0;

          // Count backwards from cursor position to find how many spaces to remove
          while (i < indentSize && textBefore.length - i > 0) {
            const char = textBefore.charAt(textBefore.length - 1 - i);
            if (char === this.options.indentSpaceChar || char === " ") {
              spacesToRemove++;
              i++;
            } else {
              break;
            }
          }

          // Remove spaces if found
          if (spacesToRemove > 0) {
            const deleteFrom = currentPos - spacesToRemove;
            const deleteTo = currentPos;

            editor.state.tr
              .delete(deleteFrom, deleteTo)
              .setSelection(TextSelection.create(editor.state.doc, deleteFrom))
              .scrollIntoView();

            editor.view.dispatch(editor.state.tr);
            return true;
          }
        }

        return false;
      },

      // Handle Enter key for unindenting on double Enter
      Enter: ({ editor }) => {
        if (!this.options.doubleEnterUnindent) {
          return false;
        }

        const { selection } = editor.state;
        const { $from, empty } = selection;

        // Only process if cursor is at the end of the line
        if (!empty || $from.parentOffset !== $from.parent.content.size) {
          return false;
        }

        const node = $from.parent;
        const pos = $from.pos;

        // Check if we're in an empty paragraph or list item that's indented
        const isEmpty = node.content.size === 0;
        const isIndented =
          (node.attrs.indent && node.attrs.indent > 0) ||
          (node.type.name === "listItem" &&
            editor.isActive(["bulletList", "orderedList", "taskList"]));

        // Handle empty indented line (this means user pressed Enter on an empty line)
        if (isEmpty && isIndented) {
          if (node.type.name === "listItem") {
            // For lists, let's lift the list item out of the list
            editor.commands.liftListItem("listItem");
            return true;
          } else if (node.attrs.indent > 0) {
            // For other blocks, reduce the indent level
            editor.commands.updateAttributes(node.type.name, {
              indent: node.attrs.indent - 1,
            });
            return true;
          }
        }

        // Otherwise let the default Enter behavior work
        return false;
      },
    };
  },

  // Track the last key pressed to detect double Enter
  addProseMirrorPlugins() {
    return [];
  },
});
