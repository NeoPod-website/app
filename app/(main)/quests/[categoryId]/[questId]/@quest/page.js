import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import QuestDetails from "@/components/layout/quests/detail/QuestDetails";

export const metadata = {
  title: "Quest Details | NeoPod",
  description:
    "Dive deep into this quest's challenges, complete tasks, and submit your progress to earn rewards and achievements in the NeoPod community.",
};

const fetchQuestDetails = async (questId) => {
  if (!questId) {
    throw new Error("Quest ID is required");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      // next: { revalidate: 300 },
    },
  );

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }

    throw new Error(`Failed to fetch quest: ${res.status}`);
  }

  const data = await res.json();

  return data.data?.quest || null;
};

const QuestSlot = async ({ params }) => {
  const { questId } = await params;

  const questData = await fetchQuestDetails(questId);

  return <QuestDetails quest={questData} />;
};

export default QuestSlot;
