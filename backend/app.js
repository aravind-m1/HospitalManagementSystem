const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patient');
const auth = require('./middleware/auth');
const app = express();

// Security middleware
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const password = encodeURIComponent('Aravind@1');
const uri = process.env.MONGODB_URI || `mongodb+srv:
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/admin', auth, adminRoutes);
app.use('/api/doctor', auth, doctorRoutes);
app.use('/api/patient', auth, patientRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 