import {
  Dancing_Script,
  Montserrat,
  Nunito_Sans,
  Poppins,
  Lobster,
  Sen,
  Roboto,
} from "next/font/google";

import localFont from "next/font/local";
export const samarkan = localFont({
  src: "../assets/fonts/Samarkan/SAMARKAN.ttf",
  variable: "--font-samarkan",
});
export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
});

export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
});
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
export const lobster = Lobster({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-lobster",
});
export const poppins = Poppins({
  weight: ["300", "400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
export const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
export const sen = Sen({
  weight: ["400", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-sen",
});

export const fontVariables = [
  samarkan.variable,
  dancingScript.variable,
  nunitoSans.variable,
  montserrat.variable,
  lobster.variable,
  poppins.variable,
  sen.variable,
  roboto.variable,
];
