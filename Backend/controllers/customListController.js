// backend/controllers/customListController.js
const CustomList = require('../models/CustomList');

// Create a new custom list
exports.createCustomList = async (req, res) => {
    try {
        const { title, description, movies } = req.body;

        const newList = new CustomList({
            title,
            description,
            user: req.user.id,
            movies
        });

        await newList.save();
        res.status(201).json({ message: 'List created successfully', list: newList });
    } catch (error) {
        console.error("Error creating custom list:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all lists (public access)
exports.getAllLists = async (req, res) => {
    try {
        const lists = await CustomList.find().populate('user', 'username').populate('movies', 'title');
        res.json(lists);
    } catch (error) {
        console.error("Error fetching lists:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Follow/Save a list
exports.followList = async (req, res) => {
    try {
        const { listId } = req.params;
        const userId = req.user.id;

        const list = await CustomList.findById(listId);
        if (!list) return res.status(404).json({ message: 'List not found' });

        // Check if the user already follows the list
        if (list.followers.includes(userId)) {
            return res.status(400).json({ message: 'You already follow this list' });
        }

        list.followers.push(userId);
        await list.save();

        res.json({ message: 'List followed successfully', followersCount: list.followers.length });
    } catch (error) {
        console.error("Error following list:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Unfollow/Unsave a list
exports.unfollowList = async (req, res) => {
    try {
        const { listId } = req.params;
        const userId = req.user.id;

        const list = await CustomList.findById(listId);
        if (!list) return res.status(404).json({ message: 'List not found' });

        // Check if the user actually follows the list
        const followIndex = list.followers.indexOf(userId);
        if (followIndex === -1) {
            return res.status(400).json({ message: 'You do not follow this list' });
        }

        list.followers.splice(followIndex, 1);
        await list.save();

        res.json({ message: 'List unfollowed successfully', followersCount: list.followers.length });
    } catch (error) {
        console.error("Error unfollowing list:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get lists created by a specific user
exports.getUserLists = async (req, res) => {
    try {
        const { userId } = req.params;
        const userLists = await CustomList.find({ user: userId }).populate('movies', 'title');
        res.json(userLists);
    } catch (error) {
        console.error("Error fetching user lists:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
