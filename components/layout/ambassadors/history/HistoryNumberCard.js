import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

const HistoryNumberCard = ({
  href,
  title,
  count,
  color,
  subtitle,
  hasMore = false,
  isLoading = false,
}) => {
  const getColorClasses = (color) => {
    switch (color) {
      case "text-green-500":
        return {
          text: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          hover: "hover:bg-green-500/20",
          ring: "ring-green-500/30",
        };

      case "text-red-500":
        return {
          text: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          hover: "hover:bg-red-500/20",
          ring: "ring-red-500/30",
        };

      case "text-yellow-500":
        return {
          text: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          hover: "hover:bg-yellow-500/20",
          ring: "ring-yellow-500/30",
        };

      default:
        return {
          text: "text-gray-400",
          bg: "bg-gray-500/10",
          border: "border-gray-500/20",
          hover: "hover:bg-gray-500/20",
          ring: "ring-gray-500/30",
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div
      className={`group relative flex-1 overflow-hidden rounded-2xl border bg-gradient-dark p-4 shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl hover:shadow-black/30 3xl:p-6 ${colorClasses.border}`}
    >
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${colorClasses.bg}`}
      ></div>

      <div className="relative space-y-3">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-10 w-16 animate-pulse rounded bg-gray-600/50"></div>
            ) : (
              <>
                <p
                  className={`text-4xl font-bold transition-colors ${colorClasses.text}`}
                >
                  {count}
                </p>

                {hasMore && (
                  <span
                    className={`text-2xl font-bold transition-colors ${colorClasses.text} opacity-70`}
                    title="There may be more items"
                  >
                    +
                  </span>
                )}
              </>
            )}
          </div>

          <Link
            href={href}
            className={`rounded-full border p-2.5 transition-all duration-200 3xl:p-3 ${colorClasses.border} ${colorClasses.hover} hover:ring-2 ${colorClasses.ring}`}
          >
            <ArrowUpRightIcon
              size={20}
              className={`h-4 w-4 transition-colors 3xl:h-5 3xl:w-5 ${colorClasses.text} group-hover:text-white`}
            />
          </Link>
        </div>

        <div className="space-y-1">
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}

          {hasMore && !isLoading && (
            <p className="text-xs text-gray-300">
              Showing first {count}, more available
            </p>
          )}
        </div>

        <h3 className="text-base font-semibold text-white transition-colors group-hover:text-gray-100 lg:text-lg">
          {title}
        </h3>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-1 w-full transition-all duration-200 ${colorClasses.bg} group-hover:h-2`}
      ></div>
    </div>
  );
};

export default HistoryNumberCard;
