import { useAppSelector } from "./app/hooks";
import LogoutButton from "./components/LogoutButton/LogoutButton";
import ItemsPage from "./components/tmp/ItemsPage";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
  const { user, accessToken } = useAppSelector((state) => state.auth);

  if (!user || !accessToken) {
    return <LoginPage />;
  }

  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <p>You are logged in as {user.email}</p>
      <LogoutButton />
      <ItemsPage />
    </main>
  );
}

export default App;
