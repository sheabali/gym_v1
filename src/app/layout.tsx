import NextAuthSessionProvider from "@/lib/NextAuthSessionProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { BUSINESS_INFO } from "@/data/gymData";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BUSINESS_INFO.name} | Premium Fitness & Strength Center`,
  description: `Modern, fully air-conditioned fitness center in ${BUSINESS_INFO.area}. Certified trainers, separate male and female shifts, world-class equipment.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('platinum_gym_theme');
                  var theme = saved === 'light' ? 'light' : 'dark';
                  var root = document.documentElement;
                  if (theme === 'light') {
                    root.classList.remove('dark');
                    root.classList.add('light');
                    root.setAttribute('data-theme', 'light');
                    root.style.colorScheme = 'light';
                  } else {
                    root.classList.add('dark');
                    root.classList.remove('light');
                    root.setAttribute('data-theme', 'dark');
                    root.style.colorScheme = 'dark';
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#09090b] text-[#f4f4f5] selection:bg-[#22c55e] selection:text-black">
        <ThemeProvider>
          <Toaster position="top-center" richColors />
          <NextAuthSessionProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
