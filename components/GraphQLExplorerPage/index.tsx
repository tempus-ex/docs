import { useEffect, useState } from 'react';
import { useTheme } from '@graphiql/react';
import { createGraphiQLFetcher, Fetcher } from '@graphiql/toolkit';
import GraphiQL from 'graphiql';
import getConfig from 'next/config';
import cookie from 'js-cookie';
import Head from 'next/head';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

import styles from './styles.module.scss';
import 'node_modules/graphiql/graphiql.css';

import { Footer } from '../Footer';
import { Header } from '../Header';
import { useDocsTheme } from '../Theme';

const { publicRuntimeConfig } = getConfig();

export interface Props {
    source: MDXRemoteSerializeResult;
}

export const GraphQLExplorerPage = ({ source: { frontmatter } }: Props) => {
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const { setTheme } = useTheme();
    const { theme: docsTheme } = useDocsTheme();

    useEffect(() => {
        if (fetcher) {
            setTheme(docsTheme);
        }
    }, [docsTheme, fetcher, setTheme]);

    useEffect(() => {
        const url = publicRuntimeConfig.fusionFeedUrl + '/v2/graphql';
        const token = cookie.get('fftoken');
        setFetcher(() =>
            createGraphiQLFetcher({
                headers: {
                    Authorization: `token ${token}`,
                },
                url,
            }),
        );
    }, []);

    return (
        <>
            <Head>
                <title>{frontmatter?.title}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <div className={styles.wrapper}>{fetcher && <GraphiQL fetcher={fetcher} />}</div>
            </main>
            <Footer />
        </>
    );
};
