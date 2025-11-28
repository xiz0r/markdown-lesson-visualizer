# Markdown Lesson Visualizer

A modern, elegant web application for visualizing and navigating markdown-based educational content with support for videos and images.

## Features

- 📚 **Hierarchical Content Navigation** - Browse through teachers, chapters, and lessons with an intuitive sidebar
- 📝 **Beautiful Markdown Rendering** - VS Code-inspired dark theme with syntax highlighting
- 🎥 **Video Support** - Embedded video playback for lessons with accompanying `.mov` files
- 🖼️ **Image Assets** - Automatic handling of relative image paths from `assets/` folders
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **Fast & Efficient** - Built with Next.js 16 and React 19

## Project Structure

This visualizer expects content to be organized in the following structure:

```
content/
├── {teacher}/
│   ├── {chapter}/
│   │   ├── {lesson}.md
│   │   ├── {lesson}.mov (optional)
│   │   └── assets/
│   │       └── *.{png,jpg,avif,webp} (optional)
```

**Example:**
```
content/
├── teacher1/
│   ├── Chapter 1 - Introduction/
│   │   ├── 1 - Getting Started.md
│   │   ├── 1 - Getting Started.mov
│   │   └── assets/
│   │       └── diagram.avif
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure content path**
   
   By default, the visualizer expects your content to be in a sibling directory called `content`:
   ```
   /your-project/
   ├── content/          # Your markdown lessons
   └── visualizer/       # This app
   ```

   **Custom Content Path:**
   If your content is located elsewhere, you can specify the path using an environment variable.
   
   Create a `.env.local` file in the `visualizer` directory:
   ```bash
   CONTENT_ROOT=/absolute/path/to/your/content
   ```
   Or run with the variable inline:
   ```bash
   CONTENT_ROOT=../my-custom-content npm run dev
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the visualizer.

### Building for Production

```bash
npm run build
npm start
```

## How It Works

### Content Discovery
The app recursively scans the `content/` directory and builds a hierarchical tree structure that's displayed in the sidebar.

### Markdown Rendering
- Uses `react-markdown` with custom component renderers
- Styled to match VS Code's markdown preview (dark theme)
- Supports headings, lists, code blocks, tables, blockquotes, and more

### Video Streaming
Videos are served via a custom API route (`/api/video`) that:
- Supports HTTP range requests for seeking
- Handles `.mov` and `.mp4` files
- Provides proper MIME types

### Image Assets
Images are served via `/api/asset` which:
- Resolves relative paths from markdown files
- Serves images from chapter-specific `assets/` folders
- Supports multiple formats (PNG, JPG, AVIF, WebP, etc.)
- Includes cache headers for performance

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS 4
- **Markdown:** react-markdown
- **Icons:** lucide-react
- **Language:** TypeScript

## Configuration

### Customizing Styles

The markdown styles can be customized in `app/[...slug]/page.tsx` within the `ReactMarkdown` components prop.

### Adding New Content Types

To support additional file types (e.g., PDFs, audio), extend the API routes in:
- `app/api/asset/route.ts` - Add MIME types to the `mimeTypes` object

## Troubleshooting

### Videos not playing
- Ensure the video file has the same name as the markdown file (e.g., `lesson.md` → `lesson.mov`)
- Check that the video codec is H.264 (most compatible with browsers)
- Verify the file path doesn't contain special characters

### Images not loading
- Confirm images are in an `assets/` folder within the same chapter directory
- Check that image paths in markdown are relative (e.g., `![Image](assets/image.png)`)
- Verify image file extensions are supported

### Content not appearing
- Ensure the `content/` directory is at the correct path relative to the visualizer
- Check file permissions
- Look for errors in the browser console or terminal

## License

This project is private and for educational purposes.

## Contributing

This is a personal project. Feel free to fork and modify for your own use.
