"use client";

import { Button } from "@heroui/react";
import { ShareIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import React, { useCallback } from "react";

import {
  toggleShareQuestModal,
  setSelectedQuest,
} from "@/redux/slice/modalsSlice";

const ShareQuestBtn = ({ quest }) => {
  const dispatch = useDispatch();

  const handleShare = useCallback(() => {
    if (quest) {
      dispatch(setSelectedQuest(quest));
    }

    dispatch(toggleShareQuestModal());
  }, [dispatch, quest]);

  return (
    <Button
      size="lg"
      radius="full"
      onPress={handleShare}
      endContent={<ShareIcon size={16} />}
      className="neo-button border border-gray-400 bg-gradient-dark"
    >
      Share
    </Button>
  );
};

export default ShareQuestBtn;
