import { useState } from "react";
import { Alert, PasswordInput } from "@mantine/core";
import Head from "next/head";

import { Footer } from "../Footer";
import { Header } from "../Header";
import { validateFusionFeedToken } from "../../lib/fusion-feed";

import styles from "./styles.module.scss";
import Link from "next/link";

export const LoginPage = () => {
  const [isBusy, setIsBusy] = useState(false);
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const login = () => {
    setIsBusy(true);
    setErrorMessage("");

    validateFusionFeedToken(token)
      .then((ok) => {
        if (ok) {
          document.cookie = "fftoken=" + token;
          const destination = new URLSearchParams(
            window.location.hash.slice(1)
          ).get("destination");
          window.location.href = destination || "/";
        } else {
          setErrorMessage("Invalid token.");
          setIsBusy(false);
        }
      })
      .catch((e) => {
        setErrorMessage("An unexpected error occurred: " + e.message);
        setIsBusy(false);
      });
  };

  return (
    <>
      <Head>
        <title>Tempus Ex Documentation</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <h4 className={styles.title}>Sign In</h4>
          {errorMessage && (
            <Alert className={styles.alert} color="red">
              {errorMessage}
            </Alert>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className={styles.form}
          >
            <input
            type="password"
              disabled={isBusy}
              className={styles['key-input']}
              onChange={(e) => setToken(e.currentTarget.value)}
              placeholder="Enter your API Key"
              value={token}
            />

            <button type="submit" className={styles.button}>
              Sign In
            </button>
          </form>
          <p className={styles["contact"]}>
            We&apos;d love to help you get started with our API!
            <Link
              className={styles["contact__link"]}
              href={`contact@tempus-ex.com`}
            >
              Contact Us
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};
