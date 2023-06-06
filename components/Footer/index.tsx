import Link from "next/link";
import styles from "./styles.module.scss";
import clsx from "clsx";
import Image from "next/image";

import github from "../../public/images/github.svg";
import twitter from "../../public/images/twitter.svg";
import { useDocsTheme } from "../Theme";

export const Footer = () => {
  const { theme } = useDocsTheme();
  return (
    <footer
      className={clsx({
        [styles.footer]: true,
        [styles["footer--dark-mode"]]: theme === "dark",
      })}
    >
      <div className={styles["footer__inner"]}>
        <h2 className={styles["footer__title"]}>FusionFeed API</h2>
        <div
          className={clsx([styles["footer__section"], styles["footer__links"]])}
        >
          <h6 className={styles["footer__section-header"]}>About Us</h6>
          <Link
            className={styles["footer__section-link"]}
            href="https://tempus-ex.com/"
          >
            Tempus Ex Home
          </Link>
          {/*TODO need an About link */}
          {/* <Link
            className={styles["footer__section-link"]}
            href="https://tempus-ex.com/"
          >
            About
          </Link> */}
          <Link
            className={styles["footer__section-link"]}
            href="https://tempus-ex.com/careers"
          >
            Careers
          </Link>
        </div>
        <div
          className={clsx([
            styles["footer__section"],
            styles["footer__contact"],
          ])}
        >
          <h6 className={styles["footer__section-header"]}>Contact Us</h6>
          <p className={styles["footer__section-address"]}>
            635 Brannan St
            <br />
            San Francisco, CA 94107
          </p>
          <Link
            className={styles["footer__section-email"]}
            href="mailto:support@tempus-ex.com"
          >
            support@tempus-ex.com
          </Link>
          <div className={styles["footer__section-social"]}>
            <Link
              className={styles["footer__section-social-link"]}
              href={"https://github.com/tempus-ex"}
              target="blank"
            >
              <Image
                src={github}
                width={24}
                height={24}
                alt={"GitHub repository link"}
              />
            </Link>

            <Link
              className={styles["footer__section-social-link"]}
              href={"https://twitter.com/TempusExMachina"}
              target="blank"
            >
              <Image
                src={twitter}
                width={24}
                height={24}
                alt={"Tempus ex official Twitter account"}
              />
            </Link>
          </div>
        </div>
      </div>
      <p className={styles["footer__patent"]}>
        Protected by U.S. Patent Nos. 11,140,328 & 11,172,248
      </p>
    </footer>
  );
};
