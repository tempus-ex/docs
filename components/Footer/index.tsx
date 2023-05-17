import Link from "next/link";
import styles from "./styles.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer__inner"]}>
        <h3 className={styles["footer__title"]}>Fusion Feed API</h3>
        <div className={styles["footer__links"]}>
          <div className={styles["footer__section"]}>
            <h6 className={styles["footer__section-header"]}>About Us</h6>
            <Link className={styles['footer__section-link']} href="https://tempus-ex.com/">Tempus ex Home</Link>
            <Link className={styles['footer__section-link']} href="https://tempus-ex.com/">About</Link>
            <Link className={styles['footer__section-link']} href="https://tempus-ex.com/careers">Careers</Link>
          </div>
          <div className={styles["footer__section"]}>
            <h6 className={styles["footer__section-header"]}>Contact Us</h6>
            <p className={styles['footer__section-address']}>
              635 Brannan St
              <br />
              San Francisco, CA 94107
            </p>
            <Link className={styles['footer__section-link']} href="mailto:contact@tempus-ex.com">
              contact@tempus-ex.com
            </Link>
            <div></div>
          </div>
        </div>
      </div>
      <p className={styles["footer__patent"]}>Protected by U.S. Patent Nos. 11,140,328 & 11,172,248</p>
    </footer>
  );
};
