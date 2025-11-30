'use client';

export default function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
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
