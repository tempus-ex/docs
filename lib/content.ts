export function canonicalContentPath(p: string): string {
    if (!p.startsWith('/')) {
        p = '/' + p;
    }
    if (p.length > 1 && p.endsWith('/')) {
        p = p.slice(0, p.length - 1);
    }
    return p;
}
