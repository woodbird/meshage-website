import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meshage — Next Gen IM with A2A&A2UI",
  description:
    "Next Gen IM with A2A&A2UI. Native agent-to-agent and agent-to-UI. Rich, secure interfaces—beyond chat.",
  openGraph: {
    title: "Meshage — Next Gen IM with A2A&A2UI",
    description:
      "Next Gen IM with A2A&A2UI. Native agent-to-agent and agent-to-UI. Rich, secure interfaces—beyond chat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
