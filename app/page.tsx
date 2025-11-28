import { BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-400 p-8 text-center">
      <div className="bg-zinc-900 p-6 rounded-full mb-6 shadow-2xl border border-zinc-800">
        <BookOpen size={64} className="text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold text-zinc-100 mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Welcome to Learning Hub
      </h1>
      <p className="max-w-md text-lg leading-relaxed">
        Select a lesson from the sidebar to start watching videos and reading content.
      </p>
    </div>
  );
}
