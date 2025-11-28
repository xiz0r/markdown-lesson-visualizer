import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';


import { CONTENT_ROOT } from '@/lib/content';

interface PageProps {
  params: Promise<{ slug: string[] }>;
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
  } catch (e) {
    notFound();
  }

  if (stats.isDirectory()) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <p>Select a lesson from the sidebar to start learning.</p>
      </div>
    );
  }

  // It's a file. Read content.
  const fileContent = fs.readFileSync(fullPath, 'utf-8');

  // Check for video
  // Assuming video has same name but .mov extension
  // We need to handle case where markdown file is "Lesson.md" and video is "Lesson.mov"
  const videoPath = fullPath.replace(/\.md$/, '.mov');
  const videoExists = fs.existsSync(videoPath);

  // Relative path for video API
  const videoRelativePath = relativePath.replace(/\.md$/, '.mov');

  return (
    <div className="max-w-7xl mx-auto p-8 pb-32">
      {videoExists && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-2xl bg-black aspect-video">
          <video
            controls
            className="w-full h-full"
            src={`/api/video?path=${encodeURIComponent(videoRelativePath)}`}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-10 mb-6 pb-2 border-b border-zinc-800 text-zinc-100" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 pb-1 border-b border-zinc-800 text-zinc-100" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3 text-zinc-100" {...props} />,
            h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-6 mb-3 text-zinc-100" {...props} />,
            p: ({ node, ...props }) => <p className="mb-4 leading-7 text-zinc-300" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-zinc-300" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-zinc-300" {...props} />,
            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-zinc-900/50 text-zinc-400 italic" {...props} />
            ),
            code: ({ node, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match && !String(children).includes('\n');
              return isInline ? (
                <code className="font-mono text-sm bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded" {...props}>
                  {children}
                </code>
              ) : (
                <div className="my-4 rounded-lg overflow-hidden bg-[#1e1e1e] border border-zinc-800">
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                    <span className="text-xs text-zinc-400 font-mono">{match ? match[1] : 'text'}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300 leading-relaxed">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            },
            pre: ({ node, ...props }) => <>{props.children}</>,
            hr: ({ node, ...props }) => <hr className="my-8 border-zinc-800" {...props} />,
            table: ({ node, ...props }) => <div className="my-6 overflow-x-auto"><table className="w-full text-left border-collapse" {...props} /></div>,
            th: ({ node, ...props }) => <th className="border-b border-zinc-700 p-2 font-bold text-zinc-200" {...props} />,
            td: ({ node, ...props }) => <td className="border-b border-zinc-800 p-2 text-zinc-300" {...props} />,
            a: ({ node, ...props }) => <a className="text-blue-400 hover:underline hover:text-blue-300 transition-colors" {...props} />,
            img: ({ node, src, alt, ...props }) => {
              let imageSrc = src;
              if (typeof imageSrc === 'string' && !imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
                const currentDir = path.dirname(relativePath);
                const assetPath = path.join(currentDir, imageSrc);
                imageSrc = `/api/asset?path=${encodeURIComponent(assetPath)}`;
              }
              return (
                <img
                  src={imageSrc as string}
                  alt={alt}
                  className="rounded-lg shadow-lg max-w-full h-auto mx-auto my-8 border border-zinc-800"
                  loading="lazy"
                  {...props}
                />
              );
            }
          }}
        >
          {fileContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
