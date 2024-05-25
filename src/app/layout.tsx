import "~/styles/globals.css";

import { Inter } from "next/font/google";
import GameProvider from "./_components/GameProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Spelling HoneyBee",
  description: "Created by akasmirhan4",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Analytics />
        <GameProvider>{children}</GameProvider>
        <Toaster />
      </body>
    </html>
  );
}
