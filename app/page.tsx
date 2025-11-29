import { BookOpen, Play, FileText, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
      {/* Hero Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-700/50">
          <BookOpen size={72} className="text-blue-400" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Welcome to Learning Hub
      </h1>

      {/* Description */}
      <p className="max-w-lg text-lg leading-relaxed text-slate-400 mb-12">
        Your personal learning platform for videos and course materials.
        Select a lesson from the sidebar to start your journey.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <FeatureCard
          icon={<Play className="text-blue-400" size={28} />}
          title="Video Lessons"
          description="Watch high-quality video content with a modern player"
        />
        <FeatureCard
          icon={<FileText className="text-purple-400" size={28} />}
          title="Rich Content"
          description="Read beautifully formatted Markdown notes and documentation"
        />
        <FeatureCard
          icon={<Sparkles className="text-cyan-400" size={28} />}
          title="Modern Design"
          description="Enjoy a clean, distraction-free learning experience"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/80 hover:border-slate-600/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      <div className="bg-slate-700/50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
