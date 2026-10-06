import type { ReactNode } from "react";
import styles from "./PageContainer.module.css";

type PageContainerProps = {
  children: ReactNode;
};

function PageContainer({ children }: PageContainerProps) {
  return <main className={styles.container}>{children}</main>;
}

export default PageContainer;
