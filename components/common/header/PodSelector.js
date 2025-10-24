"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToast, Select, SelectItem } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { languages } from "@/data/langData";

import { setLanguage } from "@/redux/slice/languageSlice";
import { setCurrentPod, setPods } from "@/redux/slice/podsSlice";

const PodSelector = () => {
  const router = useRouter();
  const urlPodId = useParams();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(new Set());

  const allPods = useSelector((state) => state.pods.pods);

  const handleSelectionChange = useCallback(
    (keys) => {
      const selectedPodId = keys.currentKey;
      setSelectedLanguage(keys);
      dispatch(setCurrentPod(selectedPodId));

      const selectedPod = allPods.find((p) => p.pod_id === selectedPodId);

      if (selectedPod?.language) {
        dispatch(setLanguage(selectedPod.language));
      }

      // handle route updates
      if (pathname.includes("/admin/manage/categories")) {
        router.push(`/admin/manage/categories/${selectedPodId}`);
      } else if (pathname.includes("/admin/manage/quests")) {
        router.push(`/admin/manage/quests/${selectedPodId}`);
      } else if (pathname.includes("/view/quests")) {
        router.push(`/view/quests/${selectedPodId}`);
      } else if (pathname.includes("/admin/leaderboard")) {
        router.push(`/admin/leaderboard/initiate/${selectedPodId}`);
      } else if (pathname.includes("/admin/manage/ambassadors")) {
        router.push(`/admin/manage/ambassadors/${selectedPodId}`);
      }
    },
    [pathname, allPods],
  );

  const getLanguageName = useCallback((code) => {
    return languages.find((lang) => lang.code === code)?.name || code;
  }, []);

  useEffect(() => {
    const fetchPods = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pods?limit=100`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

        const pods = data.data.pods || [];
        dispatch(setPods(pods));

        if (pods.length > 0) {
          let selectedPod = pods[0];

          if (urlPodId.podId && pods.some((p) => p.pod_id === urlPodId.podId)) {
            selectedPod = pods.find((p) => p.pod_id === urlPodId.podId);
          }

          setSelectedLanguage(new Set([selectedPod.pod_id]));

          dispatch(setCurrentPod(selectedPod.pod_id));
          dispatch(setLanguage(selectedPod.language || "en"));
        }
      } catch (err) {
        console.error("Error fetching pods:", err);
        dispatch(setPods([]));
        addToast({
          title: "Error",
          color: "danger",
          description: err.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPods();
  }, [dispatch]);

  return (
    <Select
      size="lg"
      variant="bordered"
      aria-label="Language"
      isLoading={isLoading}
      selectedKeys={selectedLanguage}
      onSelectionChange={handleSelectionChange}
      className="w-32 rounded-full bg-gradient-dark"
      classNames={{
        base: "h-11",
        trigger:
          "border-t border-t-gray-400 border-x-0 border-b-0 border-t-[1px] focus-within:!border-t-gray-300 h-11 min-h-[44px] max-h-[44px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded-full",
        value: "text-base",
      }}
    >
      {allPods.map((pod) => (
        <SelectItem key={pod.pod_id} value={pod.pod_id}>
          {getLanguageName(pod.language)}
        </SelectItem>
      ))}
    </Select>
  );
};

export default PodSelector;
