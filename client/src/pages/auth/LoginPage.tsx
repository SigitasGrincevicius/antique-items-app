import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/api";
import { useAppDispatch } from "../../hooks";
import { setCredentials } from "../../features/auth/authSlice";
import { ErrorAlert, Spinner } from "../../components/ui";
import "./auth.css";

interface LocationState {
  from?: string;
  registered?: boolean;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await login({ email, password });
    if ("data" in result && result.data) {
      dispatch(setCredentials(result.data.accessToken));
      navigate(state.from ?? "/", { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <span className="eyebrow" style={{ display: "block", textAlign: "center" }}>
          Welcome back
        </span>
        <h1>Sign in</h1>
        <p className="lead">Continue curating your collection.</p>

        {state.registered && (
          <div className="alert alert-success" style={{ marginBottom: "1rem" }}>
            Account created. You can sign in now.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <ErrorAlert error={error} fallback="Invalid email or password." />

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={isLoading || !email || !password}
          >
            {isLoading && <Spinner />}
            Sign in
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
