"use client";

import React from "react";
import { Button } from "@heroui/react";
import { EditIcon } from "lucide-react";

const EditPodBtn = () => {
  return (
    <Button
      size="md"
      type="button"
      title="Edit Pod"
      className="neo-button w-fit border border-gray-400 bg-gradient-dark !px-4"
      endContent={<EditIcon size={16} />}
    >
      Edit POD
    </Button>
  );
};

export default EditPodBtn;
