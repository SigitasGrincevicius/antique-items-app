import { Link } from "react-router-dom";
import { useGetFavoritesQuery } from "../../services/api";
import ItemCard from "../../components/ItemCard";
import { EmptyState, ErrorAlert } from "../../components/ui";
import { ItemGridSkeleton } from "../../components/Pagination";
import { useFavorites } from "../../features/favorites/useFavorites";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const { data: favorites = [], isLoading, error } = useGetFavoritesQuery();
  const { isFavorite, toggleFavorite, isBusy } = useFavorites();

  return (
    <div className="container page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Saved pieces</span>
          <h1>Your favorites</h1>
          <p>Antiques you have marked to keep an eye on.</p>
        </div>
        <Link to="/" className="btn btn-outline">
          Browse collection
        </Link>
      </header>

      <ErrorAlert error={error} fallback="Favorites could not be loaded." />

      {isLoading ? (
        <ItemGridSkeleton />
      ) : favorites.length === 0 && !error ? (
        <EmptyState
          title="No favorites yet"
          description="Tap the heart on any item to save it here."
          action={
            <Link to="/" className="btn btn-brass">
              Discover antiques
            </Link>
          }
        />
      ) : (
        <div className="item-grid">
          {favorites.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
              favoriteBusy={isBusy}
            />
          ))}
        </div>
      )}
    </div>
  );
}
