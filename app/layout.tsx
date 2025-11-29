import type { Metadata } from "next";
import "./globals.css";
import { getDirectoryTree } from "@/lib/content";
import Sidebar from "@/components/Sidebar";

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
      <body className="font-sans bg-slate-950 text-slate-100 flex h-screen overflow-hidden antialiased">
        <Sidebar tree={tree} />
        <main className="flex-1 overflow-y-auto h-full relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {children}
        </main>
      </body>
    </html>
  );
}
