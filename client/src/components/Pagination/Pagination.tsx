import Button from "../Button/Button";
import styles from "./Pagination.module.css";

type PaginationProps = {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  disabled: boolean;
  onPageChange: (page: number) => void;
};

function Pagination({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  disabled,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        disabled={disabled || !hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      <span>
        Page {page} of {Math.max(1, totalPages)}
      </span>

      <Button
        disabled={disabled || !hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}

export default Pagination;
