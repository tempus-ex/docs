import Link from "next/link";

import styles from "./styles.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles["header__inner"]}>
        <Link className={styles["header__link"]} href="/">
          <img
            alt="Tempus Ex"
            className={styles["header__logo"]}
            src={"images/FusionFeedLogo.svg"}
          />
        </Link>
      </div>
    </header>
  );
};
