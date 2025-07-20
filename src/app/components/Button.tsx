import styles from "./Button.module.css";
import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  round?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  round = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const cls = [
    styles.button,
    styles[variant],
    round ? styles.round : "",
    className,
  ].join(" ");

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
