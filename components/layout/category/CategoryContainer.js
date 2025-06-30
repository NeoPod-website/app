// import React, { Suspense } from "react";
// import { cookies } from "next/headers";
// import { notFound } from "next/navigation";

// import CategoryItem from "./CategoryItem";
// import QuestList from "../quests/QuestList";

// import WrapperContainer from "@/components/common/WrapperContainer";
// import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

// // Empty state components
// const EmptyStateMessage = ({ title, description }) => (
//   <div className="space-y-2 text-center">
//     <p className="text-xl font-bold text-white">{title}</p>
//     <p className="text-base text-gray-200">{description}</p>
//   </div>
// );

// const QuestLoadError = ({ category, error }) => (
//   <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//     <EmptyStateMessage
//       title="Failed to load quests"
//       description={
//         error || "An error occurred while loading quests for this category"
//       }
//     />
//   </div>
// );

// async function fetchQuests(categoryId) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("neo-jwt");

//     if (!token?.value) {
//       throw new Error("Authentication token not found");
//     }

//     // Using the same endpoint as admin but for ambassadors
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/quests/categories/${categoryId}`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token.value}`,
//       },
//       credentials: "include",
//       cache: "no-store",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       if (response.status === 404) {
//         notFound();
//       }

//       throw new Error(
//         data.message || `Failed to fetch quests: ${response.statusText}`,
//       );
//     }

//     return data.data;
//   } catch (error) {
//     console.error("Error fetching quests:", error);
//     throw error;
//   }
// }

// // Validation function for category
// const validateCategory = (category) => {
//   if (!category || typeof category !== "object") {
//     return { isValid: false, error: "Invalid category data" };
//   }

//   const requiredFields = ["category_id", "name", "pod_id"];
//   const missingFields = requiredFields.filter((field) => !category[field]);

//   if (missingFields.length > 0) {
//     return {
//       isValid: false,
//       error: `Missing required fields: ${missingFields.join(", ")}`,
//     };
//   }

//   return { isValid: true };
// };

// // Validate and filter quests - only show active quests for ambassadors
// const validateQuests = (questsData) => {
//   if (!questsData?.quests || !Array.isArray(questsData.quests)) {
//     return [];
//   }

//   return questsData.quests.filter(
//     (quest) =>
//       quest &&
//       typeof quest === "object" &&
//       quest.quest_id &&
//       quest.name &&
//       quest.status === "active",
//   );
// };

// // Layout wrapper component for consistency
// const QuestContainerLayout = ({
//   category,
//   children,
//   isQuestPage,
//   scrollable = true,
//   showCategoryItem = true,
// }) => {
//   return (
//     <WrapperContainer scrollable={scrollable}>
//       {showCategoryItem && category && (
//         <CategoryItem
//           isAdmin={false}
//           showDescription
//           podId={category.pod_id}
//           status={category.status}
//           isQuestPage={isQuestPage}
//           id={category.category_id}
//           title={category.name ?? "No Category"}
//           description={category.description ?? ""}
//           icon={category.icon ?? "/dashboard/category/icon-1.png"}
//           background={
//             category.background ?? "/dashboard/category/background-2.jpg"
//           }
//         />
//       )}

//       {children}
//     </WrapperContainer>
//   );
// };

// const CategoryContainer = async ({
//   category,
//   compact = false,
//   scrollable = false,
//   isQuestPage = false,
// }) => {
//   // Early validation - check if category exists at all
//   if (!category) {
//     return (
//       <QuestContainerLayout
//         category={null}
//         scrollable={false}
//         showCategoryItem={false}
//         isQuestPage={isQuestPage}
//       >
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//           <EmptyStateMessage
//             title="No Category Data"
//             description="Category information is missing"
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   // Validate category structure
//   const categoryValidation = validateCategory(category);

//   if (!categoryValidation.isValid) {
//     return (
//       <QuestContainerLayout category={category} scrollable={false}>
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//           <EmptyStateMessage
//             title="Invalid Category"
//             description={categoryValidation.error}
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   const questsData = await fetchQuests(category.category_id);

//   // Validate quests data and filter for active quests only
//   const validQuests = validateQuests(questsData);

//   return (
//     <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
//       <Suspense>
//         <QuestList
//           compact={compact}
//           quests={validQuests}
//           scrollable={scrollable}
//           categoryId={category.category_id}
//         />
//       </Suspense>
//     </QuestContainerLayout>
//   );
// };

// export default CategoryContainer;

// import React, { Suspense } from "react";
// import { cookies } from "next/headers";
// import { notFound } from "next/navigation";

// import CategoryItem from "./CategoryItem";
// import QuestList from "../quests/QuestList";
// import {
//   getCompletedQuestIds,
//   fetchQuestAvailabilityData,
// } from "@/utils/dataFetching";

// import WrapperContainer from "@/components/common/WrapperContainer";
// import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

// // Empty state components
// const EmptyStateMessage = ({ title, description }) => (
//   <div className="space-y-2 text-center">
//     <p className="text-xl font-bold text-white">{title}</p>
//     <p className="text-base text-gray-200">{description}</p>
//   </div>
// );

// const QuestLoadError = ({ category, error }) => (
//   <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//     <EmptyStateMessage
//       title="Failed to load quests"
//       description={
//         error || "An error occurred while loading quests for this category"
//       }
//     />
//   </div>
// );

// // Fetch quests for the category
// async function fetchQuests(categoryId) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("neo-jwt");

//     if (!token?.value) {
//       throw new Error("Authentication token not found");
//     }

//     let url = `${process.env.NEXT_PUBLIC_API_URL}/quests/categories/${categoryId}`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token.value}`,
//       },
//       credentials: "include",
//       cache: "no-store",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       if (response.status === 404) {
//         notFound();
//       }
//       throw new Error(
//         data.message || `Failed to fetch quests: ${response.statusText}`,
//       );
//     }

//     return data.data;
//   } catch (error) {
//     console.error("Error fetching quests:", error);
//     throw error;
//   }
// }

// // Validation function for category
// const validateCategory = (category) => {
//   if (!category || typeof category !== "object") {
//     return { isValid: false, error: "Invalid category data" };
//   }

//   const requiredFields = ["category_id", "name", "pod_id"];
//   const missingFields = requiredFields.filter((field) => !category[field]);

//   if (missingFields.length > 0) {
//     return {
//       isValid: false,
//       error: `Missing required fields: ${missingFields.join(", ")}`,
//     };
//   }

//   return { isValid: true };
// };

// // Validate user object
// const validateUser = (user) => {
//   if (!user || typeof user !== "object") {
//     return { isValid: false, error: "User object is required" };
//   }

//   if (!user.ambassador_id) {
//     return { isValid: false, error: "User ID is missing" };
//   }

//   return { isValid: true };
// };

// // Validate and filter quests - admin already sends only active quests
// const validateQuests = (questsData) => {
//   if (!questsData?.quests || !Array.isArray(questsData.quests)) {
//     return [];
//   }

//   return questsData.quests.filter(
//     (quest) =>
//       quest && typeof quest === "object" && quest.quest_id && quest.name,
//   );
// };

// // Layout wrapper component for consistency
// const QuestContainerLayout = ({
//   category,
//   children,
//   isQuestPage,
//   scrollable = true,
//   showCategoryItem = true,
// }) => {
//   return (
//     <WrapperContainer scrollable={scrollable}>
//       {showCategoryItem && category && (
//         <CategoryItem
//           isAdmin={false}
//           showDescription
//           podId={category.pod_id}
//           status={category.status}
//           isQuestPage={isQuestPage}
//           id={category.category_id}
//           title={category.name ?? "No Category"}
//           description={category.description ?? ""}
//           icon={category.icon ?? "/dashboard/category/icon-1.png"}
//           background={
//             category.background ?? "/dashboard/category/background-2.jpg"
//           }
//         />
//       )}

//       {children}
//     </WrapperContainer>
//   );
// };

// const CategoryContainer = async ({
//   user,
//   category,
//   compact = false,
//   scrollable = false,
//   isQuestPage = false,
// }) => {
//   // Early validation - check if category exists
//   if (!category) {
//     return (
//       <QuestContainerLayout
//         category={null}
//         scrollable={false}
//         showCategoryItem={false}
//         isQuestPage={isQuestPage}
//       >
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//           <EmptyStateMessage
//             title="No Category Data"
//             description="Category information is missing"
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   // Validate user object
//   const userValidation = validateUser(user);
//   if (!userValidation.isValid) {
//     return (
//       <QuestContainerLayout category={category} scrollable={false}>
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//           <EmptyStateMessage
//             title="User Authentication Required"
//             description={userValidation.error}
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   // Validate category structure
//   const categoryValidation = validateCategory(category);
//   if (!categoryValidation.isValid) {
//     return (
//       <QuestContainerLayout category={category} scrollable={false}>
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//           <EmptyStateMessage
//             title="Invalid Category"
//             description={categoryValidation.error}
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   // Get the token first
//   const cookieStore = await cookies();
//   const token = cookieStore.get("neo-jwt");

//   if (!token?.value) {
//     throw new Error("Authentication token not found");
//   }

//   // Fetch quests first
//   const questsData = await fetchQuests(category.category_id);
//   const quests = validateQuests(questsData);

//   if (quests.length === 0) {
//     return (
//       <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
//           <EmptyStateMessage
//             title="No quests available"
//             description="Check back later for new quests in this category"
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   // Fetch targeted submission data for these specific quests
//   const { questSubmissionsByQuestId } = await fetchQuestAvailabilityData(
//     quests,
//     token.value,
//   );

//   // Get completed quest IDs from the submission data
//   const completedQuests = getCompletedQuestIds(questSubmissionsByQuestId);

//   return (
//     <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
//       <Suspense fallback={<QuestListLoader />}>
//         <QuestList
//           user={user}
//           quests={quests}
//           compact={compact}
//           scrollable={scrollable}
//           showUnavailable={false} // Set to true for debugging
//           categoryId={category.category_id}
//           completedQuests={completedQuests}
//           questSubmissionsByQuestId={questSubmissionsByQuestId}
//         />
//       </Suspense>
//     </QuestContainerLayout>
//   );
// };

// export default CategoryContainer;

// "use client";

// import React, { useState, useEffect } from "react";
// import CategoryItem from "./CategoryItem";
// import QuestList from "../quests/QuestList";
// import WrapperContainer from "@/components/common/WrapperContainer";
// import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

// // Empty state components
// const EmptyStateMessage = ({ title, description }) => (
//   <div className="space-y-2 text-center">
//     <p className="text-xl font-bold text-white">{title}</p>
//     <p className="text-base text-gray-200">{description}</p>
//   </div>
// );

// const QuestLoadError = ({ category, error }) => (
//   <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//     <EmptyStateMessage
//       title="Failed to load quests"
//       description={
//         error || "An error occurred while loading quests for this category"
//       }
//     />
//   </div>
// );

// // Layout wrapper component
// const QuestContainerLayout = ({
//   category,
//   children,
//   isQuestPage,
//   scrollable = true,
//   showCategoryItem = true,
// }) => {
//   return (
//     <WrapperContainer scrollable={scrollable}>
//       {showCategoryItem && category && (
//         <CategoryItem
//           isAdmin={false}
//           showDescription
//           podId={category.pod_id}
//           status={category.status}
//           isQuestPage={isQuestPage}
//           id={category.category_id}
//           title={category.name ?? "No Category"}
//           description={category.description ?? ""}
//           icon={category.icon ?? "/dashboard/category/icon-1.png"}
//           background={
//             category.background ?? "/dashboard/category/background-2.jpg"
//           }
//         />
//       )}
//       {children}
//     </WrapperContainer>
//   );
// };

// const CategoryContainer = ({
//   user,
//   category,
//   compact = false,
//   scrollable = false,
//   isQuestPage = false,
// }) => {
//   const [quests, setQuests] = useState([]);
//   const [userSubmissions, setUserSubmissions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch quests for the category
//   const fetchQuests = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/quests/categories/${category.category_id}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch quests: ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data.data?.quests || [];
//     } catch (error) {
//       console.error("Error fetching quests:", error);
//       throw error;
//     }
//   };

//   // Fetch user submissions for specific quests
//   const fetchUserSubmissions = async (questIds) => {
//     try {
//       if (!questIds || questIds.length === 0) {
//         return {};
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/submissions/filter-for-quests`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({ questIds }),
//         },
//       );

//       if (!response.ok) {
//         console.error("Failed to fetch submissions:", response.statusText);
//         return {}; // Return empty object instead of throwing
//       }

//       const data = await response.json();
//       return data.data?.submissions || {};
//     } catch (error) {
//       console.error("Error fetching user submissions:", error);
//       return {}; // Return empty object instead of throwing
//     }
//   };

//   // Main useEffect to fetch data
//   useEffect(() => {
//     const loadData = async () => {
//       if (!category?.category_id || !user?.ambassador_id) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         // Step 1: Fetch quests
//         console.log("Fetching quests for category:", category.category_id);
//         const fetchedQuests = await fetchQuests();
//         console.log("Fetched quests:", fetchedQuests);

//         if (!fetchedQuests || fetchedQuests.length === 0) {
//           setQuests([]);
//           setUserSubmissions({});
//           setLoading(false);
//           return;
//         }

//         // Filter only active quests
//         const activeQuests = fetchedQuests.filter(
//           (quest) =>
//             quest && quest.quest_id && quest.name && quest.status === "active",
//         );

//         setQuests(activeQuests);

//         // Step 2: Fetch user submissions for these quests
//         if (activeQuests.length > 0) {
//           const questIds = activeQuests.map((q) => q.quest_id);
//           console.log("Fetching submissions for quest IDs:", questIds);

//           const submissions = await fetchUserSubmissions(questIds);
//           console.log("Fetched submissions:", submissions);

//           setUserSubmissions(submissions);
//         } else {
//           setUserSubmissions({});
//         }
//       } catch (err) {
//         console.error("Error loading quest data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [category?.category_id, user?.ambassador_id]);

//   // Validation
//   if (!category) {
//     return (
//       <QuestContainerLayout
//         category={null}
//         scrollable={false}
//         showCategoryItem={false}
//         isQuestPage={isQuestPage}
//       >
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//           <EmptyStateMessage
//             title="No Category Data"
//             description="Category information is missing"
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   if (!user?.ambassador_id) {
//     return (
//       <QuestContainerLayout category={category} scrollable={false}>
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
//           <EmptyStateMessage
//             title="User Authentication Required"
//             description="Please log in to view quests"
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
//         <QuestListLoader />
//       </QuestContainerLayout>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <QuestContainerLayout category={category} scrollable={false}>
//         <QuestLoadError category={category} error={error} />
//       </QuestContainerLayout>
//     );
//   }

//   // No quests state
//   if (!quests || quests.length === 0) {
//     return (
//       <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
//         <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
//           <EmptyStateMessage
//             title="No quests available"
//             description="Check back later for new quests in this category"
//           />
//         </div>
//       </QuestContainerLayout>
//     );
//   }

//   // Get completed quest IDs
//   const completedQuests = [];
//   Object.entries(userSubmissions).forEach(([questId, submissions]) => {
//     if (Array.isArray(submissions)) {
//       const hasApprovedSubmission = submissions.some(
//         (sub) => sub.review_status === "approved",
//       );
//       if (hasApprovedSubmission) {
//         completedQuests.push(questId);
//       }
//     }
//   });

//   console.log("Rendering with data:", {
//     quests: quests.length,
//     userSubmissions: Object.keys(userSubmissions).length,
//     completedQuests: completedQuests.length,
//   });

//   return (
//     <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
//       <QuestList
//         user={user}
//         quests={quests}
//         compact={compact}
//         scrollable={scrollable}
//         showUnavailable={false}
//         categoryId={category.category_id}
//         completedQuests={completedQuests}
//         questSubmissionsByQuestId={userSubmissions}
//       />
//     </QuestContainerLayout>
//   );
// };

// export default CategoryContainer;

import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import CategoryItem from "./CategoryItem";
import QuestList from "../quests/QuestList";

import WrapperContainer from "@/components/common/WrapperContainer";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";

// Empty state components
const EmptyStateMessage = ({ title, description }) => (
  <div className="space-y-2 text-center">
    <p className="text-xl font-bold text-white">{title}</p>
    <p className="text-base text-gray-200">{description}</p>
  </div>
);

// Fetch quests for the category
const fetchQuests = async (categoryId) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quests/categories/${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }

      throw new Error(
        data.message || `Failed to fetch quests: ${response.statusText}`,
      );
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching quests:", error);
    throw error;
  }
};

// Fetch user submissions for specific quests
const fetchUserSubmissions = async (questIds) => {
  try {
    if (!questIds || questIds.length === 0) {
      return {};
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/submissions/filter-for-quests`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ questIds }),
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch submissions:", response.statusText);
      return {};
    }

    const data = await response.json();
    return data.data?.submissions || {};
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    return {};
  }
};

// Validation functions
const validateCategory = (category) => {
  if (!category || typeof category !== "object") {
    return { isValid: false, error: "Invalid category data" };
  }

  const requiredFields = ["category_id", "name", "pod_id"];
  const missingFields = requiredFields.filter((field) => !category[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return { isValid: true };
};

const validateUser = (user) => {
  if (!user || typeof user !== "object") {
    return { isValid: false, error: "User object is required" };
  }

  if (!user.ambassador_id) {
    return { isValid: false, error: "User ambassador ID is missing" };
  }

  return { isValid: true };
};

const validateQuests = (questsData) => {
  if (!questsData?.quests || !Array.isArray(questsData.quests)) {
    return [];
  }

  return questsData.quests.filter(
    (quest) =>
      quest &&
      typeof quest === "object" &&
      quest.quest_id &&
      quest.name &&
      quest.status === "active",
  );
};

// Get completed quest IDs from submissions
const getCompletedQuestIds = (userSubmissions) => {
  const completedQuests = [];

  Object.entries(userSubmissions).forEach(([questId, submissions]) => {
    if (Array.isArray(submissions)) {
      const hasApprovedSubmission = submissions.some(
        (sub) => sub.review_status === "approved",
      );
      if (hasApprovedSubmission) {
        completedQuests.push(questId);
      }
    }
  });

  return completedQuests;
};

// Layout wrapper component
const QuestContainerLayout = ({
  category,
  children,
  isQuestPage,
  scrollable = true,
  showCategoryItem = true,
}) => {
  return (
    <WrapperContainer scrollable={scrollable}>
      {showCategoryItem && category && (
        <CategoryItem
          isAdmin={false}
          showDescription
          podId={category.pod_id}
          status={category.status}
          isQuestPage={isQuestPage}
          id={category.category_id}
          title={category.name ?? "No Category"}
          description={category.description ?? ""}
          icon={category.icon ?? "/dashboard/category/icon-1.png"}
          background={
            category.background ?? "/dashboard/category/background-2.jpg"
          }
        />
      )}
      {children}
    </WrapperContainer>
  );
};

const CategoryContainer = async ({
  user,
  category,
  compact = false,
  scrollable = false,
  isQuestPage = false,
}) => {
  // Early validation - check if category exists
  if (!category) {
    return (
      <QuestContainerLayout
        category={null}
        scrollable={false}
        showCategoryItem={false}
        isQuestPage={isQuestPage}
      >
        <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <EmptyStateMessage
            title="No Category Data"
            description="Category information is missing"
          />
        </div>
      </QuestContainerLayout>
    );
  }

  // Validate user object
  const userValidation = validateUser(user);

  if (!userValidation.isValid) {
    return (
      <QuestContainerLayout category={category} scrollable={false}>
        <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <EmptyStateMessage
            title="User Authentication Required"
            description={userValidation.error}
          />
        </div>
      </QuestContainerLayout>
    );
  }

  // Validate category structure
  const categoryValidation = validateCategory(category);

  if (!categoryValidation.isValid) {
    return (
      <QuestContainerLayout category={category} scrollable={false}>
        <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <EmptyStateMessage
            title="Invalid Category"
            description={categoryValidation.error}
          />
        </div>
      </QuestContainerLayout>
    );
  }

  // Fetch quests for this category
  const questsData = await fetchQuests(category.category_id);
  const quests = validateQuests(questsData);

  // Handle no quests case
  if (!quests || quests.length === 0) {
    return (
      <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
        <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
          <EmptyStateMessage
            title="No quests available"
            description="Check back later for new quests in this category"
          />
        </div>
      </QuestContainerLayout>
    );
  }

  // Fetch user submissions for these specific quests
  const questIds = quests.map((q) => q.quest_id);

  const userSubmissions = await fetchUserSubmissions(questIds);

  // Get completed quest IDs
  const completedQuests = getCompletedQuestIds(userSubmissions);

  return (
    <QuestContainerLayout category={category} isQuestPage={isQuestPage}>
      <Suspense fallback={<QuestListLoader />}>
        <QuestList
          user={user}
          quests={quests}
          compact={compact}
          scrollable={scrollable}
          showUnavailable={false}
          categoryId={category.category_id}
          completedQuests={completedQuests}
          questSubmissionsByQuestId={userSubmissions}
        />
      </Suspense>
    </QuestContainerLayout>
  );
};

export default CategoryContainer;
