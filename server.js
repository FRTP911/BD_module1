require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const carRoutes = require('./routes/carRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();

// Підключення БД
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/cars', carRoutes);

// Обробка помилок
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
});