import { saveAs } from "file-saver";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import Head from "next/head";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import "../../node_modules/swagger-ui-react/swagger-ui.css";

import { Footer } from "../Footer";
import { Header } from "../Header";

import styles from "./styles.module.scss";

const SwaggerUI = dynamic(import("swagger-ui-react"), { ssr: false });
const { publicRuntimeConfig } = getConfig();

export interface Props {
  source: MDXRemoteSerializeResult;
}

const getToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("fftoken="))
    ?.split("=")[1];

const specUrl = `${publicRuntimeConfig.fusionFeedUrl}/v2/openapi.json`;

export const RESTExplorerPage = (props: Props) => {
  const frontmatter = props.source.frontmatter;

  const SpecDownloadInfoUrl = () => (
    <button
      className={styles["swagger__button"]}
      onClick={() => {
        const token = getToken();
        fetch(specUrl, {
          headers: {
            authorization: `token ${token}`,
          },
        })
          .then((res) => res.blob())
          .then((blob) => {
            saveAs(blob, "openapi.json");
          })
          .catch((err) => console.error(err));
      }}
    >
      Download Spec
    </button>
  );

  const SpecDownloadPlugin = () => {
    return {
      wrapComponents: {
        InfoUrl: () => SpecDownloadInfoUrl,
      },
    };
  };

  return (
    <>
      <Head>
        <title>{frontmatter?.title}</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <SwaggerUI
            onComplete={(sys) => {
              const token = getToken();
              if (token) {
                sys.preauthorizeApiKey("api_key", `token ${token}`);
              }
            }}
            plugins={[SpecDownloadPlugin]}
            requestInterceptor={(req) => {
              const token = getToken();
              if (token && req.url.endsWith("/v2/openapi.json")) {
                req.headers["authorization"] = `token ${token}`;
              }
              return req;
            }}
            url={specUrl}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};
