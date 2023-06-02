import React from "react";
import clsx from "clsx";
import { Container, Navbar, Title } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { Footer } from "../Footer";
import { Header } from "../Header";
import { TableOfContents } from "../../lib/content";

import styles from "./styles.module.scss";

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
        <Navbar width={{ sm: 300 }}>
          <Navbar.Section className={styles["toc-top"]}>
            <Link href={toc.path}>
              <Title className={styles["title"]}>{toc.title}</Title>
            </Link>
          </Navbar.Section>
          <Navbar.Section>
            {toc.pages.map((p) => (
              <React.Fragment key={p.path}>
                <Link
                  className={clsx({
                    [styles["toc-link"]]: true,
                    [styles["toc-link__current"]]: p.path === props.path,
                    [styles["toc-link__top"]]: true,
                  })}
                  href={p.path}
                >
                  {p.title}
                </Link>
                {p.children?.map((p) => (
                  <Link
                    className={clsx({
                      [styles["toc-link"]]: true,
                      [styles["toc-link__current"]]: p.path === props.path,
                      [styles["toc-link__nested"]]: true,
                    })}
                    href={p.path}
                    key={p.path}
                  >
                    {p.title}
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </Navbar.Section>
        </Navbar>
        <main>
          <Container>
            <MDXRemote {...props.source} />
          </Container>
        </main>
      </main>
      <Footer />
    </>
  );
};
