# Real-Time Chat Application

A production-ready real-time chat application built with Node.js, Express, MongoDB, Socket.IO, and React with Tailwind CSS.

## Features

- **User Authentication**: Secure Registration and Login using JWT.
- **Real-Time Messaging**: Instant message delivery using Socket.IO.
- **User Presence**: Real-time "user joined" notifications.
- **Chat History**: Complete chat history persisted in MongoDB.
- **Live Stats**: Real-time updates for total messages and registered users.
- **Responsive UI**: Modern, clean, and mobile-friendly design using Tailwind CSS.
- **Full CRUD**: Support for User profile management (via API).

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, bcryptjs.
- **Frontend**: React (Vite), Tailwind CSS, Socket.IO-client, Axios, Lucide React.

## Project Structure

```
chat-app/
ΓööΓöÇ backend/          # Node.js server
ΓööΓöÇ frontend/         # React application
ΓööΓöÇ README.md         # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas account or local MongoDB instance.

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd chat-app
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` folder based on `.env.example`.
   - Update `MONGO_URI` with your MongoDB connection string.

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   node server.js
   ```
   The server will run on `http://localhost:5000`.

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Environment Variables

### Backend (.env)
- `PORT`: Port for the server (default: 5000).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT signing.

## Testing the Features

1. **Registration**: Open the app and create a new account.
2. **Login**: Log in with your credentials.
3. **Chat**: Open the app in two different browser tabs/windows. Log in with different accounts and send messages to see real-time updates.
4. **Notifications**: When a new user logs in, a notification will appear for others.
5. **Stats**: Observe the "Total Users" and "Total Messages" counts update live.

## Code Quality

- **Separation of Concerns**: Backend organized into controllers, models, routes, and middleware.
- **Error Handling**: Proper validation and error responses on both ends.
- **Clean Code**: Well-commented and structured JavaScript/React code.
