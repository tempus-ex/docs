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
  const hasChildren = page.children && page.children.length > 0;
  const flatChildren =
    page.children?.flatMap((child) => [child, ...(child.children || [])]) ?? [];
  const activeSection =
    page.path === path ||
    flatChildren.map((child) => child.path).includes(path);

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
          [styles["navbar__link--has-children"]]: hasChildren,
          [styles["navbar__link--active-children"]]:
            hasChildren && activeSection,
        })}
        href={page.path}
      >
        {page.title}
      </Link>
      {activeSection &&
        page.children?.map((childPage) => (
          <>
            <Link
              className={clsx({
                [styles["navbar__link"]]: true,
                [styles["navbar__link--active"]]: childPage.path === path,
                [styles["navbar__link--level-one"]]: true,
              })}
              href={childPage.path}
              key={childPage.path}
            >
              {childPage.title}
            </Link>
            {childPage.children?.map((grandchildPage) => (
              <Link
                className={clsx({
                  [styles["navbar__link"]]: true,
                  [styles["navbar__link--active"]]:
                    grandchildPage.path === path,
                  [styles["navbar__link--level-two"]]: true,
                })}
                href={grandchildPage.path}
                key={grandchildPage.path}
              >
                {grandchildPage.title}
              </Link>
            ))}
          </>
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
