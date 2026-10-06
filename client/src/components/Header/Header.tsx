import { useAppSelector } from "../../app/hooks";
import Navigation from "../Navigation/Navigation";
import styles from "./Header.module.css";
import LogoutButton from "../LogoutButton/LogoutButton";

function Header() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <span className={styles.title}>Antique Items</span>
          <p className={styles.welcome}>Welcome, {user?.name}</p>
        </div>

        <Navigation />
        <LogoutButton />
      </div>
    </header>
  );
}

export default Header;
