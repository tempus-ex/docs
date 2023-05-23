import Link from "next/link";

import styles from "./styles.module.scss";

export const Header = () => {

  const toggleDarkMode = () => {
    document.body.toggleAttribute("data-darkmode");
  };

  return (
    <header className={styles.header}>
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
          <input type="checkbox" onChange={toggleDarkMode} />
        </label>
      </div>
    </header>
  );
};
