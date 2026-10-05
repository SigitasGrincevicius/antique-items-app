import { NavLink } from "react-router";
import { useAppSelector } from "../../app/hooks";
import styles from "./Navigation.module.css";

function Navigation() {
  const { user } = useAppSelector((state) => state.auth);

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `${styles.link}${isActive ? ` ${styles.active}` : ""}`;

  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <NavLink to="/items" className={linkClassName}>
        Items
      </NavLink>

      <NavLink to="/favorites" className={linkClassName}>
        Favorites
      </NavLink>

      {user?.roles?.includes("admin") && (
        <NavLink to="/categories" className={linkClassName}>
          Categories
        </NavLink>
      )}

      <NavLink to="/profile" className={linkClassName}>
        Profile
      </NavLink>
    </nav>
  );
}

export default Navigation;
