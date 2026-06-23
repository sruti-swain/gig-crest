import type { Metadata } from "next";
// CORRECT - goes up one level to app/ folder


export const metadata: Metadata = {
  title: "GigCrest",
  description: "Weather-based insurance for gig workers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}