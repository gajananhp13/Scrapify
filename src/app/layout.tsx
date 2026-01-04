import type { Metadata } from 'next';
import { Inter, Source_Code_Pro, Poppins } from 'next/font/google'; // Standard Next.js font optimization
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AppNavbar } from '@/components/app-navbar'; // Changed from AppSidebar
import { Footer } from '@/components/footer'; // New Footer component
import { cn } from '@/lib/utils';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Still available if needed
});

const fontSourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
});

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Scrapify - Smart Web Scraper',
  description: 'Intelligent web scraping chatbot tool by Scrapify.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        {/* next/font handles optimized font loading. These links can eventually be removed if Poppins covers all needs or Inter/Source Code Pro are also loaded via next/font exclusively. */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased flex flex-col", // Added flex flex-col
          fontPoppins.variable, // Added Poppins
          fontInter.variable,
          fontSourceCodePro.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppNavbar />
          <main className="flex-1 w-full overflow-auto">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
