import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Sidebar from "./components/ui/Sidebar";
import "./globals.css";
import Providers from "./provider";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube Scheduler",
  description: "جدول فيديوهاتك على يوتيوب بسهولة",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={geist.variable}>
      <body>
        <Providers>
          <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
            <Sidebar />
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
