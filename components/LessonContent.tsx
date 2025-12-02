'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

import ContentWrapper from './ContentWrapper';
import { useWatchedLessons } from './WatchedProvider';

type LessonContentProps = {
  relativePath: string;
  fileName: string;
  fileContent: string;
  videoExists: boolean;
  videoRelativePath?: string;
};

export default function LessonContent({
  relativePath,
  fileName,
  fileContent,
  videoExists,
  videoRelativePath,
}: LessonContentProps) {
  const { markWatched } = useWatchedLessons();
  const completionRef = useRef<HTMLDivElement | null>(null);
  const hasMarkedRef = useRef(false);

  const markComplete = useCallback(() => {
    if (hasMarkedRef.current) return;
    hasMarkedRef.current = true;
    markWatched(relativePath);
  }, [markWatched, relativePath]);

  const contentDir = useMemo(() => {
    const segments = relativePath.split('/');
    segments.pop();
    return segments.join('/');
  }, [relativePath]);

  // For lessons without video, mark watched when the reader scrolls through content.
  useEffect(() => {
    if (videoExists) return;
    const target = completionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          markComplete();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [videoExists, markComplete]);

  const handleVideoPlay = useCallback(() => {
    markComplete();
  }, [markComplete]);

  const markdownComponents: Components = {
    h1: (props) => (
      <h1
        className="text-3xl font-bold mt-12 mb-6 pb-3"
        style={{
          color: 'var(--cyber-text)',
          borderBottom: '1px solid var(--cyber-border)',
        }}
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="text-2xl font-bold mt-10 mb-4 pb-2 flex items-center gap-3"
        style={{
          color: 'var(--cyber-text)',
          borderBottom: '1px solid var(--cyber-border)',
        }}
        {...props}
      >
        <span style={{ color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)' }}>#</span>
        {props.children}
      </h2>
    ),
    h3: (props) => (
      <h3
        className="text-xl font-bold mt-8 mb-3 flex items-center gap-2"
        style={{ color: 'var(--cyber-text)' }}
        {...props}
      >
        <span style={{ color: 'var(--cyber-cyan-dim)', fontFamily: 'var(--font-mono)' }}>##</span>
        {props.children}
      </h3>
    ),
    h4: (props) => (
      <h4
        className="text-lg font-bold mt-6 mb-3"
        style={{ color: 'var(--cyber-text-dim)' }}
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="mb-4 leading-7"
        style={{ color: 'var(--cyber-text-dim)' }}
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="list-none ml-4 mb-4 space-y-2"
        style={{ color: 'var(--cyber-text-dim)' }}
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="list-decimal list-outside ml-6 mb-4 space-y-2"
        style={{ color: 'var(--cyber-text-dim)' }}
        {...props}
      />
    ),
    li: (props) => (
      <li className="pl-1 flex items-start gap-2" {...props}>
        <span style={{ color: 'var(--cyber-cyan)', marginTop: '0.15rem' }}>{'>'}</span>
        <span>{props.children}</span>
      </li>
    ),
    blockquote: (props) => (
      <blockquote
        className="pl-4 py-3 my-6 rounded-r-lg"
        style={{
          borderLeft: '3px solid var(--cyber-cyan)',
          background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.05) 0%, transparent 100%)',
          color: 'var(--cyber-text-dim)',
          boxShadow: 'inset 0 0 20px rgba(0, 240, 255, 0.02)',
        }}
        {...props}
      />
    ),
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match && !String(children).includes('\n');
      const language = match ? match[1] : 'text';

      return isInline ? (
        <code
          className="font-mono text-sm px-1.5 py-0.5 rounded"
          style={{
            background: 'var(--cyber-dark)',
            color: 'var(--cyber-cyan)',
            border: '1px solid var(--cyber-border)',
          }}
          {...props}
        >
          {children}
        </code>
      ) : (
        <div
          className="my-6 rounded-lg overflow-hidden"
          style={{
            background: 'var(--cyber-void)',
            border: '1px solid var(--cyber-border)',
            boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{
              background: 'var(--cyber-dark)',
              borderBottom: '1px solid var(--cyber-border)',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </div>
              <span
                className="text-xs font-mono ml-3"
                style={{ color: 'var(--cyber-text-muted)' }}
              >
                {language}
              </span>
            </div>
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--cyber-cyan)', opacity: 0.5 }}
            >
              {'</>'}
            </span>
          </div>
          <pre
            className="p-4 overflow-x-auto text-sm font-mono leading-relaxed"
            style={{ color: 'var(--cyber-text)' }}
          >
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
    pre: (props) => <>{props.children}</>,
    hr: (props) => (
      <hr
        className="my-10"
        style={{
          border: 'none',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--cyber-cyan), transparent)',
          opacity: 0.3,
        }}
        {...props}
      />
    ),
    table: (props) => (
      <div
        className="my-6 overflow-x-auto rounded-lg"
        style={{
          border: '1px solid var(--cyber-border)',
        }}
      >
        <table className="w-full text-left border-collapse" {...props} />
      </div>
    ),
    th: (props) => (
      <th
        className="p-3 font-bold font-mono text-sm"
        style={{
          background: 'var(--cyber-dark)',
          color: 'var(--cyber-cyan)',
          borderBottom: '1px solid var(--cyber-border)',
        }}
        {...props}
      />
    ),
    td: (props) => (
      <td
        className="p-3 text-sm"
        style={{
          borderBottom: '1px solid var(--cyber-border)',
          color: 'var(--cyber-text-dim)',
        }}
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="transition-all duration-200 hover:underline"
        style={{
          color: 'var(--cyber-cyan)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textShadow = 'var(--glow-text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textShadow = 'none';
        }}
        {...props}
      />
    ),
    img: ({ src, alt, ...props }) => {
      let imageSrc = src;
      if (typeof imageSrc === 'string' && !imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
        const assetPath = contentDir ? `${contentDir}/${imageSrc}` : imageSrc;
        imageSrc = `/api/asset?path=${encodeURIComponent(assetPath)}`;
      }
      return (
        <img
          src={imageSrc as string}
          alt={alt}
          className="rounded-lg max-w-full h-auto mx-auto my-8"
          style={{
            border: '1px solid var(--cyber-border)',
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.1)',
          }}
          loading="lazy"
          {...props}
        />
      );
    },
    strong: (props) => (
      <strong style={{ color: 'var(--cyber-text)', fontWeight: 600 }} {...props} />
    ),
    em: (props) => (
      <em style={{ color: 'var(--cyber-cyan-dim)' }} {...props} />
    ),
  };

  return (
    <ContentWrapper>
      <div className="max-w-7xl mx-auto p-8 pb-32">
        {/* Page header */}
        <div
          className="mb-8 pb-6"
          style={{ borderBottom: '1px solid var(--cyber-border)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs" style={{ color: 'var(--cyber-text-muted)' }}>
              {`// module.load("${fileName}")`}
            </span>
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              color: 'var(--cyber-cyan)',
              textShadow: 'var(--glow-text)',
            }}
          >
            {fileName.toUpperCase()}
          </h1>
        </div>

        {videoExists && videoRelativePath && (
          <div
            className="mb-8 rounded-xl overflow-hidden aspect-video"
            style={{
              background: 'var(--cyber-void)',
              border: '1px solid var(--cyber-border)',
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.1)',
            }}
          >
            <video
              controls
              className="w-full h-full"
              src={`/api/video?path=${encodeURIComponent(videoRelativePath)}`}
              style={{ outline: 'none' }}
              onPlay={handleVideoPlay}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <ReactMarkdown
            components={markdownComponents}
          >
            {fileContent}
          </ReactMarkdown>
        </div>

        {/* Sentinel used to mark lessons without video as watched after scroll */}
        <div ref={completionRef} className="h-8" />

        {/* Bottom decoration */}
        <div
          className="max-w-4xl mx-auto mt-16 pt-8 text-center font-mono text-xs"
          style={{
            borderTop: '1px solid var(--cyber-border)',
            color: 'var(--cyber-text-muted)',
          }}
        >
          {'// end of module'}
        </div>
      </div>
    </ContentWrapper>
  );
}
