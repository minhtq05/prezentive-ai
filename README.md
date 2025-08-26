# Prezentive AI 🎥✨

Streamlined Video Production with Generative AI

## Demo Video

[![Prezentive AI Demo Video](https://youtu.be/yHguCvgVDWk/0.jpg)](https://youtu.be/yHguCvgVDWk)

## Features

- Timeline-based editing
- Multi-track support
- Real-time preview
- Assets gallery (in-progress)
- Cloud storage support (limited)
- Narrative generator (in-progress)
- Image generator (in-progress)
- Script and layout generator (in-progress)

## Project Structure

This project is built as a modern monorepo using **Turborepo** with the following structure:

```
prezentive-ai/
├── apps/
│   ├── web/           # Next.js frontend application
│   ├── api/           # Express.js backend API
│   └── remotion/      # Remotion video rendering service
├── packages/
│   ├── auth/          # Authentication utilities
│   ├── db/            # Database schema and utilities
│   ├── storage/       # File storage utilities
│   └── typescript-config/ # Shared TypeScript configurations
└── compose.yml        # Docker Compose configuration
```

### Technology Stack

#### Frontend (Web App)

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Video Editor**: Custom-built editor with React Moveable and Resizable Panels
- **Authentication**: Better Auth

#### Backend Services

- **API Server**: Express.js with TypeScript
- **Video Processing**: Remotion for programmatic video generation
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: MinIO (S3-compatible object storage)
- **Authentication**: Better Auth with email integration (Resend)

#### Infrastructure

- **Containerization**: Docker with Docker Compose
- **Build System**: Turborepo for monorepo management
- **Package Manager**: pnpm
- **Database**: PostgreSQL 17
- **Object Storage**: MinIO

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or later)
- **npm** >= 7.0.0 (or **pnpm** 10.11.1 recommended)
- **Docker** and **Docker Compose** (for full stack deployment)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/minhtq05/presentation-generative-ai.git
   cd presentation-generative-ai
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files in the respective apps with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://video:video@localhost:5432/video"

   # Authentication
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_EMAIL=your-email@example.com
   RESEND_API_KEY=your-resend-api-key

   # API URLs
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_REMOTION_API_URL=http://localhost:3002/api

   # Storage (MinIO)
   MINIO_ROOT_USER=your-minio-user
   MINIO_ROOT_PASSWORD=your-minio-password
   ```

4. **Start development servers**

   ```bash
   pnpm run dev
   ```

   This will start:
   - Web app on `http://localhost:3000`
   - API server on `http://localhost:3001`
   - Remotion service on `http://localhost:3002`

### Production Deployment with Docker

1. **Start all services**

   ```bash
   docker compose up -d
   ```

   This will start:
   - **Web App**: `http://localhost:5000`
   - **API Server**: `http://localhost:3001`
   - **PostgreSQL**: `localhost:5432`
   - **MinIO Console**: `http://localhost:9001`

2. **Check service health**
   ```bash
   docker compose ps
   ```

## API Documentation

### Main Endpoints

- **Web Application**: Frontend interface for video editing
- **API Server** (`/api`): RESTful API for project management, media handling
- **Remotion Service** (`/api`): Video rendering and generation endpoints

### Key API Routes

- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/media/upload` - Upload media assets
- `POST /api/render` - Trigger video rendering

## Development Scripts

```bash
# Start development servers
pnpm run dev

# Build all applications
pnpm run build
```

## Project Structure Details

### `/apps/web` - Frontend Application

- **Dashboard**: Project management and user interface
- **Editor**: Video editing interface with timeline and tools
- **Authentication**: User registration and login
- **Components**: Reusable UI components built with Radix UI

### `/apps/api` - Backend API

- **Routes**: RESTful endpoints for projects and media
- **Middleware**: Authentication and request processing
- **Types**: TypeScript type definitions

### `/apps/remotion` - Video Rendering Service

- **Components**: Remotion video components
- **Animations**: Video transition and effect definitions
- **Rendering**: Video generation and export logic

### `/packages` - Shared Libraries

- **auth**: Authentication utilities and configuration
- **db**: Database schema, migrations, and ORM setup
- **storage**: File storage abstractions and utilities
- **typescript-config**: Shared TypeScript configurations

## Configuration

### Database Setup

The project uses PostgreSQL with Drizzle ORM. Database migrations and schema are managed in the `/packages/db` directory.

### File Storage

MinIO is used for object storage, providing S3-compatible APIs for media asset management.

### Authentication

Better Auth handles user authentication with email-based login and registration.

<!-- ## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request -->

<!-- ## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Remotion](https://remotion.dev/), and [Turborepo](https://turborepo.org/)
- UI components powered by [Radix UI](https://radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/)
- Authentication by [Better Auth](https://better-auth.com/)
- Database management with [Drizzle ORM](https://orm.drizzle.team/)

## Support

- **Documentation**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/minhtq05/presentation-generative-ai/issues)

---

**Made with ❤️ by [@minhtq05](https://github.com/minhtq05)**

_Transform your ideas into stunning videos with the power of artificial intelligence._
