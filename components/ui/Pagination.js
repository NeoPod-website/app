// components/common/Pagination.js
import Link from "next/link";

const Pagination = ({ currentPage, totalPages, paginationMap, hasMore }) => {
  const maxPageButtons = 5; // Maximum number of page buttons to show

  // Calculate range of pages to show
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  // Create array of pages to display
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="mt-6 flex items-center justify-center space-x-2">
      {/* Previous page button */}
      {currentPage > 1 && (
        <Link
          href={`?page=${currentPage - 1}&startKey=${encodeURIComponent(paginationMap.get(currentPage - 1) || "")}`}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-700 bg-black/30 text-gray-300 hover:bg-gray-800"
        >
          <span className="sr-only">Previous</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Link>
      )}

      {/* First page button when not in view */}
      {startPage > 1 && (
        <>
          <Link
            href="?page=1"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-700 bg-black/30 text-gray-300 hover:bg-gray-800"
          >
            1
          </Link>
          {startPage > 2 && (
            <span className="flex h-10 w-10 items-center justify-center text-gray-400">
              ...
            </span>
          )}
        </>
      )}

      {/* Page number buttons */}
      {pages.map((page) => (
        <Link
          key={page}
          href={`?page=${page}&startKey=${encodeURIComponent(paginationMap.get(page) || "")}`}
          className={`flex h-10 w-10 items-center justify-center rounded-md ${
            currentPage === page
              ? "border border-gray-100 bg-gradient-primary"
              : "border border-gray-700 bg-black/30 text-gray-300 hover:bg-gray-800"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Last page button when not in view */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="flex h-10 w-10 items-center justify-center text-gray-400">
              ...
            </span>
          )}
          <Link
            href={`?page=${totalPages}&startKey=${encodeURIComponent(paginationMap.get(totalPages) || "")}`}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-700 bg-black/30 text-gray-300 hover:bg-gray-800"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next page button */}
      {hasMore && (
        <Link
          href={`?page=${currentPage + 1}&startKey=${encodeURIComponent(lastEvaluatedKey || "")}`}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-700 bg-black/30 text-gray-300 hover:bg-gray-800"
        >
          <span className="sr-only">Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
