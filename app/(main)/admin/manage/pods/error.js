"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SendHorizontalIcon } from "lucide-react";

import ManageError from "@/components/common/manage/ManageError";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

import {
  getErrorMessages,
  getBackLinkLabels,
  getBreadcrumbTitle,
  parseRouteSegments,
} from "@/utils/errorUtils";

const PodsError = ({ error, reset }) => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("Error in Pods:", error);
  }, [error]);

  const routeInfo = parseRouteSegments(pathname, "pods");

  const errorMessages = getErrorMessages("pods");
  const backLinkLabels = getBackLinkLabels("pods");

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        title: "Manage",
      },
      {
        title: "Pods",
        href: "/admin/manage/pods",
      },
    ];

    // Add descriptive breadcrumbs without IDs
    if (routeInfo.level === "pod") {
      breadcrumbs.push({
        title: getBreadcrumbTitle("pods", "pod"),
      });
    }

    if (routeInfo.level === "create") {
      breadcrumbs.push({
        title: getBreadcrumbTitle("pods", "create"),
      });
    }

    breadcrumbs.push({
      title: "Error",
    });

    return breadcrumbs;
  };

  const getBackLink = () => {
    switch (routeInfo.level) {
      case "pod":
      case "create":
        return "/admin/manage/pods";
      case "main":
      default:
        return "/admin/dashboard";
    }
  };

  const getTopActionLink = () => {
    switch (routeInfo.level) {
      case "main":
        return "/admin/manage/pods/create";
      case "pod":
        return "/admin/manage/pods";
      case "create":
      default:
        return "/admin/dashboard";
    }
  };

  const getTopActionLabel = () => {
    switch (routeInfo.level) {
      case "main":
        return "Create Pod";
      case "pod":
        return "Back to Pods";
      case "create":
      default:
        return "Back to Dashboard";
    }
  };

  return (
    <ManagePageWrapper
      href={getTopActionLink()}
      scrollable={false}
      linkLabel={getTopActionLabel()}
      list={getBreadcrumbs()}
      icon={<SendHorizontalIcon size={16} className="-mt-0.5" />}
    >
      <ManageError
        error={error}
        linkHref={getBackLink()}
        message={errorMessages[routeInfo.level]}
        linkLabel={backLinkLabels[routeInfo.level]}
        handleRetry={() => {
          reset();
        }}
      />
    </ManagePageWrapper>
  );
};

export default PodsError;
