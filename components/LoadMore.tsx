'use client';

interface LoadMoreProps {
  totalCount?: number;
  displayedCount?: number;
  onLoadMore?: () => void;
}

export default function LoadMore({ 
  totalCount = 24, 
  displayedCount = 4,
  onLoadMore 
}: LoadMoreProps) {
  return (
    <div className="mt-16 flex flex-col items-center">
      <button
        onClick={onLoadMore}
        className="bg-gray-200 text-green-700 font-bold px-12 py-4 rounded-full hover:bg-gray-300 transition-all border border-gray-300 mb-4"
      >
        Discover More Activities
      </button>
      <p className="text-gray-500 text-xs">
        Showing {displayedCount} of {totalCount} upcoming civic events
      </p>
    </div>
  );
}
