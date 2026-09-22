import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "./hooks";
import { selectIsAuthenticated } from "./features/auth/authSlice";
import Layout from "./components/Layout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ItemsPage from "./pages/items/ItemsPage";
import ItemDetailPage from "./pages/items/ItemDetailPage";
import ItemFormPage from "./pages/items/ItemFormPage";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import ProfilePage from "./pages/profile/ProfilePage";
import type { ReactNode } from "react";

function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const isAdmin = useAppSelector((state) => state.auth.user?.roles?.includes("admin") ?? false);

  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <ItemsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/items/new"
          element={
            <RequireAuth>
              <ItemFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/items/:id"
          element={
            <RequireAuth>
              <ItemDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/items/:id/edit"
          element={
            <RequireAuth>
              <ItemFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/favorites"
          element={
            <RequireAuth>
              <FavoritesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <RequireAuth>
              <RequireAdmin>
                <CategoriesPage />
              </RequireAdmin>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

