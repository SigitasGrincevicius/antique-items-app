import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";

function getReturnPath(state: unknown): string {
  if (
    typeof state !== "object" ||
    state === null ||
    !("from" in state) ||
    typeof state.from !== "string"
  ) {
    return "/items";
  }

  const path = state.from;
  const pathname = path.split(/[?#]/)[0];

  // Allow internal destinations and avoid authentication redirect loops.
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    /^\/(?:login|register)\/?$/i.test(pathname)
  ) {
    return "/items";
  }

  return path;
}

function GuestLayout() {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (user && accessToken) {
    return <Navigate to={getReturnPath(location.state)} replace />;
  }

  return <Outlet />;
}

export default GuestLayout;
