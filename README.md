<<<<<<< HEAD
# Smart e-Waste Collection and Management System

A comprehensive digital platform connecting users with efficient and eco-friendly e-waste disposal services.

## Features

- **Role-Based Access Control**: Secure authentication for Users and Admins using JWT
- **Request Management**: Users can submit pickup requests with device details and images
- **Automated Scheduling**: Admins can assign pickup dates and personnel with email notifications
- **Real-Time Tracking**: User-friendly dashboard displaying request status (Pending, Approved, Scheduled)

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Nodemailer for email notifications

### Frontend
- React.js
- React Router
- Axios for API calls
- Modern UI with CSS

## Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Create a `.env` file in the root directory (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ewaste
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

3. Make sure MongoDB is running on your system. If using MongoDB Atlas, update `MONGODB_URI` with your connection string.

4. Initialize the admin user:
```bash
npm run init-admin
```

5. Run the application:
```bash
npm run dev
```

The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000`

## Default Admin Credentials

After running `npm run init-admin`, you can login with:
- Email: admin@ewaste.com
- Password: admin123

**⚠️ Important:** Change these credentials in production!

## Email Configuration

For email notifications to work, configure your email in `.env`:
- For Gmail: Use an App Password (not your regular password)
- Enable 2-factor authentication and generate an App Password
- Set `EMAIL_USER` to your Gmail address
- Set `EMAIL_PASS` to the generated App Password

## Project Structure

```
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── index.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── public/
└── uploads/
```

=======
# Smart-EWaste-Management-System
Smart E-Waste collection and management platform with secure authentication, pickup request handling, real-time tracking, and admin dashboard using Full Stack.
>>>>>>> b80e61453b7e5ec590ad09532df02a29aca80502
