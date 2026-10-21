import { Link, useNavigate, useParams } from "react-router";
import type { AntiqueItem, Category } from "../../api/apiTypes";
import styles from "./EditItemPage.module.css";
import {
  useGetAntiqueItemQuery,
  useGetCategoriesQuery,
  useUpdateAntiqueItemMutation,
} from "../../api/apiSlice";
import { useState, type FormEvent } from "react";
import Button from "../../components/Button/Button";
import { useAppSelector } from "../../app/hooks";

type EditItemFormProps = {
  item: AntiqueItem;
  categories: Category[];
};

function EditItemForm({ item, categories }: EditItemFormProps) {
  const navigate = useNavigate();

  const [updateItem, { isLoading: isSaving }] = useUpdateAntiqueItemMutation();

  const [errorMessage, setErroMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const origin = String(formData.get("origin") ?? "").trim();

    if (name.length < 2 || origin.length < 2) {
      setErroMessage(
        "Name and origin must each contain at least 2 characters.",
      );
      return;
    }

    setErroMessage(null);

    try {
      await updateItem({
        id: item.id,
        changes: {
          name,
          origin,
          year: Number(formData.get("year")),
          priceEur: Number(formData.get("priceEur")),
          categoryId: String(formData.get("categoryId") ?? ""),
          description: String(formData.get("description") ?? ""),
        },
      }).unwrap();

      navigate(`/items/${item.id}`);
    } catch(error) {
      console.log(error)
      setErroMessage("Could not save changes. Please try again.");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={isSaving}>
      <div className={styles.field}>
        <label htmlFor="edit-name" className={styles.label}>
          Name
        </label>
        <input
          className={styles.control}
          id="edit-name"
          name="name"
          defaultValue={item.name}
          minLength={2}
          maxLength={120}
          disabled={isSaving}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="edit-origin" className={styles.label}>
          Origin
        </label>
        <input
          className={styles.control}
          id="edit-origin"
          name="origin"
          defaultValue={item.origin ?? ""}
          minLength={2}
          maxLength={80}
          disabled={isSaving}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="edit-year" className={styles.label}>
          Origin
        </label>
        <input
          className={styles.control}
          id="edit-year"
          name="year"
          type="number"
          defaultValue={item.year}
          min={1000}
          max={2100}
          disabled={isSaving}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="edit-price" className={styles.label}>
          Price (€)
        </label>
        <input
          className={styles.control}
          id="edit-price"
          name="priceEur"
          type="number"
          defaultValue={item.priceEur}
          min={1}
          max={1_000_000_000}
          step={0.01}
          disabled={isSaving}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="edit-category" className={styles.label}>
          Category
        </label>
        <select
          className={styles.control}
          id="edit-category"
          name="categoryId"
          defaultValue={item.categoryId ?? ""}
          disabled={isSaving}
          required
        >
          <option value="">Select a category</option>
          
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="edit-description" className={styles.label}>
          Description
        </label>
        <textarea
          className={styles.control}
          id="edit-description"
          name="description"
          defaultValue={item.description ?? ""}
          maxLength={1000}
          disabled={isSaving}
          rows={5}
          required
        />
      </div>

      {errorMessage && (
        <p className={styles.feedback} role="alert">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSaving || categories.length === 0}>
        {isSaving ? "Saving..." : "Save changes"}
      </Button>

      {!isSaving && <Link to={`/items/${item.id}`}>Cancel</Link>}
    </form>
  );
}

function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.auth.user);

  const itemQuery = useGetAntiqueItemQuery(id ?? "", {
    skip: !id,
  });

  const categoriesQuery = useGetCategoriesQuery(undefined, {
    skip: !id,
  });

  if (!id) {
    return <p role="alert">Invalid item URL.</p>;
  }

  if (itemQuery.isLoading || categoriesQuery.isLoading) {
    return <p role="status">Loading edit form...</p>;
  }

  if (itemQuery.isError || categoriesQuery.isError) {
    return (
      <section>
        <h1>Could not load the edit form</h1>
        <p role="alert">The item may be unavailable, or the request failed.</p>

        <Button
          disabled={itemQuery.isFetching || categoriesQuery.isFetching}
          onClick={() => {
            void itemQuery.refetch();
            void categoriesQuery.refetch();
          }}
        >
          Try again
        </Button>

        <p>
          <Link to="/items">Back to items</Link>
        </p>
      </section>
    );
  }

  const item = itemQuery.currentData;
  const categories = categoriesQuery.data;

  if (!item || !categories) {
    return <p role="status">Loading edit form...</p>;
  }

  const canEdit =
    !!user && (item.createdById === user.id || user.roles.includes("admin"));

  if (!canEdit) {
    return (
      <section>
        <h1>Access denied</h1>
        <p>You do not have permissions to edit this item.</p>
        <Link to={`/items/${item.id}`}>Back to item</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Edit item</h1>

      {categories.length === 0 && (
        <p role="alert">
          No categories available. An administrator must add one before you can
          save.
        </p>
      )}

      <EditItemForm key={item.id} item={item} categories={categories} />
    </section>
  );
}

export default EditItemPage;
