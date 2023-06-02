import { canonicalContentPath } from './content';

describe('canonicalContentPath', () => {
    it('adds leading slash', async () => {
        expect(canonicalContentPath('foo')).toBe('/foo');
    });

    it('removes trailing slash', async () => {
        expect(canonicalContentPath('/foo/')).toBe('/foo');
    });

    it('removes dots', async () => {
        expect(canonicalContentPath('/foo/./bar')).toBe('/foo/bar');
    });

    it('traverses upward', async () => {
        expect(canonicalContentPath('/foo/../bar')).toBe('/bar');
    });
})
