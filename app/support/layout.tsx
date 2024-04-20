import { GeistSans } from "geist/font/sans";
import Head from "next/head";
import Footer from "@/components/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: `${process.env.NEXT_PUBLIC_SITE_NAME} | Dashboard`,
  description: `Dashboard for ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}