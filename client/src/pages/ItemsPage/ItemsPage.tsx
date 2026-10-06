import { useState } from "react";
import { useGetAntiqueItemsQuery } from "../../api/apiSlice";
import ItemCard from "../../components/ItemCard/ItemCard";
import ItemsToolbar from "../../components/ItemsToolbar/ItemsToolbar";
import styles from "./ItemsPage.module.css";
import Pagination from "../../components/Pagination/Pagination";

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
    <section>
      <h1>Antique items</h1>

      {isFetching && <p role="status">Loading...</p>}

      {currentData && (
        <>
          <ItemsToolbar
            total={currentData.meta.total}
            isFetching={isFetching}
            onRefresh={() => refetch()}
          />
          {currentData.data.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <ul className={styles.grid}>
              {currentData.data.map((item) => (
                <li key={item.id}>
                  <ItemCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Pagination
        page={page}
        totalPages={currentData?.meta.totalPages ?? 0}
        hasPreviousPage={currentData?.meta.hasPreviousPage ?? false}
        hasNextPage={currentData?.meta.hasNextPage ?? false}
        disabled={isFetching}
        onPageChange={setPage}
      />
    </section>
  );
}
