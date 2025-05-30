import React from "react";

import Tiptap from "@/components/common/tiptap/TiptapContainer";

const AdminDetailDescriptionEditor = ({ description }) => {
  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">Description</h2>

      <div className="mb-7 rounded-2.5xl border border-gray-400 p-4 shadow-lg">
        <Tiptap initialContent={description} />
      </div>
    </>
  );
};

export default AdminDetailDescriptionEditor;
