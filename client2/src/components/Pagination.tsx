import type { PaginationMeta } from "../types";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { Skeleton } from "./ui";

export function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-outline"
        disabled={!meta.hasPreviousPage}
        onClick={() => onPageChange(meta.page - 1)}
      >
        <ChevronLeftIcon /> Previous
      </button>
      <span className="pagination-status">
        Page {meta.page} of {meta.totalPages}
      </span>
      <button
        type="button"
        className="btn btn-outline"
        disabled={!meta.hasNextPage}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next <ChevronRightIcon />
      </button>
    </nav>
  );
}

export function ItemGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="item-grid" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card">
          <Skeleton height="180px" style={{ borderRadius: "14px 14px 0 0" }} />
          <div className="card-body stack">
            <Skeleton width="40%" height="0.8rem" />
            <Skeleton width="80%" height="1.4rem" />
            <Skeleton width="60%" height="0.8rem" />
          </div>
        </div>
      ))}
    </div>
  );
}
