import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { Play, Clock, BookOpen, ChevronRight, List } from 'lucide-react';

import { CONTENT_ROOT } from '@/lib/content';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// Extract headings from markdown for TOC
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    headings.push({ id, text, level });
  }

  return headings;
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;

  const relativePath = slug.map(decodeURIComponent).join('/');

  // Security check: prevent directory traversal
  if (relativePath.includes('..')) {
    notFound();
  }

  const fullPath = path.join(CONTENT_ROOT, relativePath);

  // Check if it's a file or directory
  let stats;
  try {
    stats = fs.statSync(fullPath);
  } catch {
    notFound();
  }

  if (stats.isDirectory()) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fade-in">
        <div className="bg-slate-800/50 p-6 rounded-2xl mb-4">
          <BookOpen size={48} className="text-slate-600" />
        </div>
        <p className="text-lg">Select a lesson from the sidebar to start learning.</p>
      </div>
    );
  }

  // It's a file. Read content.
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const headings = extractHeadings(fileContent);

  // Check for video
  const videoPath = fullPath.replace(/\.md$/, '.mov');
  const videoExists = fs.existsSync(videoPath);
  const videoRelativePath = relativePath.replace(/\.md$/, '.mov');

  // Get file name for title
  const fileName = path.basename(relativePath, '.md');

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 pb-32 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <span className="hover:text-slate-300 cursor-pointer">Home</span>
        {slug.map((segment, index) => (
          <span key={index} className="flex items-center gap-2">
            <ChevronRight size={14} />
            <span className={index === slug.length - 1 ? "text-slate-300" : "hover:text-slate-300 cursor-pointer"}>
              {decodeURIComponent(segment).replace('.md', '')}
            </span>
          </span>
        ))}
      </nav>

      {/* Video Player Section */}
      {videoExists && (
        <div className="mb-10 animate-slide-in">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-slate-900 border border-slate-800/50">
            {/* Video Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4 pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 w-3 h-3 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm font-medium">Video Lesson</span>
              </div>
            </div>
            
            {/* Video Container */}
            <div className="aspect-video bg-black">
              <video
                controls
                className="w-full h-full"
                src={`/api/video?path=${encodeURIComponent(videoRelativePath)}`}
                poster=""
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Content Layout with TOC */}
      <div className="flex gap-10">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Content Card */}
          <article className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 lg:p-10 shadow-xl">
            <ReactMarkdown
              components={{
                h1: ({ children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                  return (
                    <h1 
                      id={id}
                      className="text-3xl lg:text-4xl font-bold mt-2 mb-6 pb-4 border-b border-slate-700/50 text-slate-100 scroll-mt-8" 
                      {...props}
                    >
                      {children}
                    </h1>
                  );
                },
                h2: ({ children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                  return (
                    <h2 
                      id={id}
                      className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-slate-800/50 text-slate-100 scroll-mt-8" 
                      {...props}
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                  return (
                    <h3 
                      id={id}
                      className="text-xl font-semibold mt-8 mb-3 text-slate-200 scroll-mt-8" 
                      {...props}
                    >
                      {children}
                    </h3>
                  );
                },
                h4: ({ children, ...props }) => (
                  <h4 className="text-lg font-semibold mt-6 mb-3 text-slate-200" {...props}>
                    {children}
                  </h4>
                ),
                p: ({ children, ...props }) => (
                  <p className="mb-5 leading-7 text-slate-300" {...props}>
                    {children}
                  </p>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="list-disc list-outside ml-6 mb-5 space-y-2 text-slate-300" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal list-outside ml-6 mb-5 space-y-2 text-slate-300" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="pl-2 leading-7" {...props}>
                    {children}
                  </li>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote 
                    className="border-l-4 border-blue-500 pl-5 py-3 my-6 bg-slate-800/50 rounded-r-lg text-slate-400 italic" 
                    {...props}
                  >
                    {children}
                  </blockquote>
                ),
                code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { className?: string }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !String(children).includes('\n');
                  
                  if (isInline) {
                    return (
                      <code 
                        className="font-mono text-sm bg-slate-800 text-blue-300 px-2 py-1 rounded-md border border-slate-700" 
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  
                  return (
                    <div className="my-6 rounded-xl overflow-hidden bg-[#0d1117] border border-slate-800 shadow-lg">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono ml-2">
                            {match ? match[1] : 'code'}
                          </span>
                        </div>
                      </div>
                      <pre className="p-5 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                pre: ({ children, ...props }) => <>{children}</>,
                hr: ({ ...props }) => <hr className="my-10 border-slate-800" {...props} />,
                table: ({ children, ...props }) => (
                  <div className="my-6 overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left" {...props}>
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children, ...props }) => (
                  <thead className="bg-slate-800/50" {...props}>
                    {children}
                  </thead>
                ),
                th: ({ children, ...props }) => (
                  <th className="border-b border-slate-700 p-3 font-semibold text-slate-200" {...props}>
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className="border-b border-slate-800/50 p-3 text-slate-300" {...props}>
                    {children}
                  </td>
                ),
                a: ({ children, ...props }) => (
                  <a 
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-400/30 hover:decoration-blue-300 transition-colors" 
                    {...props}
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt, ...props }) => {
                  let imageSrc = src;
                  if (typeof imageSrc === 'string' && !imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
                    const currentDir = path.dirname(relativePath);
                    const assetPath = path.join(currentDir, imageSrc);
                    imageSrc = `/api/asset?path=${encodeURIComponent(assetPath)}`;
                  }
                  return (
                    <span className="block my-8">
                      <img
                        src={imageSrc as string}
                        alt={alt}
                        className="rounded-xl shadow-xl max-w-full h-auto mx-auto border border-slate-800"
                        loading="lazy"
                        {...props}
                      />
                      {alt && (
                        <span className="block text-center text-sm text-slate-500 mt-3">
                          {alt}
                        </span>
                      )}
                    </span>
                  );
                }
              }}
            >
              {fileContent}
            </ReactMarkdown>
          </article>
        </div>

        {/* Table of Contents - Desktop only */}
        {headings.length > 1 && (
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-5 shadow-lg">
                <div className="flex items-center gap-2 text-slate-400 mb-4 pb-3 border-b border-slate-800">
                  <List size={18} />
                  <span className="font-semibold text-sm">Table of Contents</span>
                </div>
                <nav className="space-y-1">
                  {headings.map((heading, index) => (
                    <a
                      key={index}
                      href={`#${heading.id}`}
                      className={`block text-sm py-1.5 text-slate-400 hover:text-blue-400 transition-colors truncate ${
                        heading.level === 1 ? 'font-medium text-slate-300' : 
                        heading.level === 2 ? 'pl-3' : 'pl-6 text-xs'
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
