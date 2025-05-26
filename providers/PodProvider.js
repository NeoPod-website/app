"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";

const PodProvider = ({ children }) => {
  const router = useRouter();

  const currentPod = useSelector((state) => state.pods.currentPod);

  useEffect(() => {
    if (currentPod) {
      router.push(`/admin/manage/categories/${currentPod}`);
    } else {
      addToast({
        title: "No Pod Selected",
        description: "Please select a pod to manage categories.",
        variant: "warning",
      });
    }
  }, [currentPod, router]);

  return <>{children}</>;
};

export default PodProvider;
