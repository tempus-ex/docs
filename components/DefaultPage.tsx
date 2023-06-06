import React from 'react';
import { Container, createStyles, Navbar, Title } from '@mantine/core';
import getConfig from 'next/config';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { Footer } from './Footer';
import { Header } from './Header';

import { TableOfContents } from '../lib/content';

const { publicRuntimeConfig } = getConfig();

export interface Props {
    path: string;
    source: MDXRemoteSerializeResult;
    tableOfContents: TableOfContents;
}

const useStyles = createStyles((theme) => ({
    middle: {
        display: 'flex',
        flexDirection: 'row',
    },
    tocNestedLink: {
        paddingLeft: `${2 * theme.spacing.md}px`,
    },
    tocTwiceNestedLink: {
        paddingLeft: `${3 * theme.spacing.md}px`,
    },
    tocTopLink: {
        paddingLeft: `${theme.spacing.md}px`,
    },
    tocLink: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        display: 'block',
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
    tocLinkCurrent: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        display: 'block',
        fontWeight: 'bold',
    },
    tocTop: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]}`,
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    title: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    },
}));

const scope = {
    config: publicRuntimeConfig,
};

export const DefaultPage = (props: Props) => {
    const { classes } = useStyles();

    const frontmatter = props.source.frontmatter;
    const toc = props.tableOfContents;

    return (
        <>
            <Head>
                <title>{frontmatter?.title as string}</title>
            </Head>
            <Header />
            <div className={classes.middle}>
                <Navbar width={{ sm: 300 }}>
                    <Navbar.Section className={classes.tocTop}>
                        <Link href={toc.path}>
                            <Title className={classes.title}>{toc.title}</Title>
                        </Link>
                    </Navbar.Section>
                    <Navbar.Section>
                        {toc.pages.map((p) => (
                            <React.Fragment key={p.path}>
                                <Link
                                    className={`${p.path === props.path ? classes.tocLinkCurrent : classes.tocLink} ${
                                        classes.tocTopLink
                                    }`}
                                    href={p.path}
                                >
                                    {p.title}
                                </Link>
                                {p.children?.map((p) => (
                                    <>
                                        <Link
                                            className={`${
                                                p.path === props.path ? classes.tocLinkCurrent : classes.tocLink
                                            } ${classes.tocNestedLink}`}
                                            href={p.path}
                                            key={p.path}
                                        >
                                            {p.title}
                                        </Link>
                                        {p.children?.map((p) => (
                                            <Link
                                                className={`${
                                                    p.path === props.path ? classes.tocLinkCurrent : classes.tocLink
                                                } ${classes.tocTwiceNestedLink}`}
                                                href={p.path}
                                                key={p.path}
                                            >
                                                {p.title}
                                            </Link>
                                        ))}
                                    </>
                                ))}
                            </React.Fragment>
                        ))}
                    </Navbar.Section>
                </Navbar>
                <main>
                    <Container>
                        <MDXRemote {...props.source} scope={scope} />
                    </Container>
                </main>
            </div>
            <Footer />
        </>
    );
};
