import React from "react";
import { Container } from "@mantine/core";
import Head from "next/head";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { Footer } from "../Footer";
import { Header } from "../Header";
import { TableOfContents } from "../../lib/content";

import styles from "./styles.module.scss";
import { NavBar } from "./Navbar";

export interface Props {
  path: string;
  source: MDXRemoteSerializeResult;
  tableOfContents: TableOfContents;
}

export const DefaultPage = (props: Props) => {
  const frontmatter = props.source.frontmatter;
  const toc = props.tableOfContents;

  return (
    <>
      <Head>
        <title>{frontmatter?.title}</title>
      </Head>
      <Header />
      <main className={styles.main}>
          <NavBar toc={toc} path={props.path} />
          <Container>
            <MDXRemote {...props.source} />
          </Container>
      </main>
      <Footer />
    </>
  );
};
