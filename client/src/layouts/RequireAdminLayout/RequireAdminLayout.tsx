import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../app/hooks";

function RequireAdminLayout() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !user.roles?.includes("admin")) {
    return <Navigate to="/items" replace />;
  }

  return <Outlet />;
}

export default RequireAdminLayout;