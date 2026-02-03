import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import "./globals.css";

const questrial = Questrial({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "IWKZ Berlin",
  description: "indonesischer Weisheits- & Kulturzentrum e.V.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <body className={questrial.className}>{children}</body>
    </html>
  );
}
