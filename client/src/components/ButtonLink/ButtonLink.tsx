import type { ComponentPropsWithoutRef } from "react";
import { Link } from "react-router";
import styles from "../Button/Button.module.css";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: "primary" | "secondary" | "danger";
};

function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = [
    styles.button,
    variant !== "primary" ? styles[variant] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link className={classes} {...props}>
      {children}
    </Link>
  );
}

export default ButtonLink;