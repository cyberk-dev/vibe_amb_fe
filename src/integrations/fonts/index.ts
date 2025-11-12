import { Audiowide } from "next/font/google";
import localFont from "next/font/local";

const aeonik = localFont({
  src: [
    {
      path: "./assets/aeonik/Aeonik-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./assets/aeonik/Aeonik-ThinItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./assets/aeonik/Aeonik-Air.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./assets/aeonik/Aeonik-AirItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./assets/aeonik/Aeonik-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/aeonik/Aeonik-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./assets/aeonik/Aeonik-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/aeonik/Aeonik-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./assets/aeonik/Aeonik-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/aeonik/Aeonik-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./assets/aeonik/Aeonik-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/aeonik/Aeonik-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./assets/aeonik/Aeonik-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./assets/aeonik/Aeonik-BlackItalic.otf",
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

export const fonts = { audiowide, aeonik };
