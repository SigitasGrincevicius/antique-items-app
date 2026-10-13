import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../../app/hooks";
import {
  useDeleteAntiqueItemMutation,
  useGetAntiqueItemQuery,
} from "../../api/apiSlice";
import { useState } from "react";

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
    refetch,
  } = useGetAntiqueItemQuery(id ?? "", {
    skip: !id,
  });

  const [deleteItem, { isLoading: isDeleting }] =
    useDeleteAntiqueItemMutation();

  const [deleteError, setDeleteError] = useState<string | null>(null);
  return <div>Test</div>;
}

export default ItemDetailsPage;
