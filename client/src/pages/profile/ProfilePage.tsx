import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useGetProfileQuery, useGrantAdminRoleMutation } from "../../services/api";
import { ErrorAlert, Skeleton } from "../../components/ui";
import { Avatar } from "../../components/ui";
import { Role } from "../../types";
import { formatDate, getErrorMessage } from "../../utils/format";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useGetProfileQuery();
  const [grantAdmin, grantState] = useGrantAdminRoleMutation();
  const [userId, setUserId] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const isAdmin = user?.roles?.includes(Role.ADMIN) ?? false;

  const handleGrant = async (event: FormEvent) => {
    event.preventDefault();
    setSuccess(null);
    const result = await grantAdmin(userId.trim());
    if ("data" in result && result.data) {
      setSuccess(`${result.data.name} is now an administrator.`);
      setUserId("");
    }
  };

  if (isLoading) {
    return (
      <div className="container page profile-page">
        <div className="card card-body stack">
          <Skeleton width="120px" height="72px" style={{ borderRadius: "999px" }} />
          <Skeleton width="60%" height="1.6rem" />
          <Skeleton width="40%" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container page profile-page">
        <ErrorAlert error={error} fallback="Your profile could not be loaded." />
        <Link to="/login" className="btn btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="container page profile-page">
      <header className="page-header">
        <div className="row">
          <Avatar name={user.name} />
          <div>
            <h1 style={{ margin: 0 }}>{user.name}</h1>
            <span className="muted">{user.email}</span>
          </div>
        </div>
        <div className="row">
          {user.roles.map((role) => (
            <span key={role} className={`badge ${role === Role.ADMIN ? "badge-red" : "badge-neutral"}`}>
              {role}
            </span>
          ))}
        </div>
      </header>

      <div className="card">
        <div className="card-body">
          <h2>Account</h2>
          <dl className="profile-facts">
            <div>
              <dt>Member since</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
            <div>
              <dt>Roles</dt>
              <dd>{user.roles.join(", ")}</dd>
            </div>
          </dl>
          <p className="muted small" style={{ margin: 0 }}>
            {isAdmin
              ? "As an administrator you can manage categories and moderate all items and comments."
              : "You can list antiques, edit your own listings, and join discussions."}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="card">
          <div className="card-body">
            <h2>Grant admin role</h2>
            <p className="muted small">
              Paste the user id of an account to promote it to administrator.
            </p>
            <form className="grant-form" onSubmit={handleGrant}>
              <input
                className="input"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="User UUID…"
                aria-label="User id"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={grantState.isLoading || !userId.trim()}
              >
                Grant admin
              </button>
            </form>
            {success && <div className="alert alert-success">{success}</div>}
            {grantState.error && (
              <div className="alert alert-error">{getErrorMessage(grantState.error)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
