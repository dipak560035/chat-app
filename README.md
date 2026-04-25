# Real-Time Chat Application

A full-stack real-time chat application built with Node.js, Express, MongoDB, Socket.IO, and React (Vite) with Tailwind CSS. The application demonstrates authentication, real-time communication, and persistent chat storage.

---

## Features

* User authentication using JWT (register and login)
* Real-time messaging using Socket.IO
* User join notifications
* Chat history stored in MongoDB
* API for total users and total messages
* User CRUD operations via backend APIs
* Responsive UI built with Tailwind CSS

---

## Tech Stack

### Backend

* Node.js
* Express
* MongoDB (Mongoose)
* Socket.IO
* JSON Web Token (JWT)
* bcrypt

### Frontend

* React (Vite)
* Tailwind CSS
* Socket.IO Client
* Axios

---

## Project Structure

```
chat-app/
 ├── backend/
 ├── frontend/
 ├── README.md
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/dipak560035/chat-app.git
cd chat-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## Run the Application

### Start Backend

```bash
cd backend
node server.js
```

Backend runs on:
http://localhost:5000

---

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:
http://localhost:5173

---

## Environment Variables

Create `.env.example` in backend:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

## Testing

* Register a new user
* Login using credentials
* Open multiple browser tabs to simulate multiple users
* Send messages and observe real-time updates
* Verify messages are stored in MongoDB
* Test user CRUD APIs using Postman

---

## Notes

* User CRUD operations are implemented and tested using API endpoints.
* Frontend focuses on real-time chat and event handling as required.
* Sensitive data such as database credentials are stored securely in environment variables.

---

## Author

Dipak Sah
