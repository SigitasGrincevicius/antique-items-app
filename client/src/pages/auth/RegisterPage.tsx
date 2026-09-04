import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../services/api";
import { ErrorAlert, Spinner } from "../../components/ui";
import "./auth.css";

// Mirrors the backend CreateUserDto password rules.
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One number", test: (value: string) => /[0-9]/.test(value) },
  { label: "One special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const passwordValid = PASSWORD_RULES.every((rule) => rule.test(password));
  const canSubmit = name.trim().length >= 2 && email.includes("@") && passwordValid;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await register({ name: name.trim(), email: email.trim(), password });
    if ("data" in result && result.data) {
      navigate("/login", { state: { registered: true } });
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <span className="eyebrow" style={{ display: "block", textAlign: "center" }}>
          Join the cabinet
        </span>
        <h1>Create account</h1>
        <p className="lead">Catalogue, favorite and discuss antiques.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              className="input"
              autoComplete="name"
              minLength={2}
              maxLength={255}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <ul className="password-rules" aria-live="polite">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule.label} className={rule.test(password) ? "ok" : ""}>
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>

          <ErrorAlert error={error} />

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={isLoading || !canSubmit}
          >
            {isLoading && <Spinner />}
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
