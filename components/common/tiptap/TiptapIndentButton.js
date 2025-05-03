// Optional: Add these functions to your TiptapToolbar component

// Add these indent/outdent buttons to your toolbar
const IndentButtons = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const getCurrentIndent = () => {
    // Get current node
    const { selection } = editor.state;
    const { from } = selection;
    const node = selection.$from.parent;

    // Check for inline style first
    if (node.attrs.style && node.attrs.style.includes("padding-left")) {
      const match = node.attrs.style.match(/padding-left:\s*(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }

    // Alternative: check for class-based indentation
    if (node.attrs.class) {
      const match = node.attrs.class.match(/indent-(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }

    return 0;
  };

  const indent = () => {
    const currentIndent = getCurrentIndent();
    const newIndent = Math.min(5, currentIndent + 1); // Max 5 levels

    // Using inline style approach
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        const { selection } = tr;
        const { from, to } = selection;

        if (dispatch) {
          tr.setNodeMarkup(selection.$from.before(), undefined, {
            ...selection.$from.parent.attrs,
            style: `padding-left: ${newIndent * 2}ch`,
          });
        }

        return true;
      })
      .run();

    // Alternative: class-based approach
    // editor.chain().focus().command(({ tr, dispatch }) => {
    //   if (dispatch) {
    //     tr.setNodeMarkup(selection.$from.before(), undefined, {
    //       ...selection.$from.parent.attrs,
    //       class: `indent-${newIndent}`,
    //     });
    //   }
    //   return true;
    // }).run();
  };

  const outdent = () => {
    const currentIndent = getCurrentIndent();
    if (currentIndent <= 0) return;

    const newIndent = Math.max(0, currentIndent - 1);

    // Using inline style approach
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        const { selection } = tr;

        if (dispatch) {
          tr.setNodeMarkup(selection.$from.before(), undefined, {
            ...selection.$from.parent.attrs,
            style: newIndent > 0 ? `padding-left: ${newIndent * 2}ch` : "",
          });
        }

        return true;
      })
      .run();

    // Alternative: class-based approach
    // editor.chain().focus().command(({ tr, dispatch }) => {
    //   if (dispatch) {
    //     tr.setNodeMarkup(selection.$from.before(), undefined, {
    //       ...selection.$from.parent.attrs,
    //       class: newIndent > 0 ? `indent-${newIndent}` : '',
    //     });
    //   }
    //   return true;
    // }).run();
  };

  return (
    <>
      <button
        onClick={outdent}
        className={editor.isActive("indent") ? "is-active" : ""}
        title="Decrease indent"
      >
        {/* You can use an icon or text here */}
        <span>←</span>
      </button>
      <button onClick={indent} title="Increase indent">
        {/* You can use an icon or text here */}
        <span>→</span>
      </button>
    </>
  );
};

export default IndentButtons;

// Then in your TiptapToolbar component, add:
// <IndentButtons editor={editor} />
