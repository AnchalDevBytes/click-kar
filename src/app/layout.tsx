import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Click-kar",
  description: "Developed by Anchal Raj",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
          {children}
      </body>
    </html>
  );
}