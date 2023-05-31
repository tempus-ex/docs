import Head from "next/head";
import Image from "next/image";

import LogoBlack from "../../public/images/logo-black.svg";
import styles from "./styles.module.scss";
import { LoginFooter } from "./LoginFooter";
import { LoginForm } from "./LoginForm";

export const LoginPage = () => {

  return (
    <>
      <Head>
        <title>Tempus Ex Documentation</title>
      </Head>
      <main className={styles.main}>
        <Image priority className={styles.logo} src={LogoBlack} height="84" width="205" alt="FusionFeed logo"></Image>
        <div className={styles.wrapper}>
          <LoginForm />
        </div>
      </main>
      <LoginFooter />
    </>
  );
};
