import type { AppProps } from "next/app";
import "@govtechsg/sgds/css/sgds.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
