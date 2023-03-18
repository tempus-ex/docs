import { promises as fs } from 'fs';
import path from 'path';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import remarkCodeExtra from 'remark-code-extra';
import { MDASTCode } from 'remark-code-extra/types';

import { canonicalContentPath, Content, Frontmatter, GraphQL, TableOfContents, TableOfContentsPage } from './content';

async function* walk(dir: string): AsyncGenerator<string> {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

// Returns a map where each key is a path, such as "/" or "/fusion-feed".
export async function getAllContent(): Promise<Map<string, Content>> {
    const ret = new Map();
    for await (const p of walk('./content')) {
        if (!p.endsWith('.mdx')) {
            continue;
        }

        const body = await fs.readFile(p, 'utf8');
        let contentPath = p.slice(8, p.length - 4);
        if (contentPath.endsWith('/index') || contentPath === 'index') {
            contentPath = contentPath.slice(0, contentPath.length - 5);
        }
        contentPath = canonicalContentPath(contentPath);

        const graphql: GraphQL[] = [];

        const source = await serialize(body, {
            mdxOptions: {
                remarkPlugins: [
                    [remarkCodeExtra, {
                        transform: (node: MDASTCode) => {
                            if (node.lang !== 'gql' && node.lang !== 'graphql') {
                                return null;
                            }
                            if (node.meta !== 'v1' && node.meta !== 'v2') {
                                throw new Error('GraphQL code must be marked as V1 or V2.');
                            }

                            const version = node.meta;
                            graphql.push({
                                document: node.value,
                                version,
                            });

                            return {
                                after: [{
                                    type: 'text',
                                    // TODO: Add a "run" button? Or example output?
                                    value: `This GraphQL query can be executed against /${version}/graphql`,
                                }],
                            };
                        },
                    }],
                ],
                rehypePlugins: [rehypeHighlight],
            },
            parseFrontmatter: true,
        });

        ret.set(contentPath, {
            frontmatter: source.frontmatter as unknown as Frontmatter,
            graphql,
            source,
            path: contentPath,
        });
    }
    return ret;
};

function tocPagesForContent(allContent: Map<string, Content>, content: Content): TableOfContentsPage[] {
    return (content.frontmatter.children || []).map((c) => {
        const childPath = canonicalContentPath(content.path + '/' + c);
        const childContent = allContent.get(childPath);
        if (!childContent) {
            throw new Error(`path for child does not exist: ${childPath}`);
        }

        return {
            children: tocPagesForContent(allContent, childContent),
            path: childPath,
            title: childContent.frontmatter.title,
        };
    });
}

export async function getProductTableOfContents(path: string): Promise<TableOfContents | null> {
    const allContent = await getAllContent();
    const content = allContent.get(canonicalContentPath(path));
    if (!content) {
        return null;
    }

    return {
        title: content.frontmatter.title,
        pages: tocPagesForContent(allContent, content),
        path: canonicalContentPath(path),
    };
};
