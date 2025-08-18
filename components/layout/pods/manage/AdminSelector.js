"use client";

import Image from "next/image";
import { Select, SelectItem } from "@heroui/react";
import React, { useState, useEffect, useCallback, memo, useMemo } from "react";

// Memoized admin item component to prevent unnecessary re-renders
const AdminItem = memo(({ admin }) => (
  <div className="flex items-center gap-2">
    {admin.profile_photo && (
      <Image
        width={24}
        height={24}
        alt={admin.username}
        src={admin.profile_photo}
        className="rounded-full object-cover"
      />
    )}
    <span>{admin.username}</span>
    <span className="text-xs text-gray-400">({admin.role_type})</span>
  </div>
));

AdminItem.displayName = "AdminItem";

const AdminSelector = memo(({ assignedAdmins = [], onChange }) => {
  const [error, setError] = useState(null);
  const [allAdmins, setAllAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized fetch function to prevent recreation
  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super/admins/by-roles?roles=community,moderator`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Response is not valid JSON");
      }

      const data = await res.json();
      setAllAdmins(data.data.admins || []);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Memoized selection change handler
  const handleAdminSelectionChange = useCallback(
    (keys) => {
      onChange([...keys]);
    },
    [onChange],
  );

  // Memoized admin list to prevent unnecessary re-renders
  const adminSelectItems = useMemo(
    () =>
      allAdmins.map((admin) => (
        <SelectItem
          key={admin.username}
          value={admin.username}
          textValue={`${admin.username} (${admin.role_type})`}
        >
          <AdminItem admin={admin} />
        </SelectItem>
      )),
    [allAdmins],
  );

  // Early return for error state
  if (error) {
    return (
      <div className="text-sm text-red-500">Error loading admins: {error}</div>
    );
  }

  return (
    <div>
      <label
        htmlFor="admins"
        className="mb-1 block text-sm font-medium text-white"
      >
        Assign Admins
      </label>

      <Select
        size="lg"
        id="admins"
        variant="bordered"
        isLoading={isLoading}
        selectionMode="multiple"
        aria-label="Assign Admins"
        selectedKeys={assignedAdmins}
        placeholder="Select Admins to Assign"
        onSelectionChange={handleAdminSelectionChange}
        classNames={{
          base: "h-auto bg-dark w-full",
          value: "text-sm",
          trigger:
            "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
        }}
      >
        {adminSelectItems}
      </Select>

      {isLoading && (
        <p className="mt-1 text-xs text-gray-400">Loading admins...</p>
      )}
    </div>
  );
});

AdminSelector.displayName = "AdminSelector";

export default AdminSelector;
