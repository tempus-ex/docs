import Link from "next/link";
import clsx from "clsx";

import styles from "./styles.module.scss";
import { useDocsTheme } from "../Theme";

export const Header = () => {
  const { theme, setTheme } = useDocsTheme();

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <header
      className={clsx({
        [styles.header]: true,
        [styles["header--dark-mode"]]: theme === "dark",
      })}
    >
      <div className={styles["header__inner"]}>
        <Link className={styles["header__link"]} href="/">
          <img
            alt="Tempus Ex"
            className={styles["header__logo"]}
            src={"/images/FusionFeedLogo.svg"}
          />
        </Link>
        {/**TODO:  This dark mode toggle is for testing only. Remove before deploy */}
        <label>
          Dark Mode
          <input
            type="checkbox"
            onChange={(e) => toggleDarkMode(e.target.checked)}
          />
        </label>
      </div>
    </header>
  );
};
