import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getDirectoryTree } from "@/lib/content";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Personal Learning Content Visualizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = getDirectoryTree();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-zinc-100 flex h-screen overflow-hidden`}>
        <Sidebar tree={tree} />
        <main className="flex-1 overflow-y-auto h-full relative">
          {children}
        </main>
      </body>
    </html>
  );
}
