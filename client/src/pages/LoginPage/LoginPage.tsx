import { Link, useLocation } from "react-router";
import LoginForm from "../../features/auth/LoginForm/LoginForm";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const location = useLocation();
  const state: unknown = location.state;

  const registered =
    typeof state === "object" &&
    state !== null &&
    "registered" in state &&
    state.registered === true;

  return (
    <section className={styles.login}>
      <header className={styles.header}>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.subtitle}>
          Sign in to your antique items account.
        </p>
      </header>

      {registered && (
        <p role="status">Account created successfully. You can now log in.</p>
      )}

      <LoginForm />

      <p>
        Don&apos;t have an account?{" "}
        <Link to="/register" state={location.state}>
          Register
        </Link>
      </p>
    </section>
  );
}

export default LoginPage;
