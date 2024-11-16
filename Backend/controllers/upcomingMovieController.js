// backend/controllers/upcomingMovieController.js
const UpcomingMovie = require('../models/upcomingMovie');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Add an upcoming movie (Admin only)
exports.addUpcomingMovie = async (req, res) => {
    try {
        const { title, genre, releaseDate, trailerLink, director, cast } = req.body;

        const newMovie = new UpcomingMovie({ title, genre, releaseDate, trailerLink, director, cast });
        await newMovie.save();
        res.status(201).json({ message: 'Upcoming movie added successfully', movie: newMovie });
    } catch (error) {
        console.error("Error adding upcoming movie:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all upcoming movies
exports.getUpcomingMovies = async (req, res) => {
    try {
        const movies = await UpcomingMovie.find().sort({ releaseDate: 1 });
        res.json(movies);
    } catch (error) {
        console.error("Error fetching upcoming movies:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Set a reminder for an upcoming movie
exports.setReminder = async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.user.id);

        const movie = await UpcomingMovie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        const alreadySet = movie.notifications.some(notif => notif.user.toString() === user.id);
        if (alreadySet) {
            return res.status(400).json({ message: 'Reminder already set for this movie' });
        }

        movie.notifications.push({ user: user.id, email: user.email });
        await movie.save();

        res.json({ message: 'Reminder set successfully' });
    } catch (error) {
        console.error("Error setting reminder:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send email notifications for upcoming movies
exports.sendNotifications = async () => {
    try {
        const upcomingMovies = await UpcomingMovie.find({
            releaseDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // Next 7 days
        });

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        for (const movie of upcomingMovies) {
            for (const notif of movie.notifications) {
                if (!notif.notified) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: notif.email,
                        subject: `Reminder: Upcoming Release - ${movie.title}`,
                        text: `The movie "${movie.title}" is releasing on ${new Date(movie.releaseDate).toDateString()}. Watch the trailer here: ${movie.trailerLink}`
                    };

                    try {
                        console.log(`Sending email to: ${notif.email}`);
                        await transporter.sendMail(mailOptions);
                        notif.notified = true; // Mark as notified
                        console.log(`Notification sent to: ${notif.email}`);
                    } catch (emailError) {
                        console.error(`Failed to send email to ${notif.email}:`, emailError.message);
                    }
                }
            }
            await movie.save(); // Save updates to notifications
        }

        console.log("Notifications sent successfully");
    } catch (error) {
        console.error("Error sending notifications:", error.message);
    }
};

exports.triggerNotifications = async (req, res) => {
    try {
        await exports.sendNotifications(); // Use exports to access the function
        res.json({ message: 'Notifications sent successfully' });
    } catch (error) {
        console.error("Error triggering notifications:", error.message);
        res.status(500).json({ message: 'Failed to send notifications' });
    }
};

