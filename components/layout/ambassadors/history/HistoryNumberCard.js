// import Link from "next/link";
// import { ArrowUpRightIcon } from "lucide-react";

// const HistoryNumberCard = ({ title, count, href, color }) => {
//   return (
//     <div className="flex flex-1 items-start justify-between rounded-2.5xl border-t border-t-gray-400 bg-gradient-dark px-5 py-4">
//       <div className="space-y-1.5">
//         <p className={`text-4xl font-medium ${color}`}>{count}</p>
//         <h3 className="text-xl">{title}</h3>
//       </div>

//       <Link href={href} className="rounded-full border border-white p-2">
//         <ArrowUpRightIcon size={20} />
//       </Link>
//     </div>
//   );
// };

// export default HistoryNumberCard;

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

const HistoryNumberCard = ({ title, count, href, color, subtitle }) => {
  // Extract color class for different elements
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
      className={`group relative flex-1 overflow-hidden rounded-2xl border bg-gradient-dark p-6 shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl hover:shadow-black/30 ${colorClasses.border}`}
    >
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${colorClasses.bg}`}
      ></div>

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <p
              className={`text-4xl font-bold transition-colors ${colorClasses.text}`}
            >
              {count}
            </p>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>

          <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-gray-100">
            {title}
          </h3>
        </div>

        <Link
          href={href}
          className={`rounded-full border p-3 transition-all duration-200 ${colorClasses.border} ${colorClasses.hover} hover:ring-2 ${colorClasses.ring}`}
        >
          <ArrowUpRightIcon
            size={20}
            className={`transition-colors ${colorClasses.text} group-hover:text-white`}
          />
        </Link>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-1 w-full transition-all duration-200 ${colorClasses.bg} group-hover:h-2`}
      ></div>
    </div>
  );
};

export default HistoryNumberCard;
