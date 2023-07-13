import React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { Footer } from '../Footer';
import { Header } from '../Header';
import { Heading, TableOfContents } from '../../lib/content';

import styles from './styles.module.scss';
import { NavBar } from './NavBar';
import { PageNavBar } from './PageNavBar';

const scope = {
    config: getConfig().publicRuntimeConfig,
};

export interface Props {
    path: string;
    source: MDXRemoteSerializeResult;
    tableOfContents: TableOfContents;
    headings: Heading[];
}

export const DefaultPage = (props: Props) => {
    const frontmatter = props.source.frontmatter;
    const toc = props.tableOfContents;

    return (
        <>
            <Head>
                <title>{frontmatter?.title as string}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <NavBar toc={toc} path={props.path} />
                <div className={styles['generated-content']}>
                    <MDXRemote {...props.source} scope={scope} />
                </div>
                <PageNavBar headings={props.headings} />
            </main>
            <Footer />
        </>
    );
};
