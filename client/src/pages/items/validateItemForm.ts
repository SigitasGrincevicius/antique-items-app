import type { FormState } from "./itemForm";

const YEAR_MIN = 1000;
const YEAR_MAX = 2100;

/** Client-side mirror of the backend CreateAntiqueItemDto rules. */
export function validateItemForm(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  const name = form.name.trim();
  const origin = form.origin.trim();

  if (name.length < 2 || name.length > 120) errors.name = "Name must be 2–120 characters.";
  if (origin.length < 2 || origin.length > 80) errors.origin = "Origin must be 2–80 characters.";

  const year = Number(form.year);
  if (!Number.isInteger(year) || year < YEAR_MIN || year > YEAR_MAX)
    errors.year = `Year must be a whole number between ${YEAR_MIN} and ${YEAR_MAX}.`;

  const price = Number(form.priceEur);
  if (!Number.isFinite(price) || price < 1 || price > 1_000_000_000)
    errors.priceEur = "Price must be at least €1.";
  else if (Math.round(price * 100) !== price * 100)
    errors.priceEur = "Price can have at most 2 decimal places.";

  if (!form.categoryId) errors.categoryId = "Pick a category.";
  else if (form.description.length > 1000)
    errors.description = "Description can be at most 1000 characters.";

  return errors;
}

export const YEAR_RANGE = { min: YEAR_MIN, max: YEAR_MAX } as const;
