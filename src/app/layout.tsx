import type { Metadata } from "next";
import "./globals.css";
import { Web3AppProvider } from "@/providers/web3-app-provider";
import { fonts } from "@/shared/assets/fonts";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Cyberk Nextjs Boilerplate",
  applicationName: "Cyberk Nextjs Boilerplate",
  description: "Web3 frontend framework base on Nextjs for Cyberk member",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon1.png", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/apple-icon.png",
  },
  other: {
    "Horse of the Year": "H.O.T.Y",
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
        <div className="w-full h-screen overflow-hidden">
          <Web3AppProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Web3AppProvider>
        </div>
      </body>
    </html>
  );
}
