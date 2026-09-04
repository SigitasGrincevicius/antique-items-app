import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  logout,
  selectAuthUser,
  selectIsAdmin,
  selectIsAuthenticated,
} from "../features/auth/authSlice";
import { api } from "../services/api";
import { Avatar } from "./ui";
import { CloseIcon, HeartIcon, LogoMark, LogoutIcon, MenuIcon, PlusIcon } from "./Icons";
import "./Layout.css";

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const user = useAppSelector(selectAuthUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            <LogoMark className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">Curio</span>
              <span className="brand-tagline">Antique Collection</span>
            </span>
          </Link>

          <button
            type="button"
            className="btn btn-ghost btn-icon nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <nav className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Main">
            <NavLink to="/" end className="nav-link" onClick={closeMenu}>
              Collection
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/favorites" className="nav-link" onClick={closeMenu}>
                <HeartIcon /> Favorites
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/categories" className="nav-link" onClick={closeMenu}>
                Categories
              </NavLink>
            )}

            <div className="nav-spacer" />

            {isAuthenticated ? (
              <>
                <Link to="/items/new" className="btn btn-brass btn-sm" onClick={closeMenu}>
                  <PlusIcon /> Add item
                </Link>
                <NavLink to="/profile" className="nav-user" onClick={closeMenu}>
                  <Avatar name={user?.name ?? "?"} size="sm" />
                  <span className="nav-user-name">{user?.name}</span>
                </NavLink>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={handleLogout}
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogoutIcon />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer-inner">
          <span className="row">
            <LogoMark className="brand-mark small-mark" /> Curio — a catalogue of curious old
            things.
          </span>
          <span className="muted small">© {new Date().getFullYear()} Antique Items</span>
        </div>
      </footer>
    </div>
  );
}
