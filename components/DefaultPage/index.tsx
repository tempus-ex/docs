import React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import githubIcon from '../../node_modules/@tabler/icons/icons/brand-github.svg';
import pullRequestIcon from '../../node_modules/@tabler/icons/icons/git-pull-request.svg';

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
    filePath: string;
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
                    <hr className={styles['bottom-divider']} />
                    <div className={styles['open-source-cta']}>
                        <h6>
                            <Image src={githubIcon.src} width={24} height={24} alt={'GitHub'} />
                            <span>This site is open source!</span>
                        </h6>
                        <div className={styles['open-source-cta__content']}>
                            <p>See something that could be improved? Open a pull request on GitHub.</p>
                            <Link className={styles['open-source-cta__button']} href={`https://github.com/tempus-ex/docs/blob/main/${props.filePath}`} target="_blank">
                                <Image src={pullRequestIcon.src} width={16} height={16} alt={'Pull Request'} />
                                Contribute to This Page
                            </Link>
                        </div>
                    </div>
                </div>
                <PageNavBar headings={props.headings} />
            </main>
            <Footer />
        </>
    );
};
