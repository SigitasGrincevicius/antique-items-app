import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../services/api";
import { useAppSelector } from "../../hooks";
import { selectIsAdmin } from "../../features/auth/authSlice";
import { ConfirmDialog, EmptyState, ErrorAlert, Skeleton } from "../../components/ui";
import { EditIcon, TrashIcon } from "../../components/Icons";
import { formatDate } from "../../utils/format";
import "./CategoriesPage.css";

export default function CategoriesPage() {
  const isAdmin = useAppSelector(selectIsAdmin);
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteCategoryMutation();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleting = categories.find((category) => category.id === deletingId);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = newName.trim();
    if (trimmed.length < 2) return;
    const result = await createCategory({ name: trimmed });
    if (!("error" in result)) setNewName("");
  };

  const handleRename = async (id: string) => {
    const trimmed = editingName.trim();
    if (trimmed.length < 2) return;
    const result = await updateCategory({ id, name: trimmed });
    if (!("error" in result)) setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteCategory(deletingId);
    setDeletingId(null);
  };

  return (
    <div className="container page categories-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Taxonomy</span>
          <h1>Categories</h1>
          <p>
            {isAdmin
              ? "Organise the collection into groups. Only administrators can manage them."
              : "How the collection is organised. Administrators manage the list."}
          </p>
        </div>
      </header>

      <ErrorAlert
        error={error ?? createState.error ?? updateState.error ?? deleteState.error}
      />

      {isAdmin && (
        <form className="category-create" onSubmit={handleCreate}>
          <input
            className="input"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="New category name…"
            aria-label="New category name"
            maxLength={100}
          />
          <button
            type="submit"
            className="btn btn-brass"
            disabled={createState.isLoading || newName.trim().length < 2}
          >
            Add category
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="stack">
          <Skeleton height="3.2rem" />
          <Skeleton height="3.2rem" />
          <Skeleton height="3.2rem" />
        </div>
      ) : categories.length === 0 && !error ? (
        <EmptyState title="No categories yet" description="Create the first one above." />
      ) : (
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.id} className="category-row">
              {editingId === category.id ? (
                <form
                  className="category-edit"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleRename(category.id);
                  }}
                >
                  <input
                    className="input"
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    autoFocus
                    maxLength={100}
                    aria-label="Category name"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={updateState.isLoading || editingName.trim().length < 2}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="category-info">
                    <Link to={`/?categoryId=${category.id}`} className="category-name">
                      {category.name}
                    </Link>
                    <span className="muted small">Added {formatDate(category.createdAt)}</span>
                  </div>
                  {isAdmin && (
                    <div className="row">
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        aria-label={`Rename ${category.name}`}
                        onClick={() => {
                          setEditingId(category.id);
                          setEditingName(category.name);
                        }}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon category-delete"
                        aria-label={`Delete ${category.name}`}
                        onClick={() => setDeletingId(category.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}


      <ConfirmDialog
        open={Boolean(deletingId)}
        title="Delete category?"
        message={
          deleting
            ? `"${deleting.name}" will be removed. Items that used it will need to be re-categorised.`
            : ""
        }
        busy={deleteState.isLoading}
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
