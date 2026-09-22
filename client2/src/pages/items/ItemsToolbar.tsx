import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ITEM_SORT_FIELDS, type Category, type ItemSortField, type SortOrder } from "../../types";
import { PlusIcon, SearchIcon } from "../../components/Icons";

const SORT_LABELS: Record<ItemSortField, string> = {
  createdAt: "Newest",
  updatedAt: "Recently updated",
  name: "Name",
  category: "Category",
};

export interface ItemsFilters {
  search: string;
  categoryId: string;
  sortBy: ItemSortField;
  sortOrder: SortOrder;
}

interface ItemsToolbarProps {
  filters: ItemsFilters;
  categories: Category[];
  canCreate: boolean;
  onChange: (patch: Partial<ItemsFilters>) => void;
}

export default function ItemsToolbar({ filters, categories, canCreate, onChange }: ItemsToolbarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Keep local input in sync when URL changes externally (e.g. "Clear filters").
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSearchInput(filters.search), [filters.search]);

  // Debounce typing before pushing to the URL / API.
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === filters.search) return;
    const timer = setTimeout(() => onChange({ search: trimmed }), 350);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onChange]);

  return (
    <>
      <div className="toolbar">
        <label className="search-box">
          <SearchIcon />
          <input
            type="search"
            className="input"
            placeholder="Search by name or description…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            aria-label="Search antiques"
          />
        </label>

        <div className="toolbar-controls">
          <select
            className="select"
            value={filters.sortBy}
            onChange={(event) => onChange({ sortBy: event.target.value as ItemSortField })}
            aria-label="Sort by"
          >
            {ITEM_SORT_FIELDS.map((field) => (
              <option key={field} value={field}>
                {SORT_LABELS[field]}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onChange({ sortOrder: filters.sortOrder === "ASC" ? "DESC" : "ASC" })}
            title={filters.sortOrder === "ASC" ? "Ascending" : "Descending"}
            aria-label="Toggle sort order"
          >
            {filters.sortOrder === "ASC" ? "↑ Asc" : "↓ Desc"}
          </button>
          {canCreate && (
            <Link to="/items/new" className="btn btn-brass">
              <PlusIcon /> Add item
            </Link>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="chip-row" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`chip ${!filters.categoryId ? "active" : ""}`}
            onClick={() => onChange({ categoryId: "" })}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`chip ${filters.categoryId === category.id ? "active" : ""}`}
              onClick={() =>
                onChange({ categoryId: filters.categoryId === category.id ? "" : category.id })
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
