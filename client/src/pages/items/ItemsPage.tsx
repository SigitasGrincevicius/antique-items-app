import { useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetCategoriesQuery, useGetItemsQuery } from "../../services/api";
import { ITEM_SORT_FIELDS, type ItemSortField } from "../../types";
import ItemCard from "../../components/ItemCard";
import { EmptyState, ErrorAlert } from "../../components/ui";
import { ItemGridSkeleton, Pagination } from "../../components/Pagination";
import { PlusIcon } from "../../components/Icons";
import { useFavorites } from "../../features/favorites/useFavorites";
import { useAppSelector } from "../../hooks";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
import ItemsToolbar, { type ItemsFilters } from "./ItemsToolbar";
import "./ItemsPage.css";

const PAGE_SIZE = 12;

function isSortField(value: string | null): value is ItemSortField {
  return ITEM_SORT_FIELDS.includes(value as ItemSortField);
}

export default function ItemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const sortByParam = searchParams.get("sortBy");
  const filters: ItemsFilters = {
    search: searchParams.get("search") ?? "",
    categoryId: searchParams.get("categoryId") ?? "",
    sortBy: isSortField(sortByParam) ? sortByParam : "createdAt",
    sortOrder: searchParams.get("sortOrder") === "ASC" ? "ASC" : "DESC",
  };
  const hasFilters = Boolean(filters.search || filters.categoryId);

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(patch).forEach(([key, value]) => {
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Any filter change resets pagination to the first page.
  const handleFiltersChange = useCallback(
    (patch: Partial<ItemsFilters>) => updateParams({ ...patch, page: null }),
    [updateParams],
  );

  const { data, isLoading, isFetching, error } = useGetItemsQuery({
    page,
    limit: PAGE_SIZE,
    search: filters.search || undefined,
    categoryId: filters.categoryId || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });
  const { data: categories = [] } = useGetCategoriesQuery();
  const { isFavorite, toggleFavorite, isBusy } = useFavorites();

  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="container page">
      <section className="hero">
        <span className="eyebrow">The collection</span>
        <h1>Curious objects, carefully catalogued.</h1>
        <p>
          Browse antiques contributed by collectors — from Georgian silver to mid-century
          furniture. Sign in to add your own finds and keep a list of favorites.
        </p>
      </section>

      <ItemsToolbar
        filters={filters}
        categories={categories}
        canCreate={isAuthenticated}
        onChange={handleFiltersChange}
      />

      <div className="results-bar">
        {meta ? (
          <span className="muted small">
            {meta.total} {meta.total === 1 ? "item" : "items"}
            {hasFilters ? " match your filters" : ""}
            {isFetching && !isLoading ? " · refreshing…" : ""}
          </span>
        ) : (
          <span />
        )}
        {hasFilters && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => updateParams({ search: null, categoryId: null, page: null })}
          >
            Clear filters
          </button>
        )}
      </div>

      <ErrorAlert error={error} />

      {isLoading ? (
        <ItemGridSkeleton />
      ) : items.length === 0 && !error ? (
        <EmptyState
          title={hasFilters ? "Nothing matches" : "The cabinet is empty"}
          description={
            hasFilters
              ? "Try a different search term or category."
              : "Be the first to add an antique to the collection."
          }
          action={
            isAuthenticated && !hasFilters ? (
              <Link to="/items/new" className="btn btn-brass">
                <PlusIcon /> Add the first item
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
              favoriteBusy={isBusy}
            />
          ))}
        </div>
      )}

      {meta && (
        <Pagination meta={meta} onPageChange={(next) => updateParams({ page: String(next) })} />
      )}
    </div>
  );
}
