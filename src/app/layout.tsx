import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://remojob.site"),
  title: {
    default: "RemoJob | Remote Jobs Updated Daily",
    template: "%s | RemoJob",
  },
  description:
    "Browse thousands of remote jobs from real companies. Apply instantly to remote developer, marketing, design, and more positions.",
  keywords: [
    "remote jobs",
    "work from home",
    "remote work",
    "remote developer jobs",
    "remote marketing jobs",
    "fully remote positions",
    "work from anywhere",
    "remote job board",
    "hiring remote",
    "remote careers",
  ],
  openGraph: {
    type: "website",
    siteName: "RemoJob",
    title: "RemoJob | Remote Jobs Updated Daily",
    description:
      "Browse thousands of remote jobs from real companies. Apply instantly.",
    url: "https://remojob.site",
  },
  twitter: {
    card: "summary_large_image",
    title: "RemoJob | Remote Jobs Updated Daily",
    description:
      "Browse thousands of remote jobs from real companies. Apply instantly.",
    creator: "@remojob_",
    site: "@remojob_",
  },
  alternates: {
    canonical: "https://remojob.site",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(!t){t="light";localStorage.setItem("theme",t)}if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
