import { Inter, Playfair_Display } from "next/font/google";

// latin-ext covers Yoruba and Igbo letters like ẹ, ọ, ṣ, ị, ụ, ṅ
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});
