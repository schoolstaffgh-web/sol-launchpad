import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import type { Metadata } from "next";
import { Montserrat, Rubik } from "next/font/google";
import Provider from "@providers/Provider";
import Header from "@components/Header";
import Loader from "@components/Loader";

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

export const metadata: Metadata = {
  title: "Solana | Launchpad",
  description:
    "A Solana Launchpad to showcase Projects and launch tokens & mint NFT's.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Standard favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/Logo.png" />
        {/* Retina and higher-res screens */}
        <link rel="icon" type="image/png" sizes="64x64" href="/Logo.png" />
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/Logo.png" />
      </head>
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
