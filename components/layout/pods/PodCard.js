"use client";

import { useEffect, useState } from "react";

import EditPodButton from "../../ui/buttons/pods/EditPodBtn";
import RemovePodButton from "../../ui/buttons/pods/RemovePodBtn";

const statusColors = {
  live: "bg-green-600 text-white",
  draft: "bg-yellow-500 text-black",
  archived: "bg-gray-500 text-white",
};

const PodCard = ({ pod, isPreview = false }) => {
  const [formattedDate, setFormattedDate] = useState("");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");

  useEffect(() => {
    if (pod.created_at) {
      setFormattedDate(new Date(pod.created_at).toLocaleDateString());
    }

    // Handle different types of cover photo sources
    if (pod.cover_photo) {
      if (typeof pod.cover_photo === "string") {
        setCoverPhotoUrl(pod.cover_photo);
      } else if (pod.cover_photo instanceof File) {
        setCoverPhotoUrl(URL.createObjectURL(pod.cover_photo));
      }
    }

    // Cleanup URL objects to prevent memory leaks
    return () => {
      if (pod.cover_photo instanceof File && coverPhotoUrl) {
        URL.revokeObjectURL(coverPhotoUrl);
      }
    };
  }, [pod.created_at, pod.cover_photo]);

  // Get admin usernames from either admin_usernames or assigned_admins
  const admins = pod.admin_usernames || pod.assigned_admins || [];

  return (
    <div
      data-pod-id={pod.pod_id}
      className={`w-full rounded-2.5xl border bg-black/40 transition-colors hover:border-gray-600 hover:bg-black/80 ${
        pod.status === "live"
          ? "border-green-600"
          : pod.status === "draft"
            ? "border-yellow-500"
            : "border-gray-500"
      } ${isPreview ? "" : pod.status !== "live" ? "opacity-80 hover:opacity-100" : ""}`}
    >
      <div
        className="h-24 w-full rounded-t-2.5xl bg-cover bg-center"
        style={{
          backgroundImage: `url(${coverPhotoUrl || "/dashboard/category/background-2.jpg"})`,
        }}
      ></div>

      <div className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xl font-semibold text-white">
            {pod.name || "Untitled Pod"}
          </h2>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
                statusColors[pod.status] || "bg-gray-700 text-white"
              }`}
            >
              {pod.status || "draft"}
            </span>

            <span className="inline-block rounded-full border border-gray-400 bg-gray-700 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white">
              {pod.language || "en"}
            </span>
          </div>
        </div>

        <p className="line-clamp-2 w-3/4 break-words text-base text-gray-100">
          {pod.description || "No description provided"}
        </p>

        {admins.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <p className="text-nowrap text-sm text-gray-200">
              Pod Maintainers:
            </p>

            <div className="hide-scroll flex flex-nowrap gap-1 overflow-x-auto">
              {admins.map((admin, index) => (
                <span
                  key={index}
                  className="inline-block text-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-gray-100"
                >
                  {admin}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between text-sm text-gray-100">
          <p>
            👤 Created by: {pod.created_by || pod.admin_username || "Admin"}
          </p>
          <p>📅 {formattedDate || "Not created yet"}</p>
        </div>

        {!isPreview && pod.pod_id && (
          <div className="flex justify-end gap-2 pt-2">
            <RemovePodButton
              name={pod.name}
              podId={pod.pod_id}
              cover_photo={pod.original_cover_photo}
            />
            <EditPodButton podId={pod.pod_id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PodCard;
