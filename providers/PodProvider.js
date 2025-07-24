"use client";

import { useEffect } from "react";
import { addToast } from "@heroui/react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

const PodProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentPod = useSelector((state) => state.pods.currentPod);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      if (currentPod) {
        if (pathname.includes("/view/quests")) {
          router.push(`/view/quests/${currentPod}`);
        } else if (pathname.includes("/admin/manage/categories")) {
          router.push(`/admin/manage/categories/${currentPod}`);
        }
      } else {
        addToast({
          title: "No Pod Selected",
          description:
            "Please select a pod to navigate to categories or quests.",
          color: "warning",
        });
      }
    }, 1500);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, [currentPod, router, pathname]);

  return <>{children}</>;
};

export default PodProvider;
