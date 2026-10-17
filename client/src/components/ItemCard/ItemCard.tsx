import { Link } from "react-router";
import type { AntiqueItem } from "../../api/apiTypes";
import styles from "./ItemCard.module.css";

type ItemCardProps = {
  item: AntiqueItem;
};

function ItemCard({ item }: ItemCardProps) {
  return (
    <article className={styles.card}>
      <h2>
        <Link to={`/items/${item.id}`} className={styles.itemLink}>
          {item.name}
        </Link>
      </h2>
      <p>
        {item.origin ?? "Unknown origin"} · {item.year}
      </p>
      <p>Price: €{Number(item.priceEur).toFixed(2)}</p>
      <p>Category: {item.category?.name ?? "Uncategorized"}</p>
      {item.description && <p>{item.description}</p>}
    </article>
  );
}

export default ItemCard;
