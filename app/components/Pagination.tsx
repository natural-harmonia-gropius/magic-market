interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  });

  const buttonBaseClass =
    "w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-all duration-200";
  const normalButtonClass = `${buttonBaseClass} hover:bg-white hover:shadow-md hover:text-gray-900 text-gray-700`;
  const activeButtonClass = `${buttonBaseClass} bg-gray-900 text-white font-medium shadow-md`;
  const disabledButtonClass = `${buttonBaseClass} opacity-50 cursor-not-allowed text-gray-400`;

  return (
    <nav
      className="flex justify-center items-center gap-1 mt-6"
      aria-label="分页"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? disabledButtonClass : normalButtonClass}
        aria-label="上一页"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={
              currentPage === 1 ? activeButtonClass : normalButtonClass
            }
          >
            1
          </button>
          {pages[0] > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={
            currentPage === page ? activeButtonClass : normalButtonClass
          }
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={
              currentPage === totalPages ? activeButtonClass : normalButtonClass
            }
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={
          currentPage === totalPages ? disabledButtonClass : normalButtonClass
        }
        aria-label="下一页"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
}
