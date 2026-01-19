import { Audiowide, Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

const aeonik = localFont({
  src: [
    {
      path: "./aeonik/Aeonik-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./aeonik/Aeonik-ThinItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./aeonik/Aeonik-Air.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./aeonik/Aeonik-AirItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./aeonik/Aeonik-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./aeonik/Aeonik-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./aeonik/Aeonik-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./aeonik/Aeonik-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./aeonik/Aeonik-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./aeonik/Aeonik-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./aeonik/Aeonik-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./aeonik/Aeonik-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./aeonik/Aeonik-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./aeonik/Aeonik-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-aeonik",
  display: "swap",
  preload: true,
});

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const fonts = { audiowide, aeonik, bricolageGrotesque, spaceGrotesk };
