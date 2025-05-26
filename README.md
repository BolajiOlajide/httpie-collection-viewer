# HTTPie Collection Viewer

A modern, interactive web application for visualizing and exploring HTTPie collections. Built with Next.js, TypeScript, and Tailwind CSS, this tool provides a beautiful interface to upload, parse, and examine HTTPie collection files.

## Features

- **📁 File Upload**: Upload HTTPie collection JSON files or paste JSON directly
- **🔒 Client-Side Processing**: All data stays in your browser - no uploads to external servers
- **🎨 Beautiful UI**: Modern, responsive interface with dark/light theme support
- **🔍 Detailed Request View**: Expandable cards showing all request details
- **📋 Copy to Clipboard**: One-click copying of URLs and request data
- **🔐 Authentication Display**: Clear visualization of auth configurations
- **📊 Request Organization**: Collapsible sections with method-based color coding
- **💾 Multiple Body Types**: Support for text, form, file, and GraphQL bodies
- **🌐 Parameter Management**: Display of query parameters, path parameters, and headers

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/BolajiOlajide/httpie-collection-viewer.git
cd httpie-collection-viewer

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## Usage

1. **Upload a Collection**: Click "Upload JSON File" or paste your HTTPie collection JSON into the text area
2. **Explore Requests**: Click on request cards to expand and view detailed information
3. **View Details**: Use the tabs to explore headers, parameters, authentication, body content, and raw JSON
4. **Copy URLs**: Use the copy button next to URLs for quick access

## HTTPie Collection Format

This viewer supports the standard HTTPie collection format with the following structure:

- Collection metadata and versioning
- Request grouping with icons and authentication
- Individual requests with full HTTP details
- Multiple authentication types (Bearer, Basic, Digest)
- Various body types (JSON, Form, GraphQL, File)
- Header and parameter management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the [HTTPie](https://httpie.io/) ecosystem
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
