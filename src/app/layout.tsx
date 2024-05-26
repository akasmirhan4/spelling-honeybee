import "~/styles/globals.css";

import { Inter } from "next/font/google";
import GameProvider from "./_components/GameProvider";
import { Toaster } from "react-hot-toast";
import { CSPostHogProvider } from "./_analytics/provider";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "~/components/ui/tooltip";

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
    <ClerkProvider>
      <CSPostHogProvider>
        <TooltipProvider>
          <html lang="en">
            <body className={`font-sans ${inter.variable}`}>
              <GameProvider>{children}</GameProvider>
              <Toaster />
            </body>
          </html>
        </TooltipProvider>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
