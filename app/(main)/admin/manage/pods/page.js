import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import PodsList from "@/components/layout/pods/PodList";
import PodContainerWrapper from "@/components/layout/pods/PodContainerWrapper";

const breadcrumbsList = [
  {
    title: "Admin PODS",
    href: "/admin/manage/pods",
  },
];

export const metadata = {
  title: "Manage PODS | Admin Panel | NEO POD",
  description:
    "Create, edit, and organize PODS for ambassadors. Shape the journey and engagement through meaningful tasks and challenges.",
};

async function fetchPods(startKey = null, limit = 3) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/pods?limit=${limit}`;

    if (startKey) {
      url += `&startKey=${encodeURIComponent(startKey)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }

      throw new Error(`Failed to fetch pods: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching pods:", error);

    throw error;
  }
}

const ManagePODSPage = async ({ searchParams }) => {
  const searchParamsList = await searchParams;

  const podsData = await fetchPods(searchParamsList.startKey);

  const pods = podsData.data.pods || [];
  const hasMore = podsData.data.pagination.hasMore;
  const lastEvaluatedKey = podsData.data.pagination.lastEvaluatedKey;

  return (
    <PodContainerWrapper list={breadcrumbsList}>
      <Suspense>
        <PodsList
          hasMore={hasMore}
          initialPods={pods}
          lastEvaluatedKey={lastEvaluatedKey}
        />
      </Suspense>

      {pods.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
          <p className="text-lg text-gray-300">No PODs found</p>

          <Link
            href="/admin/manage/pods/create"
            className="rounded-full border border-gray-100 bg-gradient-primary px-6 py-2 hover:border-gray-600"
          >
            Create Your First POD
          </Link>
        </div>
      )}
    </PodContainerWrapper>
  );
};

export default ManagePODSPage;
