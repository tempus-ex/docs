import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// The frontmatter that all files are expected to have.
//
// Some files may have more as defined by their page implementations.
export interface Frontmatter {
    title: string;
    children?: string[];
}

export interface GraphQL {
    document: string;
    version: 'v1' | 'v2';
}

export interface REST {
    method: 'GET' | 'POST';
    url: string;
    body?: string;
}

export interface Heading {
    id: string;
    text: string;
    rank: number;
}

export interface Content {
    frontmatter: Frontmatter;
    source: MDXRemoteSerializeResult;
    path: string;
    filePath: string;
    graphql: GraphQL[];
    rest: REST[];
    headings: Heading[];
    links: Set<string>;
}

export function canonicalContentPath(p: string): string {
    const parts = p.split('/');
    if (parts.length === 0 || parts[0] !== '') {
        parts.unshift('');
    }
    for (let i = 1; i < parts.length; i++) {
        if (parts[i] === '.') {
            parts.splice(i, 1);
            i--;
        } else if (parts[i] === '..') {
            parts.splice(i - 1, 2);
            i -= 2;
        }
    }
    if (parts.length > 0 && parts[parts.length - 1] === '') {
        parts.pop();
    }
    if (parts.length < 2) {
        return '/';
    }
    return parts.join('/');
}

export interface TableOfContentsPage {
    path: string;
    title: string;
    children?: TableOfContentsPage[];
}

export interface TableOfContents {
    pages: TableOfContentsPage[];
    path: string;
    title: string;
}
