import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

import { CONTENT_ROOT } from '@/lib/content';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoPath = searchParams.get('path');

  if (!videoPath) {
    return new NextResponse('Missing path parameter', { status: 400 });
  }

  // Security check: ensure path is within content root
  const fullPath = path.resolve(CONTENT_ROOT, videoPath);
  if (!fullPath.startsWith(CONTENT_ROOT)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  if (!fs.existsSync(fullPath)) {
    return new NextResponse('Video not found', { status: 404 });
  }

  const stat = fs.statSync(fullPath);
  const fileSize = stat.size;
  const range = request.headers.get('range');
  
  // Determine mime type based on extension
  const ext = path.extname(fullPath).toLowerCase();
  const mimeType = ext === '.mov' ? 'video/quicktime' : 'video/mp4';

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(fullPath, { start, end });
    
    // Convert Node.js stream to Web ReadableStream
    const stream = new ReadableStream({
        start(controller) {
            file.on('data', (chunk) => {
                try {
                    controller.enqueue(chunk);
                } catch {
                    // Controller might be closed if client disconnected
                    file.destroy();
                }
            });
            file.on('end', () => {
                try {
                    controller.close();
                } catch {
                    // Ignore if already closed
                }
            });
            file.on('error', (err) => {
                try {
                    controller.error(err);
                } catch {
                    // Ignore if already closed
                }
            });
        },
        cancel() {
            file.destroy();
        }
    });

    const headers = new Headers();
    headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Length', chunksize.toString());
    headers.set('Content-Type', mimeType);

    return new NextResponse(stream, { 
        status: 206, 
        headers 
    });
  } else {
    const headers = new Headers();
    headers.set('Content-Length', fileSize.toString());
    headers.set('Content-Type', mimeType);
    
    const file = fs.createReadStream(fullPath);
    const stream = new ReadableStream({
        start(controller) {
            file.on('data', (chunk) => {
                try {
                    controller.enqueue(chunk);
                } catch {
                    file.destroy();
                }
            });
            file.on('end', () => {
                try {
                    controller.close();
                } catch {}
            });
            file.on('error', (err) => {
                try {
                    controller.error(err);
                } catch {}
            });
        },
        cancel() {
            file.destroy();
        }
    });

    return new NextResponse(stream, { 
        status: 200, 
        headers 
    });
  }
}
