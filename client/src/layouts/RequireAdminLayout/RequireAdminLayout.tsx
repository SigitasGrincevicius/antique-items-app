import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../app/hooks";
import PageContainer from "../../components/PageContainer/PageContainer";

function RequireAdminLayout() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !user.roles?.includes("admin")) {
    return <Navigate to="/items" replace />;
  }

  return (
    <PageContainer>
      <Outlet />;
    </PageContainer>
  );
}

export default RequireAdminLayout;
