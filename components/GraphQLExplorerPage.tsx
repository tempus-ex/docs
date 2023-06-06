import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@graphiql/react';
import { createGraphiQLFetcher, Fetcher } from '@graphiql/toolkit';
import { createStyles } from '@mantine/core';
import GraphiQL from 'graphiql';
import getConfig from 'next/config';
import Head from 'next/head';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

import '../node_modules/graphiql/graphiql.css';

import { Footer } from './Footer';
import { Header } from './Header';

const { publicRuntimeConfig } = getConfig();

const useStyles = createStyles((theme) => ({
    main: {
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
        height: 'calc(100vh - 64px)',
    },
}));

export interface Props {
    source: MDXRemoteSerializeResult;
}

const ThemeSetter = () => {
    const { theme, setTheme } = useTheme();
    const checkTheme = useCallback(() => {
        if (theme !== 'light') {
            setTheme('light');
        }
    }, [theme, setTheme]);
    useEffect(() => {
        checkTheme();
    }, [checkTheme]);
    return null;
};

export const GraphQLExplorerPage = (props: Props) => {
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const { classes } = useStyles();

    const frontmatter = props.source.frontmatter;

    useEffect(() => {
        const url = publicRuntimeConfig.fusionFeedUrl + '/v2/graphql';
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('fftoken='))
            ?.split('=')[1];
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
                <title>{frontmatter?.title as string}</title>
            </Head>
            <Header />
            <main className={classes.main}>
                {fetcher && (
                    <>
                        <ThemeSetter />
                        <GraphiQL fetcher={fetcher} />
                    </>
                )}
            </main>
            <Footer />
        </>
    );
};
