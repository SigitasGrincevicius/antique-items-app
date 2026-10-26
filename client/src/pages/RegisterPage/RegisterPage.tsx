import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { registerRequest } from "../../features/auth/authApi";
import styles from "./RegisterPage.module.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErroMessage] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setErroMessage(null);

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setErroMessage("Name must contain at least 2 characters.");
      return;
    }

    // The bachend trims passwords. Reject surrounding whitrespace
    // so the saved password matches what the user entered.
    if (password !== password.trim()) {
      setErroMessage("Password cannot start or end with withespace.");
      return;
    }

    if (
      password.length < 8 ||
      password.length > 72 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setErroMessage(
        "Password must be 8-72 characters and contain an uppercase letter, a number, and a special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setErroMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerRequest({
        name: trimmedName,
        email: email.trim(),
        password,
      });

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (error: unknown) {
      setErroMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Create an account</h1>
      <p>Register to manage your antique items.</p>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
      >
        <div className={styles.field}>
          <label htmlFor="register-name" className={styles.label}>
            Name
          </label>
          <input
            className={styles.control}
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={255}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-email" className={styles.label}>
            Name
          </label>
          <input
            className={styles.control}
            id="register-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={255}
            disabled={isSubmitting}
            required
          />
        </div>
      </form>
    </section>
  );
}

export default RegisterPage;
