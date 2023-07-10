import React from 'react';
import Link from 'next/link';
import { Heading } from '@/lib/content';
import styles from './styles.module.scss';

export type Props = {
    headings: Heading[];
};

export const PageNavBar = ({ headings }: Props) => {
    return (
        <div className={styles['pagenavbar']}>
            <div className={styles['pagenavbar__content']}>
                <h4>On This Page</h4>
                {headings.map((h, i) => (
                    <div className={styles[`pagenavbar--rank-${h.rank}`]} key={i}>
                        <Link href={`#${h.id}`}>{h.text}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
