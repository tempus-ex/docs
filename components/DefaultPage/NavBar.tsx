import React from 'react';
import Link from 'next/link';
import { TableOfContents, TableOfContentsPage } from '@/lib/content';
import clsx from 'clsx';
import styles from './styles.module.scss';

export type Props = {
    toc: TableOfContents;
    path: string;
};

type SectionProps = {
    page: TableOfContentsPage;
    path: string;
};

type PageProps = {
    page: TableOfContentsPage;
    path: string;
    level: number;
};

const NavbarPage = ({ page, path, level }: PageProps) => {
    const checkRecursiveActive = (acc: boolean, child: TableOfContentsPage): boolean => {
        if (acc) {
            return true;
        } else if (child.path === path) {
            return true;
        } else if (child.children && child.children.length > 0) {
            return child.children.reduce(checkRecursiveActive, false);
        }
        return acc;
    };

    const hasChildren = (page.children?.length || 0) > 0;
    const pageIsActive = page.path === path;
    const childIsActive = page.children && page.children.reduce(checkRecursiveActive, false);

    return (
        <div className={styles['navbar__page']}>
            <Link
                className={clsx({
                    [styles['navbar__link']]: true,
                    [styles['navbar__link--active']]: pageIsActive,
                    [styles['navbar__link--has-children']]: hasChildren,
                    [styles['navbar__link--active-children']]: hasChildren && (pageIsActive || childIsActive),
                    [styles['navbar__link--level-0']]: level === 0,
                    [styles['navbar__link--level-1']]: level === 1,
                    [styles['navbar__link--level-2']]: level === 2,
                })}
                href={page.path}
                title={page.title}
            >
                {page.title}
            </Link>
            {(pageIsActive || childIsActive) &&
                page.children?.map((child) => (
                    <NavbarPage key={child.path} page={child} path={path} level={level + 1} />
                ))}
        </div>
    );
};

export const NavBar = ({ toc, path }: Props) => {
    return (
        <div className={styles['navbar']}>
            <div className={styles['navbar__top']}>
                <Link href={toc.path}>
                    <h4 className={styles['navbar__title']}>{toc.title}</h4>
                </Link>
            </div>
            <div className={styles['navbar__pages']}>
                {toc.pages.map((page) => (
                    <NavbarPage key={page.path} page={page} path={path} level={0} />
                ))}
            </div>
        </div>
    );
};
