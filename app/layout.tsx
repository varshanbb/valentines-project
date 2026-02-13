import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Your Valentine's Personality — Why You're Still Single (Respectfully)",
  description: "A fun BuzzFeed-style quiz that reveals your Valentine's personality type. Happy Valentine's Day! 💘",
  openGraph: {
    title: "Your Valentine's Personality — Why You're Still Single (Respectfully)",
    description: "Take the quiz and find out your type. Happy Valentine's Day! 💘",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: "Valentine's Personality Quiz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Valentine's Personality — Why You're Still Single (Respectfully)",
    description: "Take the quiz and find out your type. Happy Valentine's Day! 💘",
  },
};
export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Outfit:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
