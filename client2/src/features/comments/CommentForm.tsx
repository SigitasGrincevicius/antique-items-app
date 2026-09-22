import { useState, type FormEvent } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { ErrorAlert, Spinner } from "../../components/ui";

const MAX_LENGTH = 2000;

interface CommentFormProps {
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  busy?: boolean;
  error?: FetchBaseQueryError | SerializedError;
  onSubmit: (content: string) => Promise<boolean> | boolean;
  onCancel?: () => void;
}

export default function CommentForm({
  initialValue = "",
  placeholder = "Share what you know about this piece…",
  submitLabel = "Post comment",
  autoFocus = false,
  busy = false,
  error,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const [value, setValue] = useState(initialValue);
  const trimmed = value.trim();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    const ok = await onSubmit(trimmed);
    if (ok) setValue("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="textarea"
        value={value}
        maxLength={MAX_LENGTH}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(event) => setValue(event.target.value)}
        aria-label={placeholder}
      />
      <ErrorAlert error={error} />
      <div className="comment-form-footer">
        <span className="muted small">
          {value.length}/{MAX_LENGTH}
        </span>
        <div className="row">
          {onCancel && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !trimmed}>
            {busy && <Spinner />}
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
