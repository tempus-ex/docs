import { Container, createStyles, Navbar, Title } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { Footer } from './Footer';
import { Header } from './Header';

import { TableOfContents } from '../lib/content';

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
    tocLink: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        display: 'block',
        padding: `0 ${theme.spacing.md}px`,
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
        padding: `0 ${theme.spacing.md}px`,
    },
    tocTop: {
        borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
        }`,
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    title: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    },
}));

export const DefaultPage = (props: Props) => {
    const { classes } = useStyles();

    const frontmatter = props.source.frontmatter;
    const toc = props.tableOfContents;

    return (
        <>
            <Head>
                <title>{frontmatter?.title}</title>
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
                            <Link className={p.path === props.path ? classes.tocLinkCurrent : classes.tocLink} href={p.path} key={p.path}>{p.title}</Link>
                        ))}
                    </Navbar.Section>
                </Navbar>
                <main>
                    <Container>
                        <MDXRemote {...props.source} />
                    </Container>
                </main>
            </div>
            <Footer />
        </>
    )
};
