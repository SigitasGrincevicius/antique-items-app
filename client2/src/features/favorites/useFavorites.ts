import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { selectIsAuthenticated } from "../auth/authSlice";
import {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../../services/api";
import type { AntiqueItem } from "../../types";

/**
 * Shared favorites state: exposes a `Set` of favorited ids and a toggle
 * function. Unauthenticated users are redirected to the login page.
 */
export function useFavorites() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const { data: favorites = [], isLoading } = useGetFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addFavorite, addState] = useAddFavoriteMutation();
  const [removeFavorite, removeState] = useRemoveFavoriteMutation();

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (item: AntiqueItem) => {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      }
      if (favoriteIds.has(item.id)) {
        await removeFavorite(item.id);
      } else {
        await addFavorite(item.id);
      }
    },
    [isAuthenticated, favoriteIds, addFavorite, removeFavorite, navigate],
  );

  return {
    favorites,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    isLoading,
    isBusy: addState.isLoading || removeState.isLoading,
  };
}
