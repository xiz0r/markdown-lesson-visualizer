'use client';

import { Terminal, ChevronRight, Cpu, Zap, Code2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center relative">
      {/* Decorative corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 opacity-30" style={{ borderColor: 'var(--cyber-cyan)' }} />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 opacity-30" style={{ borderColor: 'var(--cyber-cyan)' }} />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 opacity-30" style={{ borderColor: 'var(--cyber-cyan)' }} />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 opacity-30" style={{ borderColor: 'var(--cyber-cyan)' }} />

      {/* Main icon container */}
      <div
        className="relative p-8 rounded-2xl mb-8 animate-fade-in"
        style={{
          background: 'linear-gradient(135deg, var(--cyber-dark) 0%, var(--cyber-deep) 100%)',
          border: '1px solid var(--cyber-border)',
          boxShadow: '0 0 60px rgba(0, 240, 255, 0.1), inset 0 0 30px rgba(0, 240, 255, 0.03)'
        }}
      >
        {/* Glowing ring effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-50 pulse-glow"
          style={{
            border: '1px solid var(--cyber-cyan)',
            boxShadow: 'var(--glow-md)'
          }}
        />

        <Terminal
          size={72}
          strokeWidth={1.5}
          style={{ color: 'var(--cyber-cyan)' }}
          className="relative z-10"
        />
      </div>

      {/* Title with terminal styling */}
      <div className="animate-fade-in delay-1 opacity-0 mb-2">
        <span
          className="font-mono text-sm tracking-[0.3em] uppercase"
          style={{ color: 'var(--cyber-text-muted)' }}
        >
          // system.initialize
        </span>
      </div>

      <h1
        className="text-5xl font-bold mb-6 animate-fade-in delay-2 opacity-0 tracking-tight"
        style={{
          fontFamily: 'var(--font-orbitron), sans-serif',
          background: 'linear-gradient(135deg, var(--cyber-cyan) 0%, var(--cyber-teal) 50%, var(--cyber-blue) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 80px rgba(0, 240, 255, 0.5)'
        }}
      >
        LEARNING HUB
      </h1>

      {/* Subtitle with blinking cursor */}
      <div
        className="flex items-center gap-2 font-mono text-lg mb-8 animate-fade-in delay-3 opacity-0"
        style={{ color: 'var(--cyber-text-dim)' }}
      >
        <ChevronRight size={18} style={{ color: 'var(--cyber-cyan)' }} />
        <span>Personal Learning Content Visualizer</span>
        <span className="cursor-blink" style={{ color: 'var(--cyber-cyan)' }}>_</span>
      </div>

      {/* Feature cards */}
      <div className="flex gap-6 animate-fade-in delay-4 opacity-0">
        <FeatureCard icon={<Code2 size={20} />} label="Deep Dives" />
        <FeatureCard icon={<Cpu size={20} />} label="System Design" />
        <FeatureCard icon={<Zap size={20} />} label="Best Practices" />
      </div>

      {/* Bottom instruction */}
      <p
        className="mt-12 font-mono text-sm animate-fade-in delay-4 opacity-0"
        style={{ color: 'var(--cyber-text-muted)' }}
      >
        {'<'} Select a module from the navigation panel to begin {'>'}
      </p>
    </div>
  );
}

function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 hover:scale-105"
      style={{
        background: 'var(--cyber-dark)',
        border: '1px solid var(--cyber-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--cyber-cyan)';
        e.currentTarget.style.boxShadow = 'var(--glow-sm)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--cyber-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ color: 'var(--cyber-cyan)' }}>{icon}</span>
      <span className="font-medium text-sm" style={{ color: 'var(--cyber-text)' }}>
        {label}
      </span>
    </div>
  );
}
