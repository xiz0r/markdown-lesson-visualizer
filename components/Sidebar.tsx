'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown, FileText } from 'lucide-react';
import clsx from 'clsx';

import { ContentNode } from '@/lib/content';

const SidebarItem = ({ item, level = 0 }: { item: ContentNode; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Construct the URL path for the link
  // We need to encode the path components to handle spaces and special chars
  // The path from API is relative to content root, e.g. "teacher/chapter/lesson.md"
  // We want to link to "/teacher/chapter/lesson" (without extension if possible, or handle in page)
  // Let's keep it simple: link to the full path and handle it in the page slug.
  // But wait, the slug in Next.js will be an array.
  // If path is "cbs/Chapter 1/Lesson.md", we want the URL to be "/cbs/Chapter%201/Lesson.md"

  const href = `/${item.path.split('/').map(encodeURIComponent).join('/')}`;
  const isActive = pathname === href;

  // Auto-expand if a child is active
  useEffect(() => {
    if (pathname.startsWith(href) && item.type === 'directory') {
      setIsOpen(true);
    }
  }, [pathname, href, item.type]);

  if (item.type === 'directory') {
    return (
      <div className="select-none">
        <div
          className={clsx(
            "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-300",
            level === 0 && "font-bold text-zinc-100 mt-4 uppercase tracking-wider text-xs"
          )}
          style={{ paddingLeft: level === 0 ? '12px' : `${level * 12 + 12}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {level > 0 && (
            <span className="text-zinc-500">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          {/* {level > 0 && <Folder size={14} className="text-zinc-500" />} */}
          <span className="">{item.name}</span>
        </div>
        {isOpen && item.children && (
          <div>
            {item.children.map((child) => (
              <SidebarItem key={child.path} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // It's a file
  // Only show markdown files in the sidebar navigation
  if (!item.name.endsWith('.md')) return null;

  const displayName = item.name.replace('.md', '');

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 text-sm transition-colors border-l-2",
        isActive
          ? "bg-zinc-800/50 border-blue-500 text-blue-400"
          : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
      )}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
    >
      <FileText size={14} />
      <span className="truncate">{displayName}</span>
    </Link>
  );
};

export default function Sidebar({ tree }: { tree: ContentNode[] }) {
  const [width, setWidth] = useState(350);
  const isResized = useRef(false);
  useEffect(() => {

    window.addEventListener("mousemove", (e) => {
      if (!isResized.current) {
        return;
      }

      setWidth((previousWidth) => previousWidth + e.movementX);
    });

    window.addEventListener("mouseup", () => {
      isResized.current = false;
    });

    return () => {
      window.removeEventListener("mousemove", () => { });
      window.removeEventListener("mouseup", () => { });
    };

  }, []);

  return (
    <>

      <div style={{ width: `${width / 16}rem` }} className="h-screen bg-zinc-950 border-r border-zinc-800 overflow-y-auto flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Learning Hub
          </h1>
        </div>
        <div className="py-2">
          {tree.map((node) => (
            <SidebarItem key={node.path} item={node} />
          ))}
        </div>
      </div>
      <div className="w-2 cursor-col-resize bg-zinc-500 " onMouseDown={() => isResized.current = true}></div></>
  );
}
