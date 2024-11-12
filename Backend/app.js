// backend/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/review');
const recommendationRoutes = require('./routes/recommendation');
const customListRoutes = require('./routes/customList');
const searchRoutes = require('./routes/search'); // Import search routes

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/lists', customListRoutes);
app.use('/api/search', searchRoutes); // Register search routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
