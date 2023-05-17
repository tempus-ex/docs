import type { AppProps } from "next/app";

import "node_modules/highlight.js/styles/github.css";
import '../styles/global.scss';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
