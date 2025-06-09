"use client";

import { useEffect } from "react";
import { addToast } from "@heroui/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const QuestProvider = ({ children }) => {
  const router = useRouter();

  const currentPod = useSelector((state) => state.pods.currentPod);

  useEffect(() => {
    if (currentPod) {
      router.push(`/admin/manage/quests/${currentPod}`);
    } else {
      addToast({
        title: "No Pod Selected",
        description: "Please select a pod to manage quests.",
        color: "warning",
      });
    }
  }, [currentPod, router]);

  return <>{children}</>;
};

export default QuestProvider;
