import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { login } from "../authSlice";

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
    <form onSubmit={handleSubmit} aria-busy={isLoading}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={255}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {error && <p role="alert">{error}</p>}

      <button type="submit">{isLoading ? "Logging in..." : "Log in"}</button>
    </form>
  );
}

export default LoginForm;
