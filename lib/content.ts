import { MDXRemoteSerializeResult } from "next-mdx-remote";

// The frontmatter that all files are expected to have.
//
// Some files may have more as defined by their page implementations.
export interface Frontmatter {
  title: string;
  children?: string[];
}

export interface GraphQL {
  document: string;
  version: "v1" | "v2";
}

export interface Content {
  frontmatter: Frontmatter;
  source: MDXRemoteSerializeResult;
  path: string;
  graphql: GraphQL[];
  links: Set<string>;
}

export function canonicalContentPath(p: string): string {
  if (!p.startsWith("/")) {
    p = "/" + p;
  }
  if (p.length > 1 && p.endsWith("/")) {
    p = p.slice(0, p.length - 1);
  }
  return p;
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
