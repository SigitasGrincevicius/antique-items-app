import { useEffect, type ReactNode } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { getErrorMessage, getInitials } from "../utils/format";

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
export function ErrorAlert({
  error,
  fallback,
}: {
  error: FetchBaseQueryError | SerializedError | undefined;
  fallback?: string;
}) {
  if (!error) return null;
  return (
    <div className="alert alert-error" role="alert">
      {getErrorMessage(error, fallback)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  return (
    <span className={`avatar ${size === "sm" ? "avatar-sm" : ""}`} title={name}>
      {getInitials(name) || "?"}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Spinner / Skeleton
// ---------------------------------------------------------------------------
export function Spinner() {
  return <span className="spinner" role="status" aria-label="Loading" />;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  style,
}: {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}) {
  return <div className="skeleton" style={{ width, height, ...style }} aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal / confirm dialog
// ---------------------------------------------------------------------------
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="modal-title">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  busy = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="muted">{message}</p>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy && <Spinner />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
