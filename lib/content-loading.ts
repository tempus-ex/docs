import { promises as fs } from 'fs';
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import { hasProperty } from 'hast-util-has-property';
import { headingRank } from 'hast-util-heading-rank';
import { isElement } from 'hast-util-is-element';
import { toString } from 'hast-util-to-string';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkCodeExtra from 'remark-code-extra';
import { MDASTCode } from 'remark-code-extra/types';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import type { Node } from 'unist';

import { lowlight } from 'lowlight/lib/core.js';
import http from 'highlight.js/lib/languages/http';

import linkIcon from '../node_modules/@tabler/icons/icons/link.svg';

import {
    canonicalContentPath,
    Content,
    Frontmatter,
    GraphQL,
    Heading,
    REST,
    TableOfContents,
    TableOfContentsPage,
} from './content';

async function* walk(dir: string): AsyncGenerator<string> {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

interface ParsedHttpCodeBlock {
    method: string;
    url: string;
    headers: Headers;
    body?: string;
}

function parseHttpMarkdownCode(code: string): ParsedHttpCodeBlock {
    const normalized = code.replace(/\r\n/g, '\n');
    const firstLineEnd = normalized.includes('\n') ? normalized.indexOf('\n') : normalized.length;
    const [method, url] = normalized
        .slice(0, firstLineEnd)
        .split(' ')
        .map((s) => s.trim());

    let body = undefined;
    const headers = new Headers();

    const lines = normalized.slice(firstLineEnd + 1).split('\n');
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        if (!line.trim()) {
            body = lines
                .slice(i + 1)
                .join('\n')
                .trim();
            break;
        }
        const [key, value] = line.split(':').map((s) => s.trim());
        headers.append(key, value);
    }

    return {
        method,
        url,
        headers,
        body,
    };
}

let cachedContent: Map<string, Content> | undefined = undefined;

// Returns a map where each key is a path, such as "/" or "/fusion-feed".
export async function getAllContent(): Promise<Map<string, Content>> {
    // This function can be expensive, so memoize it in production.
    if (process.env.NODE_ENV === 'production' && cachedContent) {
        return cachedContent;
    }

    const ret = new Map();
    for await (const p of walk('./content')) {
        if (!p.endsWith('.mdx')) {
            continue;
        }

        const body = await fs.readFile(p, 'utf8');
        let contentPath = p.slice(8, p.length - 4);
        let isIndex = false;
        if (contentPath.endsWith('/index') || contentPath === 'index') {
            contentPath = contentPath.slice(0, contentPath.length - 5);
            isIndex = true;
        }
        contentPath = canonicalContentPath(contentPath);
        const contentPathBase = isIndex ? contentPath : contentPath.slice(0, contentPath.lastIndexOf('/'));

        const graphql: GraphQL[] = [];
        const links = new Set<string>();

        lowlight.registerLanguage('http', http);
        const rest: REST[] = [];

        const markdownLinkPlugin = () => {
            return (tree: Root) => {
                visit(tree, (node) => {
                    if (node.type === 'link') {
                        // make relative content links absolute
                        if (node.url.indexOf('://') < 0 && node.url[0] !== '/' && !node.url.startsWith('mailto:')) {
                            node.url = canonicalContentPath(contentPathBase + '/' + node.url);
                        }
                        links.add(node.url);
                    }
                });
            };
        };

        const headings: Heading[] = [];

        const headingPlugin = () => {
            return (tree: Root) => {
                visit(tree, (node: Node) => {
                    if (isElement(node)) {
                        const rank = headingRank(node);
                        if (rank && node.properties && hasProperty(node, 'id') && typeof node.properties.id === 'string') {
                            headings.push({
                                id: node.properties.id,
                                text: toString(node),
                                rank,
                            });
                        }
                    }
                });
            };
        };

        const source = await serialize(body, {
            mdxOptions: {
                remarkPlugins: [
                    remarkGfm,
                    [
                        remarkCodeExtra,
                        {
                            transform: (node: MDASTCode) => {
                                if (node.lang === 'gql' || node.lang === 'graphql') {
                                    if (node.meta !== 'v1' && node.meta !== 'v2') {
                                        throw new Error('GraphQL code must be marked as V1 or V2.');
                                    }

                                    const version = node.meta;
                                    const document = node.value;

                                    graphql.push({
                                        document,
                                        version,
                                    });

                                    return {
                                        transform: (node: MdxJsxFlowElement) => {
                                            node.type = 'mdxJsxFlowElement';
                                            node.name = `GraphQLExample`;
                                            node.attributes = [{
                                                type: 'mdxJsxAttribute',
                                                name: 'document',
                                                value: document,
                                            }];
                                            node.children = [];
                                        },
                                    };
                                } else if (node.lang === 'http' || node.lang === 'https') {
                                    const { method, url, headers, body } = parseHttpMarkdownCode(node.value);

                                    const [path, params] = url.split('?');
                                    if (path === '/v1/graphql' || path === '/v2/graphql') {
                                        // This is actually a GraphQL request.
                                        const version = path === '/v1/graphql' ? 'v1' : 'v2';
                                        if (method === 'GET') {
                                            graphql.push({
                                                document: new URLSearchParams(params).get('query') || '',
                                                version,
                                            });
                                        } else if (headers.get('Content-Type') === 'application/json') {
                                            graphql.push({
                                                document: JSON.parse(body || '').query || '',
                                                version,
                                            });
                                        } else if (headers.get('Content-Type') === 'application/graphql') {
                                            graphql.push({
                                                document: body || '',
                                                version,
                                            });
                                        } else {
                                            throw new Error('Invalid HTTP request for GraphQL v2.');
                                        }
                                        return null;
                                    }

                                    if (method !== 'GET' && method !== 'POST') {
                                        throw new Error('Only GET and POST requests are supported.');
                                    }

                                    rest.push({
                                        method,
                                        url,
                                        body: body,
                                    });
                                }

                                return null;
                            },
                        },
                    ],
                    markdownLinkPlugin,
                ],
                rehypePlugins: [
                    rehypeHighlight,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, {
                        properties: {
                            className: 'heading-anchor',
                        },
                        content: fromHtmlIsomorphic(`<img src="${linkIcon.src}" />`, {fragment: true}).children
                    }],
                    headingPlugin,
                ],
            },
            parseFrontmatter: true,
        });

        ret.set(contentPath, {
            frontmatter: source.frontmatter as unknown as Frontmatter,
            graphql,
            headings,
            rest,
            links,
            source,
            path: contentPath,
        });
    }

    cachedContent = ret;
    return ret;
}

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
}
