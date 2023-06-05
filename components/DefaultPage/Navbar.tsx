import React from "react";
import Link from "next/link";
import { TableOfContents } from "@/lib/content";
import clsx from "clsx";
import styles from "./styles.module.scss";

export type NavBarProps = {
  toc: TableOfContents;
  path: string;
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
          <section
            className={clsx({
              [styles["navbar__section"]]: true,
              [styles["navbar__section--active"]]: page.children
                ?.map((child) => child.path)
                .includes(path),
            })}
            key={page.path}
          >
            <Link
              className={clsx({
                [styles["navbar__link"]]: true,
                [styles["navbar__link--active"]]: page.path === path,
                [styles["navbar__link--toplevel"]]: true,
              })}
              href={page.path}
            >
              {page.title}
            </Link>
            {page.children?.map((page) => (
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
        ))}
      </div>
    </div>
  );
};
