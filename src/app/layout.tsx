import type { Metadata } from "next";
import "./globals.css";
import { Web3AppProvider } from "@/providers/web3-app-provider";
import { fonts } from "@/shared/assets/fonts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { BackgroundMusic } from "@/shared/ui";

export const metadata: Metadata = {
  title: "H.O.T.Y",
  applicationName: "H.O.T.Y",
  description: "Web3 frontend for H.O.T.Y",
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
    title: "H.O.T.Y",
    description: "Web3 frontend for H.O.T.Y",
    url: "",
    siteName: "H.O.T.Y",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/thumbnail.png`],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: "H.O.T.Y",
    card: "summary_large_image",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/thumbnail.png`],
    description: "Web3 frontend for H.O.T.Y",
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
        <div className="w-full min-h-screen overflow-hidden">
          <Web3AppProvider>
            <NuqsAdapter>
              <BackgroundMusic />
              {children}
            </NuqsAdapter>
          </Web3AppProvider>
        </div>
      </body>
    </html>
  );
}
