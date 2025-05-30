import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import AddTaskModal from "@/components/ui/modals/AddTaskModal";
import MainPageScroll from "@/components/common/MainPageScroll";

import AdminDetailMain from "@/components/layout/quests/detail/admin/AdminDetailMain";
import AdminDetailOption from "@/components/layout/quests/detail/admin/AdminDetailOption";

async function fetchQuest(questId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }

      throw new Error(`Failed to fetch quest: ${response.statusText}`);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching quest:", error);
    throw error;
  }
}

const AdminQuestPage = async ({ params }) => {
  const { podId, categoryId, questId } = await params;

  const questData = await fetchQuest(questId);

  return (
    <>
      <AddTaskModal />

      <MainPageScroll>
        <div className="flex h-full flex-1 gap-4">
          <AdminDetailMain
            isNew={false}
            podId={podId}
            categoryId={categoryId}
            quest={questData.quest}
          />

          <AdminDetailOption
            podId={podId}
            categoryId={categoryId}
            quest={questData.quest}
          />
        </div>
      </MainPageScroll>
    </>
  );
};

export default AdminQuestPage;
