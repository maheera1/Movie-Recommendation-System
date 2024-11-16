const Discussion = require('../models/Discussion');

// Create a new discussion
exports.createDiscussion = async (req, res) => {
    try {
        const { topic, description, associatedType, associatedId } = req.body;

        const discussion = new Discussion({
            topic,
            description,
            user: req.user.id,
            associatedType,
            associatedId
        });

        await discussion.save();
        res.status(201).json({ message: 'Discussion created successfully', discussion });
    } catch (error) {
        console.error("Error creating discussion:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch all discussions
exports.getAllDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(discussions);
    } catch (error) {
        console.error("Error fetching discussions:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a comment to a discussion
exports.addComment = async (req, res) => {
    try {
        const { discussionId } = req.params;
        const { content } = req.body;

        // Find the discussion
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        // Create a new comment
        const comment = {
            user: req.user.id, // Authenticated user ID
            content,
            likes: 0,
            likedBy: [],
            replies: []
        };

        // Add the comment to the discussion's comments array
        discussion.comments.push(comment);
        await discussion.save();

        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Fetch comments for a discussion
exports.getComments = async (req, res) => {
    try {
        const { discussionId } = req.params;

        // Find the discussion by ID and populate comments
        const discussion = await Discussion.findById(discussionId)
            .populate('comments.user', 'username'); // Populate user details (optional)

        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        // Return the comments array
        res.json(discussion.comments);
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Like a comment in a discussion
exports.likeComment = async (req, res) => {
    try {
        const { discussionId, commentId } = req.params;
        const userId = req.user.id;

        // Fetch the discussion
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        // Find the comment in the discussion
        const comment = discussion.comments.find(comment => comment._id.toString() === commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Check if the user has already liked the comment
        if (comment.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this comment' });
        }

        // Add a like and update likedBy
        comment.likes += 1;
        comment.likedBy.push(userId);

        // Save the updated discussion
        await discussion.save();

        res.json({ message: 'Comment liked successfully', comment });
    } catch (error) {
        console.error("Error liking comment:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// Reply to a comment in a discussion
exports.replyToComment = async (req, res) => {
    try {
        const { discussionId, commentId } = req.params;
        const { content } = req.body;

        // Fetch the discussion
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

        // Find the comment in the discussion
        const comment = discussion.comments.find(comment => comment._id.toString() === commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Add the reply
        const reply = {
            user: req.user.id,
            content,
            createdAt: new Date()
        };
        comment.replies.push(reply);

        // Save the updated discussion
        await discussion.save();

        res.status(201).json({ message: 'Reply added successfully', reply });
    } catch (error) {
        console.error("Error replying to comment:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

