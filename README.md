# Docs

This is the repo for [docs.tempus-ex.com](https://docs.tempus-ex.com).

## Directory Structure

- [components](./components) - These are the React components used to render pages.
- [content](./content) - These are the [MDX](https://mdxjs.com) files for the prose content of the docs.
- [lib](./lib) - Logic for generating and running the site lives here.
- [pages](./pages) - The files here are the entry points for rendering pages. They load the data required for each page and render the appropriate React components.
- [public](./public) - Static assets such as images live here.

## Running

To run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The site will auto-reload as you make changes to the repo.
