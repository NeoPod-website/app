"use client";

import React from "react";

import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import { toggleAddTasksModal } from "@/redux/slice/modalsSlice";

const AdminAddTasks = () => {
  const dispatch = useDispatch();

  return (
    <Button
      size="lg"
      className="sticky bottom-0 left-0 h-16 w-full justify-start rounded-xl border border-gray-400 bg-gradient-dark px-3 py-2"
      startContent={
        <div className="flex items-center justify-center rounded-full bg-gradient-primary p-2.5">
          <PlusIcon size={20} />
        </div>
      }
      onPress={() => dispatch(toggleAddTasksModal())}
    >
      <div className="text-start">
        <p className="font-bold">Add Tasks</p>

        <span className="block text-xs font-normal text-gray-200">
          Url, File Uploads, Text...
        </span>
      </div>
    </Button>
  );
};

export default AdminAddTasks;
