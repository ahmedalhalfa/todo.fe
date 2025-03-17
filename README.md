# Todo Application

A modern, full-featured todo application built with Next.js and TypeScript that helps users manage and organize their tasks effectively.

## Business Overview

### Purpose
This application provides a simple, intuitive platform for task management, enabling users to:
- Create, update, and delete tasks
- Mark tasks as complete
- Filter tasks by status (all, active, completed)
- Search for specific tasks
- Track task creation and completion dates

### Target Audience
- Individuals seeking a straightforward task management solution
- Teams needing a centralized platform for tracking tasks
- Anyone who wants to increase productivity through better task organization

### Key Features
- **User Authentication**: Secure login, registration, and account management
- **Task Management**: Full CRUD operations for tasks
- **Filtering and Search**: Easily find relevant tasks
- **Responsive Design**: Access from any device with an optimized experience
- **Intuitive UI**: Clean, modern interface built with the latest design patterns

## Technical Overview

### Architecture

#### Frontend
- **Framework**: Next.js 15.1.0 (React 19)
- **Language**: TypeScript
- **State Management**: React Hooks and Context API
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Custom JWT-based authentication with refresh token mechanism

#### Backend (API Interface)
- RESTful API integration using Axios
- JWT token-based authentication with automatic token refresh
- Error handling with meaningful error messages

### Key Dependencies
- **UI Components**: 
  - shadcn/ui components (@radix-ui/*)
  - Lucide React for icons
  - Tailwind CSS for styling
- **Form Handling**: 
  - React Hook Form
  - Zod for validation
- **Testing**: 
  - Jest
  - React Testing Library
- **Data Visualization**: 
  - Recharts (for potential analytics features)

### Project Structure
- `/app`: Main application pages and routes (Next.js App Router)
  - `/dashboard`: Main user dashboard displaying todos
  - `/todos`: Todo management pages (create, edit)
  - `/login`, `/register`, `/profile`: User account pages
- `/components`: Reusable UI components
- `/lib`: Utility functions and API services
  - `api.ts`: API client and type definitions
  - `auth-provider.tsx`: Authentication context and hooks
- `/hooks`: Custom React hooks
- `/styles`: Global styles and Tailwind configuration
- `/types`: TypeScript type definitions
- `/__tests__`: Test files

### Authentication Flow
1. User registers or logs in via email/password
2. Server validates credentials and returns access and refresh tokens
3. Access token is used for API requests
4. Refresh token is used to obtain a new access token when it expires
5. Tokens are stored in localStorage with appropriate security measures

### Data Models

#### User
```typescript
interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}
```

#### Todo
```typescript
interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- pnpm (package manager)

### Installation
1. Clone the repository
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Start the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing
```bash
# Run all tests
pnpm test

# Run tests with watch mode
pnpm test:watch

# Generate test coverage report
pnpm test:coverage
```

### Build for Production
```bash
pnpm build
pnpm start
```

## Future Enhancements
- Task categories/tags for better organization
- Due dates and reminders
- Task priorities
- Collaboration features for team task management
- Advanced analytics and progress tracking
- Mobile app versions

## License
[License information] 