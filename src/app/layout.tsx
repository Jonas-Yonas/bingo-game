import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";
import AuthProvider from "./providers/AuthProvider";
// import { Toaster } from "sonner";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { Toaster } from "./components/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Bingo Blast",
    template: "%s | Bingo Blast",
  },
  description: "Real-time multiplayer bingo game",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans dark:bg-[#020817] dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="myapp-theme" // Unique key for the app
        >
          <AuthProvider>
            <ReactQueryProvider>
              {children}
              {/* <Toaster position="top-right" richColors /> */}
              <Toaster />
            </ReactQueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
