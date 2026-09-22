import { useAppDispatch, useAppSelector } from "./app/hooks";
import { logout } from "./features/auth/authSlice";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  if (!user || !accessToken) {
    return <LoginPage />;
  }

  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <p>You are logged in as {user.email}</p>

      <button type="button" onClick={() => dispatch(logout())}>
        Log out
      </button>
    </main>
  );
}

export default App;
