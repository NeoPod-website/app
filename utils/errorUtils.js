export const parseRouteSegments = (pathname, routeType) => {
  try {
    if (!pathname) {
      return { level: "main", segments: [] };
    }

    const segments = pathname.split("/").filter(Boolean);
    const routeIndex = segments.findIndex((seg) => seg === routeType);

    if (routeIndex === -1) {
      return { level: "main", segments: [] };
    }

    const routeSegments = segments.slice(routeIndex + 1);

    return {
      level: determineRouteLevel(routeSegments, routeType),
      segments: routeSegments,
      ...extractRouteParams(routeSegments, routeType),
    };
  } catch (err) {
    console.error(`Error parsing ${routeType} route:`, err);
    return { level: "main", segments: [] };
  }
};

const determineRouteLevel = (segments, routeType) => {
  switch (routeType) {
    case "pods":
      return getPodRouteLevel(segments);
    case "categories":
      return getCategoryRouteLevel(segments);
    case "quests":
      return getQuestRouteLevel(segments);
    default:
      return "main";
  }
};

const getPodRouteLevel = (segments) => {
  switch (segments.length) {
    case 0:
      return "main";
    case 1:
      return segments[0] === "create" ? "create" : "pod";
    default:
      return "unknown";
  }
};

const getCategoryRouteLevel = (segments) => {
  switch (segments.length) {
    case 0:
      return "main";
    case 1:
      return "pod";
    case 2:
      return segments[1] === "create" ? "create" : "category";
    case 3:
      return segments[2] === "edit" ? "edit" : "unknown";
    default:
      return "unknown";
  }
};

const getQuestRouteLevel = (segments) => {
  switch (segments.length) {
    case 0:
      return "main";
    case 1:
      return "pod";
    case 2:
      return "category";
    case 3:
      return segments[2] === "create" ? "create" : "quest";
    default:
      return "unknown";
  }
};

const extractRouteParams = (segments, routeType) => {
  const params = {};

  switch (routeType) {
    case "pods":
      if (segments.length >= 1 && segments[0] !== "create") {
        params.podId = segments[0];
      }
      break;

    case "categories":
      if (segments.length >= 1) params.podId = segments[0];
      if (segments.length >= 2 && segments[1] !== "create") {
        params.categoryId = segments[1];
      }
      break;

    case "quests":
      if (segments.length >= 1) params.podId = segments[0];
      if (segments.length >= 2) params.categoryId = segments[1];
      if (segments.length >= 3 && segments[2] !== "create") {
        params.questId = segments[2];
      }
      break;
  }

  return params;
};

export const truncateId = (id, maxLength = 8) => {
  if (!id || id.length <= maxLength) return id;
  return `${id.slice(0, maxLength)}...`;
};

// Better approach - don't show IDs in breadcrumbs at all
export const getBreadcrumbTitle = (routeType, level) => {
  const titles = {
    pods: {
      pod: "Pod Details",
      create: "Create Pod",
    },
    categories: {
      pod: "Pod Categories",
      category: "Category Details",
      create: "Create Category",
      edit: "Edit Category",
    },
    quests: {
      pod: "Pod Quests",
      category: "Category Quests",
      quest: "Quest Details",
      create: "Create Quest",
    },
  };

  return titles[routeType]?.[level] || level;
};

export const getErrorMessages = (routeType) => {
  const messages = {
    pods: {
      main: "Failed to load pods. Please try again.",
      pod: "Failed to load pod details. Please try again.",
      create: "Failed to load pod creation page. Please try again.",
      unknown: "Failed to load page. Please try again.",
    },
    categories: {
      main: "Failed to load categories. Please try again.",
      pod: "Failed to load pod categories. Please try again.",
      category: "Failed to load category details. Please try again.",
      create: "Failed to load category creation page. Please try again.",
      edit: "Failed to load category edit page. Please try again.",
      unknown: "Failed to load page. Please try again.",
    },
    quests: {
      main: "Failed to load quests. Please try again.",
      pod: "Failed to load pod quests. Please try again.",
      category: "Failed to load category quests. Please try again.",
      quest: "Failed to load quest details. Please try again.",
      create: "Failed to load quest creation page. Please try again.",
      unknown: "Failed to load page. Please try again.",
    },
  };

  return messages[routeType] || messages.quests;
};

export const getBackLinkLabels = (routeType) => {
  const labels = {
    pods: {
      main: "Back to Dashboard",
      pod: "Back to Pods",
      create: "Back to Pods",
      unknown: "Back to Dashboard",
    },
    categories: {
      main: "Back to Dashboard",
      pod: "Back to Categories",
      category: "Back to Pod",
      create: "Back to Pod",
      edit: "Back to Category",
      unknown: "Back to Dashboard",
    },
    quests: {
      main: "Back to Dashboard",
      pod: "Back to Quests",
      category: "Back to Pod",
      quest: "Back to Category",
      create: "Back to Category",
      unknown: "Back to Dashboard",
    },
  };

  return labels[routeType] || labels.quests;
};
