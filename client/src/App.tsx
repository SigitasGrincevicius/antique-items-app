import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedLayout from "./layouts/ProtectedLayout/ProtectedLayout";
import ItemsPage from "./pages/ItemsPage/ItemsPage";
import CreateItemPage from "./pages/CreateItemPage/CreateItemPage";
import ItemDetailsPage from "./pages/ItemDetailsPage/ItemDetailsPage";
import EditItemPage from "./pages/EditItemPage/EditItemPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import GuestLayout from "./layouts/GuestLayout/GuestLayout";
import RequireAdminLayout from "./layouts/RequireAdminLayout/RequireAdminLayout";

function App() {
  return (
    <Routes>
      {/* Pages for visitors who are not signed in */}
      <Route element={<GuestLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Pages that require authentication */}
      <Route element={<ProtectedLayout />}>
        {/* Serving items directly at the root URL */}
        <Route index element={<ItemsPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/new" element={<CreateItemPage />} />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        <Route path="/items/:id/edit" element={<EditItemPage />} />

        <Route path="/favorites" element={<FavoritesPage />} />

        {/* Pages that additionally require the admin role */}
        <Route element={<RequireAdminLayout />}>
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Any URL that does not match a route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
