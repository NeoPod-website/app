"use client";

import React from "react";
import { Button } from "@heroui/react";
import { ListIcon, ListTodoIcon } from "lucide-react";

const AdminDetailOptionHeader = () => {
  return (
    <section className="flex gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <Button
        size="sm"
        className="w-fit gap-2 rounded border border-gray-400 bg-gray-700 px-3 py-1"
        endContent={<ListIcon size={16} />}
      >
        Properties
      </Button>

      <Button
        size="sm"
        className="w-fit gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1"
        endContent={<ListTodoIcon size={16} />}
      >
        Results
      </Button>
    </section>
  );
};

export default AdminDetailOptionHeader;
