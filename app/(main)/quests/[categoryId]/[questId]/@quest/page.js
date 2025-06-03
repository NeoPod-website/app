import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import QuestDetails from "@/components/layout/quests/detail/QuestDetails";

const fetchQuestDetails = async (questId) => {
  try {
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
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      if (res.status === 404) {
        return notFound();
      }

      throw new Error(`Failed to fetch quest: ${res.status}`);
    }

    const data = await res.json();

    return data.data?.quest || null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching quest details",
    );
  }
};

const QuestSlot = async ({ params }) => {
  const { questId } = await params;

  try {
    const questData = await fetchQuestDetails(questId);

    if (!questData) {
      notFound();
    }

    return <QuestDetails quest={questData} />;
  } catch (error) {
    throw error;
  }
};

export default QuestSlot;
