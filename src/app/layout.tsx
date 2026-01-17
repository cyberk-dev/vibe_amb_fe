import type { Metadata } from "next";
import "./globals.css";
import { Web3AppProvider } from "@/providers/web3-app-provider";
import { fonts } from "@/shared/assets/fonts";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Cyberk Nextjs Boilerplate",
  applicationName: "Cyberk Nextjs Boilerplate",
  description: "Web3 frontend framework base on Nextjs for Cyberk member",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Cyberk Nextjs Boilerplate",
    description: "Web3 frontend framework base on Nextjs for Cyberk member",
    url: "",
    siteName: "Cyberk Nextjs Boilerplate",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/thumbnail.png`],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: "Cyberk Nextjs Boilerplate",
    card: "summary_large_image",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/thumbnail.png`],
    description: "Web3 frontend framework base on Nextjs for Cyberk member",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fonts.audiowide.variable} ${fonts.aeonik.variable} ${fonts.bricolageGrotesque.variable} ${fonts.spaceGrotesk.variable} antialiased`}
      >
        <div className="mx-auto max-w-[1440px] max-h-[800px] h-screen overflow-hidden">
          <Web3AppProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Web3AppProvider>
        </div>
      </body>
    </html>
  );
}
