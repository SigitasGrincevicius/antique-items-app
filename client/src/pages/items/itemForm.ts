/** Shared shape of the antique item form. */
export interface FormState {
  name: string;
  origin: string;
  year: string;
  priceEur: string;
  description: string;
  categoryId: string;
}

export const EMPTY_FORM: FormState = {
  name: "",
  origin: "",
  year: "",
  priceEur: "",
  description: "",
  categoryId: "",
};
