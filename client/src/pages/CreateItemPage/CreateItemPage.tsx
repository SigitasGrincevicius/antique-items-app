import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  useCreateAntiqueItemMutation,
  useGetCategoriesQuery,
} from "../../api/apiSlice";
import styles from './CreateItemPage.module.css';

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;

    if (typeof data === "object" && data !== null && "message" in data) {
      const message = data.message;

      if (typeof message === "string") {
        return message;
      }

      if (Array.isArray(message)) {
        return message
          .filter((value): value is string => typeof value === "string")
          .join(" ");
      }
    }
  }

  return "Could not create the item. Please try again.";
}

function CreateItemPage() {
  const navigate = useNavigate();

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch,
  } = useGetCategoriesQuery();

  const [createItem, { isLoading: isSubmitting }] =
    useCreateAntiqueItemMutation();

  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [year, setYear] = useState("");
  const [priceEur, setPriceEur] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedOrigin = origin.trim();

    if (trimmedName.length < 2 || trimmedOrigin.length < 2) {
      setErrorMessage(
        "Name and origin must each contain at least 2 characters.",
      );
      return;
    }

    try {
      const item = await createItem({
        name: trimmedName,
        origin: trimmedOrigin,
        year: Number(year),
        priceEur: Number(priceEur),
        categoryId,
        ...(description.trim() ? { description: description.trim() } : {}),
      }).unwrap();

      navigate(`/items/${item.id}`);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Add antique item</h1>

      {isLoadingCategories && <p role="status">Loading categories...</p>}

      {isCategoriesError && (
        <div role="alert">
          <p>Could not load categories.</p>
          <button type="button" onClick={() => void refetch()}>
            Try again
          </button>
        </div>
      )}

      {!isLoadingCategories &&
        !isCategoriesError &&
        categories.length === 0 && (
          <p role="status">
            No categories are available. An administrator needs to add a
            category before you can create an item.
          </p>
        )}

      {errorMessage && (
        <p role="alert" className={styles.error}>
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset disabled={isSubmitting} className={styles.fieldset}>
          <legend className={styles.legend}>Item details</legend>

          <div className={styles.field}>
            <label htmlFor="item-name">Name</label>
            <input
              id="item-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={120}
              placeholder="Victorian pocket watch"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="item-origin">Origin</label>
            <input
              id="item-origin"
              name="origin"
              type="text"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              minLength={2}
              maxLength={80}
              placeholder="England"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="item-year">Year</label>
              <input
                id="item-year"
                name="year"
                type="number"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                min={1000}
                max={2100}
                step={1}
                placeholder="1890"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="item-price">Price (€)</label>
              <input
                id="item-price"
                name="priceEur"
                type="number"
                value={priceEur}
                onChange={(event) => setPriceEur(event.target.value)}
                min={1}
                max={1_000_000_000}
                step={0.01}
                placeholder="250.00"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="item-category">Category</label>
            <select
              id="item-category"
              name="categoryId"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={
                isLoadingCategories ||
                isCategoriesError ||
                categories.length === 0
              }
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
            <label htmlFor="item-description">Description (optional)</label>
            <textarea
              id="item-description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="Describe the item's condition and history..."
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              isSubmitting ||
              isLoadingCategories ||
              isCategoriesError ||
              categories.length === 0
            }
          >
            {isSubmitting ? "Creating..." : "Create item"}
          </button>
        </fieldset>

        <Link to="/items" className={styles.backLink}>
          Back to items
        </Link>
      </form>
    </main>
  );
}

export default CreateItemPage;
