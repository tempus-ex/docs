# Docs

This is the repo for [docs.tempus-ex.com](https://docs.tempus-ex.com).

## Directory Structure

- [components](./components) - These are the React components used to render pages.
- [content](./content) - These are the [MDX](https://mdxjs.com) files for the prose content of the docs.
- [lib](./lib) - Logic for generating and running the site lives here.
- [pages](./pages) - The files here are the entry points for rendering pages. They load the data required for each page and render the appropriate React components.
- [public](./public) - Static assets such as images live here.

## Running

To run the development server...

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The site will auto-reload as you make changes to the repo.

## Writing Docs

For most pages, all that's needed is to add an MDX file to the content directory. Each MDX file should have at least a title in the frontmatter and should be added as a child to another page's frontmatter.

### GraphQL Examples

To include a GraphQL example in the documentation, you can use a standard Markdown code block, but you must include a FusionFeed version in the metadata like so:

````markdown
```gql v2
query Foo($id: Id!) {
    node(id: $id) {
        __typename
    }
}
```
````

This will allow the example to be automatically validated by tests and gain additional UI functionality.

### REST Examples

To include a REST example in the documentation, you can use a standard Markdown code block like so:

````markdown
```http
GET /v2/games?filter.league.code=NFL
```
````

This will allow the example to be automatically validated by tests and gain additional UI functionality.

## Testing

To run the tests, use `npm run test`.

Some tests require interaction with FusionFeed and will fail unless you define the `FUSION_FEED_AUTHORIZATION` environment variable with the value of the Authorization header to be used:

```bash
FUSION_FEED_AUTHORIZATION="token $MY_FUSION_FEED_TOKEN" npm run test
```
