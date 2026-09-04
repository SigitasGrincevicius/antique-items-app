import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCreateItemMutation,
  useGetCategoriesQuery,
  useGetItemQuery,
  useUpdateItemMutation,
} from "../../services/api";
import { useAppSelector } from "../../hooks";
import { selectAuthUser, selectIsAdmin } from "../../features/auth/authSlice";
import { EmptyState, ErrorAlert, Spinner } from "../../components/ui";
import { ArrowLeftIcon } from "../../components/Icons";
import type { CreateItemDto } from "../../types";
import { EMPTY_FORM, type FormState } from "./itemForm";
import { validateItemForm, YEAR_RANGE } from "./validateItemForm";
import "./ItemFormPage.css";

export default function ItemFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser);
  const isAdmin = useAppSelector(selectIsAdmin);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: item, isLoading: itemLoading, error: itemError } = useGetItemQuery(id ?? "", {
    skip: !isEdit,
  });
  const [createItem, createState] = useCreateItemMutation();
  const [updateItem, updateState] = useUpdateItemMutation();

  // Prefill when editing: RTK Query delivers the item asynchronously, so this
  // sync runs once when the data arrives.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        origin: item.origin ?? "",
        year: String(item.year),
        priceEur: String(item.priceEur),
        description: item.description ?? "",
        categoryId: item.categoryId,
      });
    }
  }, [item]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const errors = validateItemForm(form);
  const mutationError = createState.error ?? updateState.error;
  const busy = createState.isLoading || updateState.isLoading || itemLoading;

  // Ownership check for edit mode (the API enforces this too).
  const forbidden =
    isEdit && item && authUser && !isAdmin && item.createdById !== authUser.sub;

  const setField =
    (key: keyof FormState) => (value: string) =>
      setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length > 0) return;

    const payload: CreateItemDto = {
      name: form.name.trim(),
      origin: form.origin.trim(),
      year: Number(form.year),
      priceEur: Number(form.priceEur),
      categoryId: form.categoryId,
    };

    if (!isEdit) {
      if (form.description.trim()) payload.description = form.description.trim();
      const result = await createItem(payload);
      if (result.data) navigate(`/items/${result.data.id}`);
    } else if (id) {
      // Note: the backend UpdateAntiqueItemDto does not accept `description`.
      const result = await updateItem({ id, body: payload });
      if (result.data) navigate(`/items/${result.data.id}`);
    }
  };

  if (isEdit && itemLoading) {
    return (
      <div className="container page form-page">
        <p className="muted">
          <Spinner /> Loading item…
        </p>
      </div>
    );
  }

  if (isEdit && (itemError || forbidden || !item)) {
    return (
      <div className="container page form-page">
        <Link to="/" className="btn btn-ghost form-back">
          <ArrowLeftIcon /> Back
        </Link>
        {forbidden ? (
          <EmptyState
            title="Not your item"
            description="Only the collector who listed this item (or an administrator) can edit it."
          />
        ) : itemError ? (
          <ErrorAlert error={itemError} />
        ) : (
          <EmptyState title="Item not found" />
        )}
      </div>
    );
  }

  const showFieldError = (key: keyof FormState) => touched && errors[key];

  return (
    <div className="container page form-page">
      <Link to={isEdit ? `/items/${id}` : "/"} className="btn btn-ghost form-back">
        <ArrowLeftIcon /> {isEdit ? "Back to item" : "Back to collection"}
      </Link>

      <div className="card form-card">
        <div className="card-body">
          <span className="eyebrow">{isEdit ? "Edit listing" : "New listing"}</span>
          <h1>{isEdit ? `Edit ${item?.name}` : "Add an antique"}</h1>
          <p className="muted">
            {isEdit
              ? "Update the details of this piece."
              : "Describe the piece as precisely as you can — provenance matters."}
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field span-2">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={(event) => setField("name")(event.target.value)}
                  aria-invalid={Boolean(showFieldError("name"))}
                  placeholder="e.g. Georgian silver teapot"
                />
                {showFieldError("name") && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="field">
                <label htmlFor="origin">Origin *</label>
                <input
                  id="origin"
                  className="input"
                  value={form.origin}
                  onChange={(event) => setField("origin")(event.target.value)}
                  aria-invalid={Boolean(showFieldError("origin"))}
                  placeholder="e.g. Sheffield, England"
                />
                {showFieldError("origin") && <span className="field-error">{errors.origin}</span>}
              </div>

              <div className="field">
                <label htmlFor="year">Year *</label>
                <input
                  id="year"
                  className="input"
                  type="number"
                  min={YEAR_RANGE.min}
                  max={YEAR_RANGE.max}
                  value={form.year}
                  onChange={(event) => setField("year")(event.target.value)}
                  aria-invalid={Boolean(showFieldError("year"))}
                  placeholder="e.g. 1820"
                />
                {showFieldError("year") && <span className="field-error">{errors.year}</span>}
              </div>

              <div className="field">
                <label htmlFor="priceEur">Price (EUR) *</label>
                <input
                  id="priceEur"
                  className="input"
                  type="number"
                  step="0.01"
                  min="1"
                  value={form.priceEur}
                  onChange={(event) => setField("priceEur")(event.target.value)}
                  aria-invalid={Boolean(showFieldError("priceEur"))}
                  placeholder="e.g. 450.00"
                />
                {showFieldError("priceEur") && (
                  <span className="field-error">{errors.priceEur}</span>
                )}
              </div>

              <div className="field">
                <label htmlFor="categoryId">Category *</label>
                <select
                  id="categoryId"
                  className="select"
                  value={form.categoryId}
                  onChange={(event) => setField("categoryId")(event.target.value)}
                  aria-invalid={Boolean(showFieldError("categoryId"))}
                >
                  <option value="" disabled>
                    {categoriesLoading ? "Loading categories…" : "Choose a category…"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {showFieldError("categoryId") && (
                  <span className="field-error">{errors.categoryId}</span>
                )}
              </div>

              <div className="field span-2">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="textarea"
                  value={form.description}
                  onChange={(event) => setField("description")(event.target.value)}
                  maxLength={1000}
                  aria-invalid={Boolean(showFieldError("description"))}
                  placeholder="Condition, maker's marks, provenance…"
                />
                <span className="field-hint">
                  {isEdit
                    ? "Description cannot be changed after the item is created."
                    : `${form.description.length}/1000 characters`}
                </span>
                {showFieldError("description") && (
                  <span className="field-error">{errors.description}</span>
                )}
              </div>
            </div>

            <ErrorAlert error={mutationError} />

            <div className="form-actions">
              <Link to={isEdit ? `/items/${id}` : "/"} className="btn btn-ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn-brass btn-lg" disabled={busy}>
                {busy && <Spinner />}
                {isEdit ? "Save changes" : "Add item"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
