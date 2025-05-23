# Hospital Management System

A comprehensive hospital management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This system helps hospitals manage their operations efficiently, including patient records, appointments, doctor schedules, and medical histories.

## Features

- Multi-user authentication (Admin, Doctor, Patient)
- Appointment scheduling and management
- Patient medical records management
- Doctor availability management
- Prescription management
- Medical history tracking
- Responsive design for all devices
- Secure authentication and authorization
- Real-time updates

## Tech Stack

- Frontend:
  - React.js
  - Material-UI
  - Redux for state management
  - Axios for API calls
  - React Router for navigation

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone [your-repo-link]
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
Create .env file in backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Start the application
```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd frontend
npm start
```

## Usage

1. Admin Portal:
   - Manage doctors and patients
   - View and manage appointments
   - Generate reports
   - System configuration

2. Doctor Portal:
   - View appointments
   - Manage schedule
   - Write prescriptions
   - View patient history

3. Patient Portal:
   - Book appointments
   - View medical history
   - Download prescriptions
   - Update profile

## Deployment

The application can be deployed using various platforms:

- Frontend: Vercel, Netlify, or Firebase Hosting
- Backend: Railway, Heroku, or DigitalOcean
- Database: MongoDB Atlas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/hospital-management-system](https://github.com/yourusername/hospital-management-system)