import { promises as fs } from 'fs';
import path from 'path';
import { serialize, MDXRemoteSerializeResult } from 'next-mdx-remote/serialize'

import { canonicalContentPath} from './content';

async function* walk(dir) {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

// Returns a map where each key is a path, such as "/" or "/fusion-feed".
export async function getAllContent(): Map<string, MDXRemoteSerializeResult> {
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
