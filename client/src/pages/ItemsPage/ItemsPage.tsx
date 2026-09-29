import { useState } from "react";
import { useGetAntiqueItemsQuery } from "../../api/apiSlice";

export default function ItemsPage() {
  const [page, setPage] = useState(1);

  const { currentData, isLoading, isFetching, isError, error, refetch } =
    useGetAntiqueItemsQuery({
      page,
      limit: 15,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });

  if (isLoading) {
    return <p>Loading items...</p>;
  }

  if (isError) {
    return (
      <section>
        <p role="alert">Unable to load items.</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button onClick={() => refetch()}>Try again</button>
      </section>
    );
  }

  return (
    <main>
      <h1>Antique items</h1>

      <button onClick={() => refetch()} disabled={isFetching}>
        Refresh
      </button>

      {isFetching && <p role="status">Loading...</p>}

      {currentData && (
        <>
          <p>Total items: {currentData.meta.total}</p>

          {currentData.data.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <ul>
              {currentData.data.map((item) => (
                <li key={item.id}>
                  <h2>{item.name}</h2>
                  <p>
                    {item.origin ?? "Unknown origin"} · {item.year}
                  </p>
                  <p>Price: €{Number(item.priceEur).toFixed(2)}</p>
                  <p>Category: {item.category?.name ?? "Uncategorized"}</p>
                  {item.description && <p>{item.description}</p>}
                </li>
              ))}
            </ul>
          )}

          <nav aria-label="Pagination">
            <button
              disabled={isFetching || !currentData.meta.hasPreviousPage}
              onClick={() => setPage((previous) => previous - 1)}
            >
              Previous
            </button>

            <span>
              {" "}
              Page {page} of {Math.max(1, currentData.meta.totalPages)}{" "}
            </span>

            <button
              disabled={isFetching || !currentData.meta.hasNextPage}
              onClick={() => setPage((previous) => previous + 1)}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </main>
  );
}
