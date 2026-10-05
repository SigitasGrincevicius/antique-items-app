import { Link, Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Button from "../../components/Button/Button";

function ProtectedLayout() {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user || !accessToken) {
    const from = location.pathname + location.search + location.hash;

    return <Navigate to="/login" replace state={{ from }} />;
  }

  return (
    <>
      <header>
        <p>Welcome, {user.name}</p>
        <nav>
          <Link to="/items">Items</Link>
        </nav>
        <LogoutButton />
        <Button>Save</Button>
      </header>

      <Outlet />
    </>
  );
}

export default ProtectedLayout;
