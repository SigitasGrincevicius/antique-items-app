import { Link } from "react-router-dom";
import type { AntiqueItem } from "../types";
import { categoryHue, describeEra, formatPrice } from "../utils/format";
import { HeartIcon } from "./Icons";
import "./ItemCard.css";

interface ItemCardProps {
  item: AntiqueItem;
  isFavorite?: boolean;
  onToggleFavorite?: (item: AntiqueItem) => void;
  favoriteBusy?: boolean;
}

export default function ItemCard({
  item,
  isFavorite = false,
  onToggleFavorite,
  favoriteBusy = false,
}: ItemCardProps) {
  const hue = categoryHue(item.category?.name);
  const initial = item.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="item-card">
      <Link to={`/items/${item.id}`} className="item-card-media" style={{ ["--hue" as string]: hue }}>
        <span className="item-card-initial">{initial}</span>
        <span className="item-card-year">{item.year}</span>
      </Link>

      <div className="item-card-body">
        <div className="item-card-meta">
          {item.category && <span className="badge">{item.category.name}</span>}
          <span className="muted small">{describeEra(item.year)}</span>
        </div>

        <h3 className="item-card-title">
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </h3>

        {item.origin && <p className="item-card-origin muted small">{item.origin}</p>}

        {item.description && <p className="item-card-desc">{item.description}</p>}

        <div className="item-card-footer">
          <span className="item-card-price">{formatPrice(item.priceEur)}</span>
          {onToggleFavorite && (
            <button
              type="button"
              className={`btn btn-icon fav-btn ${isFavorite ? "is-active" : ""}`}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              disabled={favoriteBusy}
              onClick={() => onToggleFavorite(item)}
            >
              <HeartIcon filled={isFavorite} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
