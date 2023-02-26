import Head from 'next/head'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'

import {canonicalContentPath} from '../lib/content';
import {getAllContent} from '../lib/content-loading';

export default function Home({ allContent }) {
    const source = allContent['/'];
    const frontmatter = source.frontmatter;

    return (
        <>
            <Head>
                <title>{frontmatter.title ? `${frontmatter.title} - Tempus Ex Docs` : 'Tempus Ex Documentation'}</title>
            </Head>
            <main>
                <ul>
                    {frontmatter.featuredContent.map((c) => {
                        const source = allContent[canonicalContentPath(c.path)];
                        return (
                            <li key={c.path}>
                                {source.frontmatter.title}
                                {c.children && (
                                    <ul>
                                        {c.children.map((c) => {
                                            const source = allContent[canonicalContentPath(c)];
                                            return (<li key={c}>{source.frontmatter.title}</li>);
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <MDXRemote {...source} />
            </main>
        </>
    )
}

export async function getStaticProps() {
    return {
        props: {
            allContent: await getAllContent(),
        },
    };
}
