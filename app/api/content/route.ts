import { NextResponse } from 'next/server';
import { getDirectoryTree } from '@/lib/content';

export async function GET() {
  try {
    const tree = getDirectoryTree();
    return NextResponse.json(tree);
  } catch (error) {
    console.error('Error reading content directory:', error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}
