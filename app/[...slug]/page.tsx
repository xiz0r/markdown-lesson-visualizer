import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

import { CONTENT_ROOT } from '@/lib/content';
import LessonContent from '@/components/LessonContent';

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
  } catch {
    notFound();
  }

  if (stats.isDirectory()) {
    return (
      <div className="flex flex-col items-center justify-center h-full font-mono" style={{ color: 'var(--cyber-text-muted)' }}>
        <p>{'>'} Select a module from the navigation panel to begin...</p>
      </div>
    );
  }

  // It's a file. Read content.
  const fileContent = fs.readFileSync(fullPath, 'utf-8');

  // Check for video
  const videoPath = fullPath.replace(/\.md$/, '.mov');
  const videoExists = fs.existsSync(videoPath);
  const videoRelativePath = relativePath.replace(/\.md$/, '.mov');

  // Get filename for header
  const fileName = path.basename(relativePath, '.md');

  return (
    <LessonContent
      relativePath={relativePath}
      fileName={fileName}
      fileContent={fileContent}
      videoExists={videoExists}
      videoRelativePath={videoExists ? videoRelativePath : undefined}
    />
  );
}
