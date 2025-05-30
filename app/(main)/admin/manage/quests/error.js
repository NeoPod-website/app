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

const QuestsError = ({ error, reset }) => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("Error in Quests:", error);
  }, [error]);

  const routeInfo = parseRouteSegments(pathname, "quests");

  const errorMessages = getErrorMessages("quests");
  const backLinkLabels = getBackLinkLabels("quests");

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        title: "Manage",
      },
      {
        title: "Quests",
        href: "/admin/manage/quests",
      },
    ];

    // Add descriptive breadcrumbs without IDs
    if (routeInfo.level === "pod") {
      breadcrumbs.push({
        title: getBreadcrumbTitle("quests", "pod"),
        href: `/admin/manage/quests/${routeInfo.podId}`,
      });
    }

    if (routeInfo.level === "category") {
      breadcrumbs.push({
        title: getBreadcrumbTitle("quests", "pod"),
        href: `/admin/manage/quests/${routeInfo.podId}`,
      });
      breadcrumbs.push({
        title: getBreadcrumbTitle("quests", "category"),
        href: `/admin/manage/quests/${routeInfo.podId}/${routeInfo.categoryId}`,
      });
    }

    if (routeInfo.level === "quest") {
      breadcrumbs.push({
        title: getBreadcrumbTitle("quests", "pod"),
        href: `/admin/manage/quests/${routeInfo.podId}`,
      });
      breadcrumbs.push({
        title: getBreadcrumbTitle("quests", "category"),
        href: `/admin/manage/quests/${routeInfo.podId}/${routeInfo.categoryId}`,
      });
      breadcrumbs.push({
        title: getBreadcrumbTitle("quests", "quest"),
      });
    }

    if (routeInfo.level === "create") {
      if (routeInfo.podId) {
        breadcrumbs.push({
          title: getBreadcrumbTitle("quests", "pod"),
          href: `/admin/manage/quests/${routeInfo.podId}`,
        });
      }
      if (routeInfo.categoryId) {
        breadcrumbs.push({
          title: getBreadcrumbTitle("quests", "category"),
          href: `/admin/manage/quests/${routeInfo.podId}/${routeInfo.categoryId}`,
        });
      }
      breadcrumbs.push({
        title: getBreadcrumbTitle("quests", "create"),
      });
    }

    breadcrumbs.push({
      title: "Error",
    });

    return breadcrumbs;
  };

  const getBackLink = () => {
    switch (routeInfo.level) {
      case "create":
      case "quest":
        return routeInfo.podId && routeInfo.categoryId
          ? `/admin/manage/quests/${routeInfo.podId}/${routeInfo.categoryId}`
          : "/admin/manage/quests";
      case "category":
        return routeInfo.podId
          ? `/admin/manage/quests/${routeInfo.podId}`
          : "/admin/manage/quests";
      case "pod":
        return "/admin/manage/quests";
      case "main":
      default:
        return "/admin/dashboard";
    }
  };

  const getTopActionLink = () => {
    switch (routeInfo.level) {
      case "main":
        return "/admin/dashboard";
      case "pod":
        return "/admin/manage/quests";
      case "category":
        return routeInfo.podId && routeInfo.categoryId
          ? `/admin/manage/quests/${routeInfo.podId}/${routeInfo.categoryId}/create`
          : "/admin/manage/quests";
      case "quest":
        return routeInfo.podId && routeInfo.categoryId
          ? `/admin/manage/quests/${routeInfo.podId}/${routeInfo.categoryId}`
          : "/admin/manage/quests";
      case "create":
      default:
        return routeInfo.podId && routeInfo.categoryId
          ? `/admin/manage/quests/${routeInfo.podId}/${routeInfo.categoryId}`
          : "/admin/manage/quests";
    }
  };

  const getTopActionLabel = () => {
    switch (routeInfo.level) {
      case "main":
        return "Back to Dashboard";
      case "pod":
        return "Back to Quests";
      case "category":
        return "Create Quest";
      case "quest":
        return "Back to Category";
      case "create":
      default:
        return "Back to Category";
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

export default QuestsError;
