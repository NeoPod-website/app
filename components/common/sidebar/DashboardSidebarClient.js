"use client";

import React from "react";
import { useSelector } from "react-redux";

import SidebarMenu from "./SidebarMenu";
import { getTranslator } from "@/lib/translate";

const pod = [
  {
    pod_id: "pod_c153a817-f5c3-4092-8d13-35f7c1b3162a",
    language: "tr",
  },
  {
    pod_id: "pod_8b08e470-4505-44b9-9761-383f09006a13",
    language: "id",
  },
  {
    pod_id: "pod_7843a5df-8978-439e-892c-378443cf0825",
    language: "en",
  },
  {
    pod_id: "pod_85a8ce25-95bc-4f21-88c6-5f946ed69914",
    language: "ar",
  },
  {
    pod_id: "pod_0b98aaae-5cfc-4f20-9a06-fe6881f761c1",
  },
  {
    pod_id: "pod_857c8587-42ef-4f5e-956e-bad40769750c",
    language: "vi",
  },
];

const DashboardSidebarClient = ({ menuItems, session }) => {
  // Get current language from Redux language slice
  const lang = useSelector((state) => state.language.currentLang) || "en";
  const t = getTranslator(lang);

  // Localize menu items
  let localizedMenu;

  if (session.isAdmin) {
    localizedMenu = menuItems.map((item) => ({
      ...item,
      name: t(`menu.${item.key}`) || item.name,
      children: item.children?.map((child) => ({
        ...child,
        name: t(`menu.${child.key}`) || child.name,
      })),
    }));
  } else {
    localizedMenu = menuItems.map((item) => {
      {
        // Find the pod for the current user to get its language
        const userPod = pod.find((p) => p.pod_id === session.pod_id);
        const itemLang = userPod ? userPod.language : "en";

        return {
          ...item,
          name: getTranslator(itemLang)(`menu.${item.key}`) || item.name,
          children: item.children?.map((child) => ({
            ...child,
            name: getTranslator(itemLang)(`menu.${child.key}`) || child.name,
          })),
        };
      }
    });
  }

  return <SidebarMenu menuItems={localizedMenu} role={session.role_type} />;
};

export default DashboardSidebarClient;
