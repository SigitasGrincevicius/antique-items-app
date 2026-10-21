import { useNavigate } from "react-router";
import type { AntiqueItem, Category } from "../../api/apiTypes";
import styles from "./EditItemPage.module.css";
import { useUpdateAntiqueItemMutation } from "../../api/apiSlice";
import { useState, type FormEvent } from "react";

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
    } catch {
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
        <label htmlFor="edit-price" className={styles.label}>
          Price (€)
        </label>
      </div>
    </form>
  );
}

function EditItemPage() {
  return <div>EditItemPage</div>;
}

export default EditItemPage;
