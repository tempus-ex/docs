import { useState } from "react";
import { Alert } from "@mantine/core";
import Link from "next/link";
import clsx from "clsx";

import { validateFusionFeedToken } from "../../lib/fusion-feed";
import styles from "./styles.module.scss";

export const LoginForm = () => {
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
      <h4 className={styles['form__title']}>Sign In</h4>
      {errorMessage && (
        <Alert className={styles['form__alert']} color="red">
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
          autoComplete="current-password"
          className={clsx({
            [styles["form__key-input"]]: true,
            [styles["form__key-input--error"]]: errorMessage,
          })}
          onChange={(e) => setToken(e.currentTarget.value)}
          placeholder="Enter your API Key"
          value={token}
        />

        <button type="submit" className={styles.button}>
          Sign In
        </button>
      </form>
      <p>
        We&apos;d love to help you get started with our API!
        <Link
          className={styles["form__contact-link"]}
          href={`contact@tempus-ex.com`}
        >
          Contact Us
        </Link>
      </p>
    </>
  );
};
