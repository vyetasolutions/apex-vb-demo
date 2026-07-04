import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "APEX | Varun Beverages Engagement Platform",
  description: "A gamified loyalty and engagement demo for Pepsi, Mirinda, 7UP, Mountain Dew, Sting and Aquafina."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-apex-void bg-apex-radial bg-fixed">
        <Navbar />
        <main className="mx-auto max-w-md md:max-w-2xl px-4 pb-24 pt-6">{children}</main>
      </body>
    </html>
  );
}
