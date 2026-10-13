import { Link, useNavigate, useParams } from "react-router";
import {
  useDeleteAntiqueItemMutation,
  useGetAntiqueItemQuery,
} from "../../api/apiSlice";
import { useAppSelector } from "../../app/hooks";
import { useState } from "react";

function ItemDetailsPage() {
  const { id } = useParams();

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useGetAntiqueItemQuery(id ?? "", { skip: !id });
  const user = useAppSelector((state) => state.auth.user);

  const canManage =
    !!user && (item?.createdBy?.id === user.id || user.roles.includes("admin"));

  const navigate = useNavigate();
  const [deleteItem, { isLoading: isDeleting }] =
    useDeleteAntiqueItemMutation();

  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!id) return <p role="alert">Invalid item URL.</p>;
  if (isLoading) return <p role="status">Loading item...</p>;

  if (isError || !item) {
    return (
      <section>
        <p role="alert">Could not load this item.</p>
        <button onClick={() => void refetch()}>Try again</button>
        <Link to="/items">Back to items</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>{item.name}</h1>
      <p>{item.origin ?? "Unknown origin"}</p>
      <p>Year: {item.year}</p>
      <p>Price: €{Number(item.priceEur).toFixed(2)}</p>
      <p>Category: {item.category?.name ?? "Uncategorized"}</p>
      <p>{item.description || "No description provided."}</p>

      <Link to="/items">Back to items</Link>
    </section>
  );
}

export default ItemDetailsPage;
