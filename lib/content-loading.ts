import { promises as fs } from 'fs';
import path from 'path';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize'

import { canonicalContentPath, Frontmatter, TableOfContents, TableOfContentsPage } from './content';

async function* walk(dir: string): AsyncGenerator<string> {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

// Returns a map where each key is a path, such as "/" or "/fusion-feed".
export async function getAllContent(): Promise<Map<string, MDXRemoteSerializeResult>> {
    const ret = new Map();
    for await (const p of walk('./content')) {
        if (!p.endsWith('.mdx')) {
            continue;
        }

        const source = await fs.readFile(p, 'utf8');
        let contentPath = p.slice(8, p.length - 4);
        if (contentPath.endsWith('/index') || contentPath === 'index') {
            contentPath = contentPath.slice(0, contentPath.length - 5);
        }
        contentPath = canonicalContentPath(contentPath);
        ret.set(contentPath, await serialize(source, { parseFrontmatter: true }));
    }
    return ret;
};

function tocPagesForSource(allContent: Map<string, MDXRemoteSerializeResult>, source: MDXRemoteSerializeResult, path: string): TableOfContentsPage[] {
    const frontmatter: Frontmatter = source.frontmatter as unknown as Frontmatter;

    return (frontmatter.children || []).map((c) => {
        const childPath = canonicalContentPath(path + '/' + c);
        const source = allContent.get(childPath);
        if (!source) {
            throw new Error(`path for child does not exist: ${childPath}`);
        }

        const frontmatter: Frontmatter = source.frontmatter as unknown as Frontmatter;
        return {
            pages: tocPagesForSource(allContent, source, childPath),
            path: childPath,
            title: frontmatter.title,
        };
    });
}

export async function getProductTableOfContents(path: string): Promise<TableOfContents | null> {
    const allContent = await getAllContent();
    const source = allContent.get(canonicalContentPath(path));
    if (!source) {
        return null;
    }

    const frontmatter: Frontmatter = source.frontmatter as unknown as Frontmatter;

    return {
        title: frontmatter.title,
        pages: tocPagesForSource(allContent, source, path),
        path: canonicalContentPath(path),
    };
};
