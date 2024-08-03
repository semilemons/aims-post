// layout.js
import { Inter } from "next/font/google";
import Script from 'next/script'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "aims-post",
  description: "aims-post",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
      <Script
  id="google-analytics"
  src="https://www.googletagmanager.com/gtag/js?id=G-WTK6KTMQ7Z"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WTK6KTMQ7Z');
  `}
</Script>

      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
