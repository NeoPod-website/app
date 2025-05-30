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

const CategoriesError = ({ error, reset }) => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("Error in Categories:", error);
  }, [error]);

  const routeInfo = parseRouteSegments(pathname, "categories");

  const errorMessages = getErrorMessages("categories");
  const backLinkLabels = getBackLinkLabels("categories");

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        title: "Manage",
      },
      {
        title: "Categories",
        href: "/admin/manage/categories",
      },
    ];

    // Add descriptive breadcrumbs without IDs
    if (routeInfo.level === "pod") {
      breadcrumbs.push({
        title: getBreadcrumbTitle("categories", "pod"),
        href: `/admin/manage/categories/${routeInfo.podId}`,
      });
    }

    if (routeInfo.level === "category") {
      breadcrumbs.push({
        title: getBreadcrumbTitle("categories", "pod"),
        href: `/admin/manage/categories/${routeInfo.podId}`,
      });
      breadcrumbs.push({
        title: getBreadcrumbTitle("categories", "category"),
      });
    }

    if (routeInfo.level === "create") {
      if (routeInfo.podId) {
        breadcrumbs.push({
          title: getBreadcrumbTitle("categories", "pod"),
          href: `/admin/manage/categories/${routeInfo.podId}`,
        });
      }
      breadcrumbs.push({
        title: getBreadcrumbTitle("categories", "create"),
      });
    }

    if (routeInfo.level === "edit") {
      breadcrumbs.push({
        title: getBreadcrumbTitle("categories", "pod"),
        href: `/admin/manage/categories/${routeInfo.podId}`,
      });
      breadcrumbs.push({
        title: getBreadcrumbTitle("categories", "category"),
        href: `/admin/manage/categories/${routeInfo.podId}/${routeInfo.categoryId}`,
      });
      breadcrumbs.push({
        title: getBreadcrumbTitle("categories", "edit"),
      });
    }

    breadcrumbs.push({
      title: "Error",
    });

    return breadcrumbs;
  };

  const getBackLink = () => {
    switch (routeInfo.level) {
      case "edit":
      case "category":
        return `/admin/manage/categories/${routeInfo.podId}`;
      case "create":
      case "pod":
        return "/admin/manage/categories";
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
        return routeInfo.podId
          ? `/admin/manage/categories/${routeInfo.podId}/create`
          : "/admin/manage/categories";
      case "category":
      case "edit":
        return `/admin/manage/categories/${routeInfo.podId}`;
      case "create":
      default:
        return "/admin/manage/categories";
    }
  };

  const getTopActionLabel = () => {
    switch (routeInfo.level) {
      case "main":
        return "Back to Dashboard";
      case "pod":
        return "Create Category";
      case "category":
      case "edit":
        return "Back to Pod";
      case "create":
      default:
        return "Back to Categories";
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

export default CategoriesError;
