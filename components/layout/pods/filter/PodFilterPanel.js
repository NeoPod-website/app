"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

import { Button, Select, SelectItem, Tab, Tabs } from "@heroui/react";

export const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "live", label: "Live" },
  { value: "draft", label: "Draft" },
  { value: "archive", label: "Archive" },
];

const PodFilterPanel = ({
  statusFilter,
  setStatusFilter,
  adminFilter,
  setAdminFilter,
  resetFilters,
  hasActiveFilters,
}) => {
  const [allAdmins, setAllAdmins] = useState([]);
  const [adminError, setAdminError] = useState(null);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);

  // Fetch admins for dropdown
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoadingAdmins(true);
      setAdminError(null);

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

        const data = await res.json();

        setAllAdmins(data.data.admins || []);
      } catch (err) {
        setAdminError(err.message);
      } finally {
        setIsLoadingAdmins(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleAdminSelectionChange = (keys) => {
    // If there's only one admin selected, use that admin's username
    if (keys.size === 1) {
      setAdminFilter(Array.from(keys)[0]);
    } else {
      // If no admin or multiple admins selected, clear the filter
      setAdminFilter("");
    }
  };

  return (
    <div className="mb-3 flex items-center justify-between px-8">
      <Tabs
        selectedKey={statusFilter}
        onSelectionChange={setStatusFilter}
        classNames={{
          base: "rounded-full border-2 border-white p-1",
          tabList: "bg-transparent p-0",
          tab: "rounded-full px-4 py-2 transition-colors",
          cursor: "bg-white rounded-full",
          tabContent:
            "group-data-[selected=true]:text-black group-data-[selected=false]:text-gray-200 hover:text-white",
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <Tab key={option.value} title={option.label} />
        ))}
      </Tabs>

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="w-full max-w-80">
          {!adminError ? (
            <Select
              size="md"
              variant="bordered"
              className="w-full"
              selectionMode="single"
              isLoading={isLoadingAdmins}
              aria-label="Filter by Admin"
              placeholder="Filter by Admin"
              onSelectionChange={handleAdminSelectionChange}
              selectedKeys={adminFilter ? [adminFilter] : []}
              classNames={{
                base: "bg-transparent",
                value: "text-base",
                trigger:
                  "border-2 border-white data-[hover=true]:!bg-black/60 data-[hover=true]:border-white rounded-full",
              }}
            >
              <SelectItem key="" value="" textValue="All Admins">
                All Admins
              </SelectItem>

              {allAdmins.map((admin) => (
                <SelectItem
                  key={admin.username}
                  value={admin.username}
                  textValue={`${admin.username} (${admin.role_type})`}
                >
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

                    <span className="text-xs text-gray-400">
                      ({admin.role_type})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </Select>
          ) : (
            <p className="text-sm text-red-500">
              Error loading admins: {adminError}
            </p>
          )}

          {isLoadingAdmins && (
            <p className="mt-1 text-xs text-gray-400">Loading admins...</p>
          )}
        </div>

        <Button
          onPress={resetFilters}
          disabled={!hasActiveFilters}
          className="flex items-center gap-1 rounded-full border border-black bg-white px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default PodFilterPanel;
