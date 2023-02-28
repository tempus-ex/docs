// The frontmatter that all files are expected to have.
//
// Some files may have more as defined by their page implementations.
export interface Frontmatter {
    title: string;
}

export function canonicalContentPath(p: string): string {
    if (!p.startsWith('/')) {
        p = '/' + p;
    }
    if (p.length > 1 && p.endsWith('/')) {
        p = p.slice(0, p.length - 1);
    }
    return p;
}
