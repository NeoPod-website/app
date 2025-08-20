// "use client";

// import { addToast } from "@heroui/react";
// import { useSelector } from "react-redux";
// import { useEffect, useCallback, useMemo } from "react";
// import { useRouter, usePathname } from "next/navigation";

// // Route configuration - easily extensible
// const ROUTE_CONFIG = [
//   {
//     pattern: "/view/quests",
//     getRedirectPath: (podId) => `/view/quests/${podId}`,
//   },
//   {
//     pattern: "/admin/manage/categories",
//     getRedirectPath: (podId) => `/admin/manage/categories/${podId}`,
//   },
//   {
//     pattern: "/admin/manage/ambassadors",
//     getRedirectPath: (podId) => `/admin/manage/ambassadors/${podId}`,
//   },
// ];

// const LOADING_DELAY = 1500;

// const PodProvider = ({ children }) => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const currentPod = useSelector((state) => state.pods.currentPod);

//   // Memoize the matching route to avoid recalculation
//   const matchingRoute = useMemo(() => {
//     return ROUTE_CONFIG.find((route) => pathname.includes(route.pattern));
//   }, [pathname]);

//   // Memoized toast error message
//   const showNoPodToast = useCallback(() => {
//     addToast({
//       title: "No Pod Selected",
//       description: "Please select a pod to navigate to the requested page.",
//       color: "warning",
//     });
//   }, []);

//   // Handle navigation logic
//   const handleNavigation = useCallback(() => {
//     if (!matchingRoute) return;

//     if (currentPod) {
//       const redirectPath = matchingRoute.getRedirectPath(currentPod);
//       router.push(redirectPath);
//     } else {
//       showNoPodToast();
//     }
//   }, [currentPod, matchingRoute, router, showNoPodToast]);

//   useEffect(() => {
//     // Only set timer if there's a matching route
//     if (!matchingRoute) return;

//     const loadingTimer = setTimeout(handleNavigation, LOADING_DELAY);

//     return () => clearTimeout(loadingTimer);
//   }, [matchingRoute, handleNavigation]);

//   return <>{children}</>;
// };

// export default PodProvider;

"use client";

import { addToast } from "@heroui/react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useCallback, useMemo, useRef } from "react";

// Route configuration - single source of truth
const ROUTES = {
  "/view/quests": (podId) => `/view/quests/${podId}`,
  "/admin/manage/quests": (podId) => `/admin/manage/quests/${podId}`,
  "/admin/manage/categories": (podId) => `/admin/manage/categories/${podId}`,
  "/admin/manage/ambassadors": (podId) => `/admin/manage/ambassadors/${podId}`,
};

const PodProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentPod = useSelector((state) => state.pods.currentPod);

  const hasRedirected = useRef(false);

  // Find matching route using Object.keys for fastest lookup
  const getRedirectPath = useMemo(() => {
    const matchingPattern = Object.keys(ROUTES).find((pattern) =>
      pathname.includes(pattern),
    );

    return matchingPattern ? ROUTES[matchingPattern] : null;
  }, [pathname]);

  const showNoPodError = useCallback(() => {
    addToast({
      title: "No Pod Selected",
      description: "Please select a pod to continue.",
      color: "warning",
    });
  }, []);

  useEffect(() => {
    // Early returns for performance
    if (!getRedirectPath || hasRedirected.current) return;

    // Immediate redirect if pod exists
    if (currentPod) {
      hasRedirected.current = true;
      router.push(getRedirectPath(currentPod));

      return;
    }

    const timeoutId = setTimeout(() => {
      if (!hasRedirected.current) {
        hasRedirected.current = true;

        if (currentPod) {
          router.push(getRedirectPath(currentPod));
        } else {
          showNoPodError();
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPod, getRedirectPath, router, showNoPodError]);

  return children;
};

export default PodProvider;
