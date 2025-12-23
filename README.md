# Project Management Platform


## Key Features

### Frontend
- **Interactive Kanban Boards**: Effortless drag-and-drop task management using `React DnD`.
- **Project Analytics**: Real-time dashboards showing task distribution, project progress, and priority metrics.
- **Unified Workspaces**: Create and organize multiple workspaces for different teams or clients.
- **Activity Tracking**: Live feed of recent activities and updates within projects.
- **Premium UI/UX**: Responsive design with elegant animations, glassmorphism, and a high-end aesthetic.
- **Lazy Loading**: Branded splash screen experience during initial app hydration.

### Backend 
- **Secure Auth**: JWT-based authentication with bcrypt password hashing.
- **Relational Data**: Powered by **Sequelize ORM** for reliable data management.
- **Comprehensive APIs**: RESTful endpoints for workspaces, projects, tasks, and activity logs.
- **Automated Logging**: Automatic interceptors for tracking changes across the platform.

---
##  Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit (RTK Query)](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Drag & Drop**: [React DnD](https://react-dnd.github.io/react-dnd/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: [JSON Web Tokens (JWT)](https://jwt.io/)

##  Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   DATABASE_URL=your_postgres_url
   JWT_SECRET=your_secret_key
   PORT=8000
   ```
4. Start the development server:
   ```bash
   npm run server
   ```

###  Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```


