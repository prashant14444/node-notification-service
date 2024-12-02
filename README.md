
# Notification Service

A simple notification service built with Node.js, Express, PostgreSQL, and Socket.IO, enabling user registration, authentication, and real-time notifications.

## Features
- User registration and login with JWT-based authentication.
- Notifications sent in real-time to online users using Socket.IO.
- Notifications stored in PostgreSQL for offline users to retrieve later.
- API endpoints to retrieve and update notifications status.

---

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v22)
- **PostgreSQL** (v17 or later)
- **Docker** (I am using v4)

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/prashant14444/node-notification-service.git
cd node-notification-service
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up the Environment
Create a `.env` file in the project root and configure the following environment variables:
```env
PORT=3000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=notification_service
```

### 4. Configure the Database (optional)
Create a database same as you provided in the .env file then you can move to the next line but it is optional. Once you run the server the database tables will be automatically created and synced.


Run the following SQL commands in your PostgreSQL instance to create the necessary tables:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    senderId INT REFERENCES users(id),
    receiverId INT REFERENCES users(id),
    message VARCHAR(255) NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT NOW()
);
```

Alternatively, use Docker for database setup (see below).

---

## Running the Application

### 1. Start the Server
```bash
npm start
```

### 2. Start in Development Mode
```bash
npm run dev
```

The server will start at `http://localhost:3000`.

---

## API Documentation

### **User Registration**
- **Endpoint:** `POST /users/register`
- **Request Body:**
  ```json
  {
    "username": "user123",
    "password": "password123"
  }
  ```
- **Response:** `201 Created`

### **User Login**
- **Endpoint:** `POST /users/login`
- **Request Body:**
  ```json
  {
    "username": "user123",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

### **Send Notification**
- **Endpoint:** `POST /notifications/send`
- **Headers:** `Authorization: Bearer <JWT>`
- **Request Body:**
  ```json
  {
    "senderId": 1,
    "receiverId": 2,
    "message": "Hello from user123"
  }
  ```
- **Response:** `200 OK`

### **Get Notifications**
- **Endpoint:** `GET /notifications`
- **Headers:** `Authorization: Bearer <JWT>`
- **Response:**
  ```json
  {
    "notifications": [
      {
        "id": 3,
        "senderId": 1,
        "receiverId": 2,
        "message": "Hope you are doing well",
        "isRead": false,
        "createdAt": "2024-12-02T18:34:47.890Z",
        "updatedAt": "2024-12-02T18:34:47.890Z"
      },
      {
        "id": 2,
        "senderId": 1,
        "receiverId": 2,
        "message": "Hello from Prashant again , \n Congratulations! You have created a Fake Text Message! Now you can go and share it with the world: Congratulations!",
        "isRead": false,
        "createdAt": "2024-12-02T18:34:35.238Z",
        "updatedAt": "2024-12-02T18:34:35.238Z"
      },
      {
        "id": 1,
        "senderId": 1,
        "receiverId": 2,
        "message": "Hello from Prashant ",
        "isRead": false,
        "createdAt": "2024-12-02T18:34:29.946Z",
        "updatedAt": "2024-12-02T18:34:29.946Z"
      }
    ],
    "total": 3,
    "currentPage": 1,
    "totalPages": 1
  }
  ```

### **Mark Notification as Read**
- **Endpoint:** `PUT /notifications/:id/read`
- **Headers:** `Authorization: Bearer <JWT>`
- **Response:** `200 OK`

---

## Real-Time Notifications
- Real-time notifications are sent via WebSocket using Socket.IO.
- Users receive notifications in real-time when online.
- Offline notifications are stored in the database for later retrieval.

---

## Running with Docker
1. Build and start the app and database using Docker Compose:
   ```bash
   docker-compose up --build
   ```
2. Access the server at `http://localhost:3000`.

---

## License
This project is licensed under the MIT License.

---

## Contact
For issues or inquiries, contact [your email](mailto:your-email@example.com). 
