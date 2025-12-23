import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/store/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Asana | All your work, all in one place",
  description: "Bring people and AI together to plan, track, and deliver work faster. Manage projects, tasks, and teams in one place.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
