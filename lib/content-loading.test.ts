import { parse, validate } from 'graphql';

import { getAllContent } from './content-loading';
import { getGraphQLSchema } from './fusion-feed';

describe('getAllContent', () => {
    it('returns some content', async () => {
        const allContent = await getAllContent();
        expect(Array.from(allContent.keys()).length).toBeGreaterThan(1);
    });

    it('finds some graphql', async () => {
        const allContent = await getAllContent();
        let count = 0;
        for (const content of Array.from(allContent.values())) {
            count += content.graphql.length;
        }
        expect(count).toBeGreaterThan(0);
    });

    it('finds some links', async () => {
        const allContent = await getAllContent();
        let count = 0;
        for (const content of Array.from(allContent.values())) {
            count += content.links.size;
        }
        expect(count).toBeGreaterThan(0);
    });
})

describe('graphql', () => {
    it('validates', async () => {
        const auth = process.env.FUSION_FEED_AUTHORIZATION || '';
        expect(auth, 'To perform validation, FUSION_FEED_AUTHORIZATION must be defined.').toBeTruthy();

        const v1Schema = await getGraphQLSchema('v1', auth);
        const v2Schema = await getGraphQLSchema('v2', auth);

        const allContent = await getAllContent();
        for (const content of Array.from(allContent.values())) {
            for (const graphql of content.graphql) {
                const doc = parse(graphql.document);
                const schema = graphql.version === 'v1' ? v1Schema : v2Schema;
                expect(validate(schema, doc)).toHaveLength(0);
            }
        }
    });
})

describe('links', () => {
    it('validate', async () => {
        const allContent = await getAllContent();
        for (const content of Array.from(allContent.values())) {
            for (const link of Array.from(content.links)) {
                if (link.startsWith('mailto:')) {
                    // mailto
                    continue;
                } else if (link.indexOf('://') > 0 || link.indexOf('//') === 0) {
                    // external url
                    const resp = await fetch(link);
                    expect(resp.status).toBe(200);
                } else {
                    // content url

                    // all links should have been made absolute
                    expect(link[0]).toBe('/');

                    expect(allContent.get(link), `Invalid link in ${content.path}: ${link}`).toBeDefined();
                }
            }
        }
    });
})
