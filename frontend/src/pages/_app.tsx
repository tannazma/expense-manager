import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Toaster />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
