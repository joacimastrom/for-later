import { Footer } from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Providers from "@/components/Providers";

import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For Later",
  description: "Save something for later cross devices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={`antialiased m-0 min-h-screen bg-slate-100 flex flex-col`}
        >
          <Navbar />
          <div className="h-full flex flex-col flex-1 p-5 pt-[5vh] sm:pt-[10vh]">
            {children}
          </div>
          <Footer />
          <Toaster />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-60"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-10rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </body>
      </Providers>
    </html>
  );
}
