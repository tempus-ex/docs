import React from "react";
import Link from "next/link";
import { TableOfContents, TableOfContentsPage } from "@/lib/content";
import clsx from "clsx";
import styles from "./styles.module.scss";

export type NavBarProps = {
  toc: TableOfContents;
  path: string;
};

type NavbarSectionProps = {
  page: TableOfContentsPage;
  path: string;
};

const NavbarSection = ({ page, path }: NavbarSectionProps) => {
  const activeSection =
    page.path === path ||
    page.children?.map((child) => child.path).includes(path);

  return (
    <section
      className={clsx({
        [styles["navbar__section"]]: true,
        [styles["navbar__section--active"]]: activeSection,
      })}
      key={page.path}
    >
      <Link
        className={clsx({
          [styles["navbar__link"]]: true,
          [styles["navbar__link--active"]]: page.path === path,
          [styles["navbar__link--toplevel"]]: true,
          [styles["navbar__link--has-children"]]:
            page.children && page.children.length > 0,
        })}
        href={page.path}
      >
        {page.title}
      </Link>
      {activeSection &&
        page.children?.map((page) => (
          <Link
            className={clsx({
              [styles["navbar__link"]]: true,
              [styles["navbar__link--active"]]: page.path === path,
              [styles["navbar__link--nested"]]: true,
            })}
            href={page.path}
            key={page.path}
          >
            {page.title}
          </Link>
        ))}
    </section>
  );
};

export const NavBar = ({ toc, path }: NavBarProps) => {
  return (
    <div className={styles["navbar"]}>
      <div className={styles["navbar__top"]}>
        <Link href={toc.path}>
          <h3 className={styles["navbar__title"]}>{toc.title}</h3>
        </Link>
      </div>
      <div className={styles["navbar__pages"]}>
        {toc.pages.map((page) => (
          <NavbarSection key={page.path} page={page} path={path} />
        ))}
      </div>
    </div>
  );
};
