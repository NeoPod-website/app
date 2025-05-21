"use client";

import { Undo2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Link } from "@heroui/react";
import { usePathname } from "next/navigation";

const AdminViewBtn = () => {
  const pathname = usePathname();

  const isAdminView = pathname.startsWith("/admin");
  const [lastAdminPath, setLastAdminPath] = useState("/admin/dashboard");

  // Store the last admin path when navigating to user view
  useEffect(() => {
    if (isAdminView) {
      setLastAdminPath(pathname);
      // Save to localStorage for persistence across page loads
      localStorage.setItem("lastAdminPath", pathname);
    }
  }, [isAdminView, pathname]);

  // On initial load, try to restore last admin path
  useEffect(() => {
    const savedPath = localStorage.getItem("lastAdminPath");
    if (savedPath) {
      setLastAdminPath(savedPath);
    }
  }, []);

  // Determine target path based on current view
  const getTargetPath = () => {
    if (isAdminView) {
      // From admin to user: always go to /quests
      return "/quests";
    } else {
      // From user to admin: go to last admin path
      return lastAdminPath || "/admin/dashboard";
    }
  };

  return isAdminView ? (
    <Button
      as={Link}
      href={getTargetPath()}
      className="h-11 w-fit min-w-0 rounded-full border-t border-gray-400 bg-gradient-dark px-4 py-2.5"
    >
      Preview User View
    </Button>
  ) : (
    <Button
      as={Link}
      href={getTargetPath()}
      className="h-11 w-fit min-w-0 rounded-full border-t border-gray-400 bg-gradient-dark px-4 py-2.5"
      startContent={<Undo2Icon size={20} className="text-white" />}
    >
      Back to Admin View
    </Button>
  );
};

export default AdminViewBtn;
