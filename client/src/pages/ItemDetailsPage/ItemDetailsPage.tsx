import { Link, useNavigate, useParams } from "react-router";
import { useAppSelector } from "../../app/hooks";
import {
  useDeleteAntiqueItemMutation,
  useGetAntiqueItemQuery,
} from "../../api/apiSlice";
import { useState } from "react";
import Button from "../../components/Button/Button";

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return fallback;
  }

  const data = error.data;

  if (typeof data !== "object" || data === null || !("message" in data)) {
    return fallback;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (Array.isArray(data.message)) {
    const messages = data.message.filter(
      (message): message is string => typeof message === "string",
    );

    return messages.length > 0 ? messages.join(" ") : fallback;
  }

  return fallback;
}

const priceFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const {
    data: item,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAntiqueItemQuery(id ?? "", {
    skip: !id,
  });

  const [deleteItem, { isLoading: isDeleting }] =
    useDeleteAntiqueItemMutation();

  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!id || !item || isDeleting) return;

    const confirmed = window.confirm(`Delete "${item.name}" permanently?`);

    if (!confirmed) return;

    setDeleteError(null);

    try {
      await deleteItem(id).unwrap();
      navigate("/items", { replace: true });
    } catch (deleteRequestError: unknown) {
      setDeleteError(
        getErrorMessage(
          deleteRequestError,
          "Could not delete the item. Please try again.",
        ),
      );
    }
  }

  if (!id) {
    return (
      <section>
        <h1>Invalid item URL</h1>
        <Link to="/items">Back to items</Link>
      </section>
    );
  }

  if (isLoading) {
    return <p role="status">Loading item...</p>;
  }

  const isNotFound =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 404;

  if (isNotFound) {
    return (
      <section>
        <h1>Item not found</h1>
        <p>This item may have been deleted.</p>
        <Link to="/items">Back to items</Link>
      </section>
    );
  }

  if (!item) {
    return (
      <section>
        <h1>Item details</h1>
        <p role="alert">
          {getErrorMessage(error, "Could not load this item.")}
        </p>

        <Button onClick={() => void refetch()} disabled={isFetching}>
          {isFetching ? "Loading..." : "Try again"}
        </Button>

        <p>
          <Link to="/items">Back to items</Link>
        </p>
      </section>
    );
  }

  const canManage =
    !!user && (item.createdById === user.id || user.roles.includes("admin"));

  return (
    <section aria-busy={isFetching || isDeleting}>
      <p>
        <Link to="/items">Back to items</Link>
      </p>

      <h1>{item.name}</h1>

      {isFetching && <p role="status">Refreshing item...</p>}

      {isError && (
        <div role="alert">
          <p>
            {getErrorMessage(
              error,
              "Could not refresh this item. Displaying previously loaded details.",
            )}
          </p>

          <Button
            onClick={() => void refetch()}
            disabled={isFetching || isDeleting}
          >
            Try again
          </Button>
        </div>
      )}

      <dl>
        <dt>Origin</dt>
        <dd>{item.origin || "Unknown origin"}</dd>

        <dt>Year</dt>
        <dd>{item.year}</dd>

        <dt>Price</dt>
        <dd>{priceFormatter.format(Number(item.priceEur))}</dd>

        <dt>Category</dt>
        <dd>{item.category?.name ?? "Uncategorized"}</dd>

        <dt>Added by</dt>
        <dd>{item.createdBy?.name ?? "Unknown user"}</dd>
      </dl>
    </section>
  );
}

export default ItemDetailsPage;
