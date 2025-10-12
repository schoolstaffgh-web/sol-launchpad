import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Montserrat, Rubik } from "next/font/google";
import Provider from "@providers/Provider";
import Header from "@components/Header";
import Loader from "@components/Loader";
import Head from "next/head";

export const montserrat = Montserrat({
  weight: "700",
  subsets: ["latin"],
  variable: "--Montserrat",
});

export const rubik = Rubik({
  weight: "400",
  subsets: ["latin"],
  variable: "--Rubik",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* Force favicon */}
        <link rel="icon" href="/Logo.png" />
        <link rel="shortcut icon" href="/Logo.png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
      </Head>
      <body
        className={`${montserrat.variable} ${rubik.variable} font-rubik relative`}
      >
        <Provider
          attribute="data-theme"
          storageKey="sol-launchpad-theme"
          defaultTheme="dark"
        >
          <Header />
          {children}
          <Loader />
        </Provider>
      </body>
    </html>
  );
}
