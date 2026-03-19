import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { OpenPanelComponent, IdentifyComponent } from "@openpanel/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getServerAuth } from "@/lib/server-auth";
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
  metadataBase: new URL("https://remotegig.pro"),
  title: {
    default: "RemoteGig | Every Remote Job. One Place.",
    template: "%s | RemoteGig",
  },
  description:
    "We pull remote jobs from across the internet so you don't have to. Only real, verified positions, updated hourly.",
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
    siteName: "RemoteGig",
    title: "RemoteGig | Every Remote Job. One Place.",
    description:
      "We pull remote jobs from across the internet so you don't have to. Only real, verified positions, updated hourly.",
    url: "https://remotegig.pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "RemoteGig | Every Remote Job. One Place.",
    description:
      "We pull remote jobs from across the internet so you don't have to. Only real, verified positions, updated hourly.",
    creator: "@remotegig_",
    site: "@remotegig_",
  },
  alternates: {
    canonical: "https://remotegig.pro",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getServerAuth();

  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(!t){t="light";localStorage.setItem("theme",t)}if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col">
        <OpenPanelComponent
          clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
          apiUrl="/api/op"
          scriptUrl="/api/op/op1.js"
          trackScreenViews={true}
          trackOutgoingLinks={true}
          trackAttributes={true}
        />
        {user && (
          <IdentifyComponent
            profileId={user.id}
            firstName={user.displayName.split(" ")[0]}
            lastName={user.displayName.split(" ").slice(1).join(" ") || ""}
            email={user.email}
            avatar={user.avatarUrl || undefined}
          />
        )}
        <Header user={user} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
