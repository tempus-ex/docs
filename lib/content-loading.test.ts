import { parse, validate } from 'graphql';
import getConfig from 'next/config';
import { getAllContent } from './content-loading';
import { getGraphQLSchema, getRESTSchema } from './fusionfeed';

const { publicRuntimeConfig } = getConfig();

describe("getAllContent", () => {
  it("returns some content", async () => {
    const allContent = await getAllContent();
    expect(Array.from(allContent.keys()).length).toBeGreaterThan(1);
  });

  it("finds some graphql", async () => {
    const allContent = await getAllContent();
    let count = 0;
    for (const content of Array.from(allContent.values())) {
      count += content.graphql.length;
    }
    expect(count).toBeGreaterThan(0);
  });

  it("finds some links", async () => {
    const allContent = await getAllContent();
    let count = 0;
    for (const content of Array.from(allContent.values())) {
      count += content.links.size;
    }
    expect(count).toBeGreaterThan(0);
  });
});

describe("graphql", () => {
  it("validates", async () => {
    const auth = process.env.FUSION_FEED_AUTHORIZATION || "";
    expect(
      auth,
      "To perform validation, FUSION_FEED_AUTHORIZATION must be defined."
    ).toBeTruthy();

    const v1Schema = await getGraphQLSchema("v1", auth);
    const v2Schema = await getGraphQLSchema("v2", auth);

    const allContent = await getAllContent();
    for (const content of Array.from(allContent.values())) {
      for (const graphql of content.graphql) {
        const doc = parse(graphql.document);
        const schema = graphql.version === "v1" ? v1Schema : v2Schema;
        expect(validate(schema, doc)).toHaveLength(0);
      }
    }
  });
});

describe("links", () => {
  it("validate", async () => {
    const allContent = await getAllContent();
    for (const content of Array.from(allContent.values())) {
      for (const link of Array.from(content.links)) {
        if (link.startsWith("mailto:")) {
          // mailto
          continue;
        } else if (link.indexOf("://") > 0 || link.indexOf("//") === 0) {
          // external url
          const resp = await fetch(link);
          expect(resp.status).toBe(200);
        } else {
          // content url

          // all links should have been made absolute
          expect(link[0]).toBe("/");

          expect(
            allContent.get(link),
            `Invalid link in ${content.path}: ${link}`
          ).toBeDefined();
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

describe('rest', () => {
    it('validates', async () => {
        const auth = process.env.FUSION_FEED_AUTHORIZATION || '';
        expect(auth, 'To perform validation, FUSION_FEED_AUTHORIZATION must be defined.').toBeTruthy();

        const v1 = await getRESTSchema('v1', auth);
        const v2 = await getRESTSchema('v2', auth);

        const allContent = await getAllContent();
        for (const content of Array.from(allContent.values())) {
            for (const rest of content.rest) {
                const reqURL = new URL(publicRuntimeConfig.fusionFeedUrl + rest.url);
                const parts = reqURL.pathname.split('/');
                const version = parts[1];
                const path = decodeURI('/' + parts.slice(2).join('/'));

                expect(version, `Invalid version in REST request "${rest.url}"`).toMatch(/v[12]/);

                let schema = v2;
                if (version === 'v1') {
                    schema = v1;
                }

                let found = false;
                for (const [def, pathSchema] of Object.entries(version === 'v1' ? schema.paths : schema.paths)) {
                    if (path === def) {
                        found = true;

                        let schema = pathSchema.get;
                        if (rest.method === 'POST') {
                            schema = pathSchema.post;
                        }

                        // check to see that request contains all required parameters
                        for (const param of schema.parameters) {
                            if (param.in === 'query' && param.required && !reqURL.searchParams.has(param.name)) {
                                throw new Error(`Missing required parameter ${param.name} in REST request "${rest.url}"`);
                            }
                        }

                        // check to see that request contains no unknown parameters
                        for (const param of Array.from(reqURL.searchParams)) {
                            if (!schema.parameters.find(p => p.name === param[0])) {
                                throw new Error(`Unknown parameter ${param[0]} in REST request "${rest.url}"`);
                            }
                        }

                        // check that the body is valid JSON
                        if (rest.body) {
                            try {
                                let json = JSON.parse(rest.body);
                            } catch (e) {
                                throw new Error(`Invalid JSON body in REST request "${rest.url}": ${e}`);
                            }
                        }

                        break;
                    }
                }
                expect(found, `Invalid path in REST request "${rest.url}"`).toBeTruthy();
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
