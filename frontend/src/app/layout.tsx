import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "regenerator-runtime/runtime";
import { Providers } from "./StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Revolutionising the healthcare",
  description: "Revolutionising the healthcare",
  icons: {
    icon: "/evva.png", // Add custom logo icon to the website.
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>{children} </Providers>
      </body>
    </html>
  );
}
