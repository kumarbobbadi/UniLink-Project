# UniLink – University Student Networking Platform

A full-stack MERN application for university students to connect, post, join groups, and register for events.

## Project Structure

```
UniLink-Project/
├── backend/                  # Node.js + Express + MongoDB API
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── connectionController.js
│   │   ├── eventController.js
│   │   ├── groupController.js
│   │   ├── postController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Connection.js
│   │   ├── Event.js
│   │   ├── Group.js
│   │   ├── Post.js
│   │   ├── Profile.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── connectionRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── postRoutes.js
│   │   └── profileRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                 # React + Vite + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Connections.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Events.jsx
    │   │   ├── Groups.jsx
    │   │   ├── Login.jsx
    │   │   ├── Profile.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
cd UniLink-Project/backend

# Copy and fill in environment variables
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, PORT

# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:5000
```

---

### 2. Frontend Setup

```bash
cd UniLink-Project/frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:3000
```

---

### 3. Create Admin Account

Register normally via the UI with role = `admin`, OR manually update a user in MongoDB:

```js
db.users.updateOne({ email: "admin@uni.edu" }, { $set: { role: "admin" } })
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/profile/me | ✓ | Get own profile |
| PUT | /api/profile/update | ✓ | Update profile |
| GET | /api/posts | ✓ | Get all posts |
| POST | /api/posts/create | ✓ | Create post |
| PUT | /api/posts/:id/like | ✓ | Like/unlike post |
| POST | /api/posts/:id/comment | ✓ | Comment on post |
| DELETE | /api/posts/:id | ✓ | Delete post |
| POST | /api/connections/send | ✓ | Send connection request |
| PUT | /api/connections/accept | ✓ | Accept connection |
| GET | /api/connections | ✓ | Get all connections |
| GET | /api/groups | ✓ | Get all groups |
| POST | /api/groups/create | ✓ | Create group |
| POST | /api/groups/join | ✓ | Join group |
| GET | /api/events | ✓ | Get approved events |
| POST | /api/events/create | ✓ | Submit event |
| POST | /api/events/register | ✓ | Register for event |
| GET | /api/admin/users | Admin | List all users |
| DELETE | /api/admin/user/:id | Admin | Delete user |
| GET | /api/admin/pending-events | Admin | Pending events |
| POST | /api/admin/approve-event | Admin | Approve event |

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, React Toastify
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, express-validator
- **Database**: MongoDB
