import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { login } from "../authSlice";
import styles from "../../../styles/Form.module.css";
import Button from "../../../components/Button/Button";

function LoginForm() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = status === "loading";

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    await dispatch(login({ email: email.trim(), password }));
    setPassword("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={isLoading}>
      <div className={styles.field}>
        <label htmlFor="login-email" className={styles.label}>
          Email
        </label>

        <input
          className={styles.control}
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={255}
          disabled={isLoading}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-password">
          Password
        </label>

        <input
          className={styles.control}
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {error && (
        <p className={styles.feedback} role="alert">
          {error}
        </p>
      )}

      <Button className={styles.submit} type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}

export default LoginForm;
