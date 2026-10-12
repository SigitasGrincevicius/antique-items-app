import LoginForm from "../../features/auth/LoginForm/LoginForm";
import styles from "./LoginPage.module.css";

function LoginPage() {
  return (
    <section className={styles.login}>
      <header className={styles.header}>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.subtitle}>
          Sign in to your antique items account.
        </p>
      </header>
      <LoginForm />
    </section>
  );
}

export default LoginPage;
