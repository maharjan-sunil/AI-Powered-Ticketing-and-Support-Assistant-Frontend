interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isPlaceholderData?: boolean;
  itemLabel?: string;
  onPageChange: (newPage: number) => void;
  // onPrefetchNext?: () => void;
}

export default function Pagination({
  page,
  totalPages,
  totalCount,
  hasPrevious,
  hasNext,
  isPlaceholderData = false,
  itemLabel = 'items',
  onPageChange,
  // onPrefetchNext,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4">
      <p className="text-sm text-slate-600">
        Page <span className="font-semibold text-slate-900">{page}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalPages}</span> ({totalCount} total {itemLabel})
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={!hasPrevious || isPlaceholderData}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          type="button"
          // onMouseEnter={onPrefetchNext} //commenting this out for now, as it may not be necessary to prefetch the next page on hover
          onClick={() => {
            if (!isPlaceholderData && hasNext) {
              onPageChange(page + 1);
            }
          }}
          disabled={!hasNext || isPlaceholderData}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
