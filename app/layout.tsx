import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { getDirectoryTree } from "@/lib/content";
import Sidebar from "@/components/Sidebar";
import { WatchedProvider } from "@/components/WatchedProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains',
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: "Learning Hub // Terminal",
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} font-sans flex h-screen overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, var(--cyber-void) 0%, var(--cyber-deep) 50%, var(--cyber-void) 100%)',
          color: 'var(--cyber-text)'
        }}
      >
        <WatchedProvider>
          {/* Subtle grid overlay */}
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(var(--cyber-cyan) 1px, transparent 1px),
                linear-gradient(90deg, var(--cyber-cyan) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          <Sidebar tree={tree} />
          <main className="flex-1 overflow-y-auto h-full relative">
            {children}
          </main>
        </WatchedProvider>
      </body>
    </html>
  );
}
