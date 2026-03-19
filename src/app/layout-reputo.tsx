import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { OpenPanelComponent } from "@openpanel/nextjs";
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
  metadataBase: new URL("https://reputo.co"),
  title: {
    default: "Reputo | Brand Deals for UGC Creators",
    template: "%s | Reputo",
  },
  description:
    "Browse paid brand deals from real companies. Apply instantly as a UGC creator, ambassador, or influencer.",
  keywords: [
    "UGC brand deals",
    "AI brand outreach",
    "how to get brand deals",
    "influencer outreach tool",
    "UGC creator platform",
    "automated brand pitching",
    "content creator outreach",
    "brand partnerships",
    "creator economy",
    "paid collaborations",
    "AI agent for creators",
    "land brand deals",
  ],
  openGraph: {
    type: "website",
    siteName: "Reputo",
    title: "Reputo | Brand Deals for UGC Creators",
    description:
      "Browse paid brand deals from real companies. Apply instantly as a UGC creator, ambassador, or influencer.",
    url: "https://reputo.co",
    images: [
      {
        url: "https://reputo.co/socialpreviewreputo.png",
        width: 1200,
        height: 630,
        alt: "Reputo | Brand Deals for UGC Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reputo | Brand Deals for UGC Creators",
    description:
      "Browse paid brand deals from real companies. Apply instantly as a UGC creator, ambassador, or influencer.",
    images: ["https://reputo.co/socialpreviewreputo.png"],
    creator: "@reputo_co",
    site: "@reputo_co",
  },
  alternates: {
    canonical: "https://reputo.co",
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
        <link rel="preconnect" href="https://cdn.reputo.co" />
        <link rel="dns-prefetch" href="https://cdn.reputo.co" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!crypto.randomUUID){crypto.randomUUID=function(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,function(c){return(c^(crypto.getRandomValues(new Uint8Array(1))[0]&(15>>c/4))).toString(16)})}};}catch(e){}try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";localStorage.setItem("theme",t)}if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        <OpenPanelComponent
          apiUrl="/api/op"
          scriptUrl="/api/op/op1.js"
          clientId="77fa07ac-d661-41e2-b3a8-e2e11b89bdcd"
          trackScreenViews={true}
          trackAttributes={true}
          trackOutgoingLinks={true}
        />
        {children}
      </body>
    </html>
  );
}
