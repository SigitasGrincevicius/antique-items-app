import styles from "./ItemsToolbar.module.css";
import Button from "../Button/Button";

type ItemsToolbarProps = {
  total: number;
  isFetching: boolean;
  onRefresh: () => void;
};

function ItemsToolbar({ total, isFetching, onRefresh }: ItemsToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <p>Total items: {total}</p>
      <Button onClick={onRefresh} disabled={isFetching}>
        Refresh
      </Button>
    </div>
  );
}

export default ItemsToolbar;
