"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const PodProvider = ({ children }) => {
  const router = useRouter();

  const currentPod = useSelector((state) => state.pods.currentPod);

  useEffect(() => {
    if (currentPod) {
      router.push(`/admin/manage/categories/${currentPod}`);
    }
  }, [currentPod, router]);

  return <>{children}</>;
};

export default PodProvider;
