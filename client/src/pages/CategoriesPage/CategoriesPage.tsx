import { useState } from "react";
import type { SubmitEvent } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../api/apiSlice";
import { useAppSelector } from "../../app/hooks";
import { getErrorMessage } from "../../utils/getErrorMessage";

function CategoriesPage() {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.roles.includes("admin") ?? false;

  const {
    data: categories = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetCategoriesQuery(undefined, { skip: !isAdmin });

  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isBusy =
    createState.isLoading || updateState.isLoading || deleteState.isLoading;

  function resetForm() {
    setName("");
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isBusy) return;

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError("Category name must contain 2-100 characters.");
      return;
    }

    setError(null);

    try {
      if (editingId) {
        await updateCategory({
          id: editingId,
          body: { name: trimmedName },
        }).unwrap();
      } else {
        await createCategory({ name: trimmedName }).unwrap();
      }

      resetForm();
    } catch (error) {
      setError(
        getErrorMessage(error, "The operation failed. Please try again."),
      );
    }
  }

  async function handleDelete(id: string, categoryName: string) {
    if (!isBusy) return;

    if (!window.confirm(`Delete category "${categoryName}"`)) return;

    setError(null);

    try {
      await deleteCategory(id).unwrap();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setError(
        getErrorMessage(error, "The operation failed. Please try again."),
      );
    }
  }

  return <div>CategoriesPage</div>;
}

export default CategoriesPage;
