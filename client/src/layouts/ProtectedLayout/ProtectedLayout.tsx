import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";
import Header from "../../components/Header/Header";
import PageContainer from "../../components/PageContainer/PageContainer";

function ProtectedLayout() {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user || !accessToken) {
    const from = location.pathname + location.search + location.hash;

    return <Navigate to="/login" replace state={{ from }} />;
  }

  return (
    <>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}

export default ProtectedLayout;
