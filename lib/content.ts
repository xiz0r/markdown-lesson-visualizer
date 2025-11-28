import fs from 'fs';
import path from 'path';

// Use environment variable if provided, otherwise default to sibling 'content' directory
export const CONTENT_ROOT = process.env.CONTENT_ROOT 
  ? path.resolve(process.env.CONTENT_ROOT)
  : path.resolve(process.cwd(), '../content');

export type ContentNode = {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: ContentNode[];
};

export function getDirectoryTree(dirPath: string = CONTENT_ROOT, relativePath: string = ''): ContentNode[] {
  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    console.warn(`Content directory not found: ${dirPath}`);
    return [];
  }

  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  // Filter out hidden files and the visualizer directory itself if it were inside
  const filteredItems = items.filter(item => !item.name.startsWith('.') && item.name !== 'assets');

  return filteredItems.map(item => {
    const itemPath = path.join(dirPath, item.name);
    const itemRelativePath = path.join(relativePath, item.name);
    
    if (item.isDirectory()) {
      return {
        name: item.name,
        type: 'directory' as const,
        path: itemRelativePath,
        children: getDirectoryTree(itemPath, itemRelativePath),
      };
    } else {
      return {
        name: item.name,
        type: 'file' as const,
        path: itemRelativePath,
      };
    }
  }).sort((a, b) => {
    // Sort directories first, then files
    if (a.type === b.type) {
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    }
    return a.type === 'directory' ? -1 : 1;
  });
}
