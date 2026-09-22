import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteItemMutation, useGetItemQuery } from "../../services/api";
import { useAppSelector } from "../../hooks";
import { selectAuthUser, selectIsAdmin } from "../../features/auth/authSlice";
import { useFavorites } from "../../features/favorites/useFavorites";
import { ConfirmDialog, EmptyState, ErrorAlert, Skeleton } from "../../components/ui";
import {
  ArrowLeftIcon,
  CalendarIcon,
  EditIcon,
  GlobeIcon,
  HeartIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
} from "../../components/Icons";
import CommentsSection from "../../features/comments/CommentsSection";
import { categoryHue, describeEra, formatDate, formatPrice } from "../../utils/format";
import "./ItemsPage.css";

export default function ItemDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser);
  const isAdmin = useAppSelector(selectIsAdmin);

  const { data: item, isLoading, error } = useGetItemQuery(id, { skip: !id });
  const [deleteItem, deleteState] = useDeleteItemMutation();
  const { isFavorite, toggleFavorite, isBusy: favBusy } = useFavorites();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canEdit = Boolean(item && authUser && (isAdmin || item.createdById === authUser.sub));
  const favorite = item ? isFavorite(item.id) : false;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteItem(item.id);
    if (!("error" in result)) navigate("/", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="container page">
        <Skeleton width="120px" height="1rem" style={{ marginBottom: "1.25rem" }} />
        <div className="detail-grid">
          <Skeleton height="380px" style={{ borderRadius: "14px" }} />
          <div className="stack">
            <Skeleton width="30%" height="0.8rem" />
            <Skeleton width="85%" height="2.4rem" />
            <Skeleton width="40%" height="2rem" />
            <Skeleton height="6rem" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container page">
        <Link to="/" className="btn btn-ghost detail-back">
          <ArrowLeftIcon /> Back to collection
        </Link>
        {error ? (
          <ErrorAlert error={error} fallback="This item could not be loaded." />
        ) : (
          <EmptyState title="Item not found" />
        )}
      </div>
    );
  }

  return (
    <div className="container page">
      <Link to="/" className="btn btn-ghost detail-back">
        <ArrowLeftIcon /> Back to collection
      </Link>

      <div className="detail-grid">
        <div className="detail-media" style={{ ["--hue" as string]: categoryHue(item.category?.name) }}>
          <span className="initial">{item.name.trim().charAt(0).toUpperCase()}</span>
        </div>

        <div>
          <div className="row" style={{ flexWrap: "wrap" }}>
            {item.category && <span className="badge">{item.category.name}</span>}
            <span className="badge badge-neutral">{describeEra(item.year)}</span>
          </div>
          <h1 className="detail-title">{item.name}</h1>
          <div className="detail-price">{formatPrice(item.priceEur)}</div>

          <div className="detail-actions">
            <button
              type="button"
              className={`btn ${favorite ? "btn-danger" : "btn-outline"}`}
              onClick={() => toggleFavorite(item)}
              disabled={favBusy}
              aria-pressed={favorite}
            >
              <HeartIcon filled={favorite} />
              {favorite ? "Favorited" : "Add to favorites"}
            </button>
            {canEdit && (
              <>
                <Link to={`/items/${item.id}/edit`} className="btn btn-outline">
                  <EditIcon /> Edit
                </Link>
                <button type="button" className="btn btn-danger" onClick={() => setConfirmOpen(true)}>
                  <TrashIcon /> Delete
                </button>
              </>
            )}
          </div>

          <ErrorAlert error={deleteState.error} />

          <dl className="detail-facts">
            <li>
              <CalendarIcon />
              <div>
                <dt>Year</dt>
                <dd>{item.year}</dd>
              </div>
            </li>
            <li>
              <GlobeIcon />
              <div>
                <dt>Origin</dt>
                <dd>{item.origin || "Unknown"}</dd>
              </div>
            </li>
            <li>
              <TagIcon />
              <div>
                <dt>Category</dt>
                <dd>{item.category?.name ?? "Uncategorised"}</dd>
              </div>
            </li>
          </dl>

          {item.description ? (
            <p className="detail-description">{item.description}</p>
          ) : (
            <p className="muted">No description has been provided for this piece.</p>
          )}

          <div className="detail-provenance">
            <UserIcon />
            <span>
              Listed by <strong>{item.createdBy?.name ?? "an anonymous collector"}</strong> on{" "}
              {formatDate(item.createdAt)}
              {item.updatedAt !== item.createdAt && ` · updated ${formatDate(item.updatedAt)}`}
            </span>
          </div>
        </div>
      </div>

      <hr className="divider" style={{ margin: "2.5rem 0" }} />

      <CommentsSection itemId={item.id} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this item?"
        message={`"${item.name}" and all its comments will be permanently removed.`}
        busy={deleteState.isLoading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
