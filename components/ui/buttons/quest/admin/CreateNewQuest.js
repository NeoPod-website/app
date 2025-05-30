"use client";

import React from "react";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetCurrentQuest } from "@/redux/slice/questSlice";

const CreateNewQuest = ({ category }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleCreateNewQuest = () => {
    dispatch(resetCurrentQuest());

    router.push(
      `/admin/manage/quests/${category.pod_id}/${category.category_id}/create`,
    );
  };

  return (
    <Button
      size="md"
      radius="full"
      onPress={handleCreateNewQuest}
      endContent={<PlusIcon size={16} />}
      className="neo-button border border-white bg-gradient-primary text-white"
    >
      Create New Quest
    </Button>
  );
};

export default CreateNewQuest;
