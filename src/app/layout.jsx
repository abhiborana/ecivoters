import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "ECI 2003 Voters finder - Ratlam (City)",
  description:
    "Find the details of voters in Ratlam (City) assembly constituency for 2003 voters list.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased flex w-screen h-dvh flex-col overflow-x-hidden",
          geist.className
        )}
      >
        <Navbar />
        <main className="flex-1 p-2 md:p-4">{children}</main>
        <Analytics />
        <Toaster theme="light" richColors />
      </body>
    </html>
  );
}
