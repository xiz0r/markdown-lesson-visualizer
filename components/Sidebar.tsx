'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  FolderOpen, 
  Folder,
  PanelLeftClose,
  PanelLeft,
  GraduationCap
} from 'lucide-react';
import clsx from 'clsx';

import { ContentNode } from '@/lib/content';

const SidebarItem = ({ item, level = 0 }: { item: ContentNode; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="select-none animate-fade-in" style={{ animationDelay: `${level * 50}ms` }}>
        <div
          className={clsx(
            "flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-lg mx-2 transition-all duration-200",
            isTopLevel
              ? "text-slate-300 font-semibold mt-6 first:mt-2 hover:bg-slate-800/50"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
          )}
          style={{ paddingLeft: isTopLevel ? '16px' : `${level * 16 + 16}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={clsx(
            "flex items-center justify-center transition-transform duration-200",
            isOpen && "rotate-90"
          )}>
            <ChevronRight size={16} className="text-slate-500" />
          </span>
          {isTopLevel ? (
            <GraduationCap size={18} className="text-blue-400" />
          ) : (
            isOpen ? (
              <FolderOpen size={16} className="text-amber-400" />
            ) : (
              <Folder size={16} className="text-slate-500" />
            )
          )}
          <span className="truncate">{item.name}</span>
          {item.children && (
            <span className="ml-auto text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
              {item.children.filter(c => c.name.endsWith('.md')).length}
            </span>
          )}
        </div>
        <div className={clsx(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          {item.children && item.children.map((child) => (
            <SidebarItem key={child.path} item={child} level={level + 1} />
          ))}
        </div>
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
        "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200 group",
        isActive
          ? "bg-blue-500/10 border-l-2 border-blue-400 text-blue-300"
          : "border-l-2 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      )}
      style={{ paddingLeft: `${level * 16 + 16}px` }}
    >
      <FileText 
        size={16} 
        className={clsx(
          "transition-colors flex-shrink-0",
          isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
        )} 
      />
      <span className="truncate">{displayName}</span>
      {isActive && (
        <span className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
      )}
    </Link>
  );
};

export default function Sidebar({ tree }: { tree: ContentNode[] }) {
  const [width, setWidth] = useState(320);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isResized = useRef(false);
  const minWidth = 280;
  const maxWidth = 500;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResized.current) return;
      
      setWidth((previousWidth) => {
        const newWidth = previousWidth + e.movementX;
        return Math.min(Math.max(newWidth, minWidth), maxWidth);
      });
    };

    const handleMouseUp = () => {
      isResized.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleResizeStart = () => {
    isResized.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <>
      <div 
        style={{ width: isCollapsed ? '0px' : `${width}px` }} 
        className={clsx(
          "h-screen bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden",
          isCollapsed && "border-r-0"
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800/50 sticky top-0 bg-slate-900/95 backdrop-blur-xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100">
                  Learning Hub
                </h1>
                <p className="text-xs text-slate-500">Personal Course Platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {tree.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              No content found. Add markdown files to the content directory.
            </div>
          ) : (
            tree.map((node) => (
              <SidebarItem key={node.path} item={node} />
            ))
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span>© 2024 Learning Hub</span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Collapse toggle button (visible when collapsed) */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed left-4 top-4 z-50 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl shadow-lg transition-all duration-200 animate-fade-in"
          title="Expand sidebar"
        >
          <PanelLeft size={20} className="text-slate-300" />
        </button>
      )}

      {/* Resize handle */}
      {!isCollapsed && (
        <div 
          className="w-1 hover:w-1.5 cursor-col-resize bg-transparent hover:bg-blue-500/50 transition-all duration-150 flex-shrink-0"
          onMouseDown={handleResizeStart}
        />
      )}
    </>
  );
}
