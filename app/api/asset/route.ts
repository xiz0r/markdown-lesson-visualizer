import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


import { CONTENT_ROOT } from '@/lib/content';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assetPath = searchParams.get('path');

  if (!assetPath) {
    return new NextResponse('Missing path parameter', { status: 400 });
  }

  // Security check: prevent directory traversal and ensure path is within content root
  // We resolve the full path and check if it starts with CONTENT_ROOT
  const fullPath = path.resolve(CONTENT_ROOT, assetPath);
  
  if (!fullPath.startsWith(CONTENT_ROOT)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  if (!fs.existsSync(fullPath)) {
    return new NextResponse('Asset not found', { status: 404 });
  }

  const stat = fs.statSync(fullPath);
  const fileSize = stat.size;
  
  // Determine mime type
  const ext = path.extname(fullPath).toLowerCase();
  let contentType = 'application/octet-stream';
  
  // Simple mime type map to avoid external dependencies if possible, 
  // or we can rely on what we know we have (png, jpg, avif, etc)
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.mov': 'video/quicktime',
    '.mp4': 'video/mp4',
  };

  if (mimeTypes[ext]) {
    contentType = mimeTypes[ext];
  }

  const file = fs.readFileSync(fullPath);

  return new NextResponse(file, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileSize.toString(),
      // Cache control for better performance
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
