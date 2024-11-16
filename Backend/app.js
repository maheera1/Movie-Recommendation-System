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
const searchRoutes = require('./routes/search'); 
const upcomingMovieRoutes = require('./routes/upcomingMovie');
const { sendNotifications } = require('./controllers/upcomingMovieController');
const newsArticleRoutes = require('./routes/newsArticle');
const discussionRoutes = require('./routes/discussion');
const adminRoutes = require('./routes/admin');
const cron = require('node-cron');

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
app.use('/api/search', searchRoutes); 
app.use('/api/upcoming', upcomingMovieRoutes);
app.use('/api/news', newsArticleRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/admin', adminRoutes);

// Schedule notification job
cron.schedule('0 8 * * *', async () => {
    console.log("Running daily notification job...");
    await sendNotifications();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
