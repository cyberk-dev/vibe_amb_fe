import type { Metadata } from "next";
import "./globals.css";
import { Web3AppProvider } from "@/providers/web3-app-provider";
import { fonts } from "@/shared/assets/fonts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { BackgroundMusic } from "@/shared/ui";

export const metadata: Metadata = {
  title: "H.O.T.Y",
  applicationName: "H.O.T.Y",
  description: "Horse of the Year",
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
    description: "Horse of the Year",
    url: "",
    siteName: "H.O.T.Y",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "H.O.T.Y - Horse of the Year",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: "H.O.T.Y",
    card: "summary_large_image",
    images: ["/thumbnail.png"],
    description: "Horse of the Year",
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
