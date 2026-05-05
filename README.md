# Voting Poll App

A full-featured voting poll application built with React, Firebase Authentication, JSON Server, and Tailwind CSS.

## Features

- 🔐 **Firebase Authentication** - Email/password login and registration
- 🗳️ **One Vote Per User** - Secure voting with user tracking via JSON Server
- 📊 **Live Results** - Real-time vote counts and percentage bars
- 💾 **JSON Server Backend** - All data persisted on JSON Server (no localStorage)
- 🔄 **Reset Functionality** - Clear all votes back to zero
- ⚡ **Lazy Loading** - Code-split pages for optimal performance
- 📱 **Responsive Design** - Works on mobile and desktop
- 🎨 **Modern UI** - Built with Tailwind CSS using Indigo, Purple, and Pink

## Tech Stack

- React 18 + Vite
- React Router DOM (with lazy loading)
- Firebase Authentication
- JSON Server (mock REST API)
- Tailwind CSS
- Axios
- React Toastify

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Email/Password authentication in Authentication > Sign-in method
4. Get your config from Project Settings > General > Your apps
5. Replace the values in `.env` file

### 3. Start JSON Server
```bash
npm run server
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## Project Structure

```
voting-poll-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── PollForm.jsx
│   │   ├── PollList.jsx
│   │   ├── PollOption.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── LoadingSpinner.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── firebase/
│   │   └── config.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Polls.jsx
│   ├── App.jsx
│   └── main.jsx
├── db.json
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
└── README.md
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder

### JSON Server (Render/Railway)
Deploy `db.json` with json-server on a hosting platform.

## Team Members

- [Member 1]
- [Member 2]
- [Member 3]
- [Member 4]
