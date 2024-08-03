// app/layout.js
import { Inter } from "next/font/google";
import Script from 'next/script'
import { GAPageView } from './components/GAPageView'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "aims-post",
  description: "aims-post",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <GAPageView />
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F44KQXWZ47"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F44KQXWZ47', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}