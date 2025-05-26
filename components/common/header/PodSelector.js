"use client";

import { useDispatch } from "react-redux";
import { useParams, usePathname, useRouter } from "next/navigation";
import { addToast, Select, SelectItem } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";

import { languages } from "@/data/langData";

import { setCurrentPod } from "@/redux/slice/podsSlice";

const PodSelector = ({ assignedPods = [], adminRoleType = "reviewer" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const urlPodId = useParams();

  const [allPods, setAllPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(new Set());

  // Handle selection change
  const handleSelectionChange = useCallback(
    (keys) => {
      setSelectedLanguage(keys);

      const selectedPodId = keys.currentKey;
      dispatch(setCurrentPod(selectedPodId));

      if (pathname.includes("/admin/manage/categories")) {
        router.push(`/admin/manage/categories/${selectedPodId}`);
      } else if (pathname.includes("/admin/manage/quests")) {
        router.push(`/admin/manage/quests/${selectedPodId}`);
      }
    },
    [pathname],
  );

  // Memoize the language name helper to avoid recreating it on each render
  const getLanguageName = useCallback((code) => {
    return languages.find((lang) => lang.code === code)?.name || code;
  }, []);

  // Fetch pods only once on mount
  useEffect(() => {
    const fetchPods = async () => {
      setIsLoading(true);

      try {
        let res;
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        if (adminRoleType === "super") {
          res = await fetch(`${API_URL}/pods?limit=100`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
        } else if (assignedPods.length > 0) {
          const url =
            assignedPods.length > 25
              ? `${API_URL}/pods/batch/optimized`
              : `${API_URL}/pods/batch`;

          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ podIds: assignedPods }),
          });
        } else {
          setAllPods([]);
          setIsLoading(false);
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `Error ${res.status}`);
        }

        const pods = data.data.pods || [];

        setAllPods(pods);

        // Set first pod as default immediately after setting allPods
        if (pods.length > 0) {
          if (
            urlPodId.podId &&
            pods.some((pod) => pod.pod_id === urlPodId.podId)
          ) {
            setSelectedLanguage(new Set([urlPodId.podId]));
            dispatch(setCurrentPod(urlPodId.podId));
          } else {
            setSelectedLanguage(new Set([pods[0].pod_id]));
            dispatch(setCurrentPod(pods[0].pod_id));
          }
        }
      } catch (err) {
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
  }, []);

  return (
    <Select
      size="lg"
      variant="bordered"
      aria-label="Language"
      isLoading={isLoading}
      selectedKeys={selectedLanguage}
      onSelectionChange={(keys) => handleSelectionChange(keys)}
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
