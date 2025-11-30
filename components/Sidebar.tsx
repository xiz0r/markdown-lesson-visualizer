'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown, FileCode, FolderOpen, Folder, Terminal } from 'lucide-react';
import clsx from 'clsx';

import { ContentNode } from '@/lib/content';

const SidebarItem = ({ item, level = 0 }: { item: ContentNode; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const href = `/${item.path.split('/').map(encodeURIComponent).join('/')}`;
  const isActive = pathname === href;

  // Auto-expand if a child is active
  useEffect(() => {
    if (pathname.startsWith(href) && item.type === 'directory') {
      setIsOpen(true);
    }
  }, [pathname, href, item.type]);

  if (item.type === 'directory') {
    const isTopLevel = level === 0;

    return (
      <div className="select-none">
        <div
          className={clsx(
            "flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-200 text-sm",
            isTopLevel && "mt-6 first:mt-2"
          )}
          style={{
            paddingLeft: isTopLevel ? '16px' : `${level * 16 + 16}px`,
            background: isHovered ? 'var(--cyber-dark)' : 'transparent',
            color: isTopLevel ? 'var(--cyber-cyan)' : 'var(--cyber-text-dim)',
          }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isTopLevel ? (
            <>
              <span style={{ color: 'var(--cyber-text-muted)' }}>//</span>
              <span
                className="font-mono font-semibold uppercase tracking-[0.15em] text-xs"
                style={{ color: 'var(--cyber-cyan)', textShadow: isHovered ? 'var(--glow-text)' : 'none' }}
              >
                {item.name}
              </span>
            </>
          ) : (
            <>
              <span
                className="transition-transform duration-200"
                style={{
                  color: isOpen ? 'var(--cyber-cyan)' : 'var(--cyber-text-muted)',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                <ChevronRight size={14} />
              </span>
              <span style={{ color: isOpen ? 'var(--cyber-cyan-dim)' : 'var(--cyber-text-muted)' }}>
                {isOpen ? <FolderOpen size={14} /> : <Folder size={14} />}
              </span>
              <span
                className="font-medium"
                style={{ color: isHovered ? 'var(--cyber-text)' : 'var(--cyber-text-dim)' }}
              >
                {item.name}
              </span>
            </>
          )}
        </div>
        {isOpen && item.children && (
          <div
            style={{
              borderLeft: level > 0 ? '1px solid var(--cyber-border)' : 'none',
              marginLeft: level > 0 ? `${level * 16 + 22}px` : '0',
            }}
          >
            {item.children.map((child) => (
              <SidebarItem key={child.path} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // It's a file - only show markdown files
  if (!item.name.endsWith('.md')) return null;

  const displayName = item.name.replace('.md', '');

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 relative group"
      )}
      style={{
        paddingLeft: `${level * 16 + 16}px`,
        background: isActive ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, transparent 100%)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--cyber-cyan)' : '2px solid transparent',
        color: isActive ? 'var(--cyber-cyan)' : 'var(--cyber-text-dim)',
        boxShadow: isActive ? 'inset 0 0 20px rgba(0, 240, 255, 0.05)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--cyber-dark)';
          e.currentTarget.style.color = 'var(--cyber-text)';
          e.currentTarget.style.borderLeftColor = 'var(--cyber-cyan-dim)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--cyber-text-dim)';
          e.currentTarget.style.borderLeftColor = 'transparent';
        }
      }}
    >
      <FileCode
        size={14}
        style={{ color: isActive ? 'var(--cyber-cyan)' : 'var(--cyber-text-muted)' }}
      />
      <span className="truncate font-mono text-xs">{displayName}</span>
      {isActive && (
        <span
          className="ml-auto text-xs font-mono"
          style={{ color: 'var(--cyber-cyan)', opacity: 0.6 }}
        >
          {'<'}
        </span>
      )}
    </Link>
  );
};

export default function Sidebar({ tree }: { tree: ContentNode[] }) {
  const [width, setWidth] = useState(320);
  const isResized = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResized.current) return;
      setWidth((previousWidth) => Math.max(240, Math.min(500, previousWidth + e.movementX)));
    };

    const handleMouseUp = () => {
      isResized.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <div
        style={{
          width: `${width}px`,
          background: 'linear-gradient(180deg, var(--cyber-deep) 0%, var(--cyber-void) 100%)',
          borderRight: '1px solid var(--cyber-border)',
        }}
        className="h-screen overflow-y-auto flex-shrink-0 flex flex-col"
      >
        {/* Header */}
        <div
          className="p-4 sticky top-0 z-10"
          style={{
            background: 'linear-gradient(180deg, var(--cyber-deep) 0%, var(--cyber-deep) 80%, transparent 100%)',
            borderBottom: '1px solid var(--cyber-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{
                background: 'var(--cyber-dark)',
                border: '1px solid var(--cyber-border)',
                boxShadow: 'var(--glow-sm)',
              }}
            >
              <Terminal size={20} style={{ color: 'var(--cyber-cyan)' }} />
            </div>
            <div>
              <h1
                className="text-lg font-bold tracking-wide"
                style={{
                  fontFamily: 'var(--font-orbitron), sans-serif',
                  color: 'var(--cyber-cyan)',
                  textShadow: 'var(--glow-text)',
                }}
              >
                LEARNING HUB
              </h1>
              <p
                className="text-xs font-mono"
                style={{ color: 'var(--cyber-text-muted)' }}
              >
                v2.0.0 // modules loaded
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-2 flex-1">
          {tree.map((node) => (
            <SidebarItem key={node.path} item={node} />
          ))}
        </div>

        {/* Footer */}
        <div
          className="p-4 font-mono text-xs"
          style={{
            borderTop: '1px solid var(--cyber-border)',
            color: 'var(--cyber-text-muted)',
            background: 'var(--cyber-void)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full pulse-glow"
              style={{ background: 'var(--cyber-teal)', boxShadow: '0 0 8px var(--cyber-teal)' }}
            />
            <span>system.status: online</span>
          </div>
        </div>
      </div>

      {/* Resize handle */}
      <div
        className="w-1 cursor-col-resize transition-colors duration-200 hover:w-1"
        style={{
          background: 'var(--cyber-border)',
        }}
        onMouseDown={() => {
          isResized.current = true;
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--cyber-cyan)';
          e.currentTarget.style.boxShadow = 'var(--glow-sm)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--cyber-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </>
  );
}
