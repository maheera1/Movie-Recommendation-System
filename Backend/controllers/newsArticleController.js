const NewsArticle = require('../models/NewsArticle');

// Fetch all articles (Public)
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await NewsArticle.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(articles);
    } catch (error) {
        console.error("Error fetching articles:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch a single article by ID (Public)
exports.getArticleById = async (req, res) => {
    try {
        const { articleId } = req.params;
        const article = await NewsArticle.findById(articleId);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (error) {
        console.error("Error fetching article:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new article (Admin only)
exports.addArticle = async (req, res) => {
    try {
        const { title, content, author, tags } = req.body;
        const newArticle = new NewsArticle({ title, content, author, tags });
        await newArticle.save();
        res.status(201).json({ message: 'Article added successfully', article: newArticle });
    } catch (error) {
        console.error("Error adding article:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an article (Admin only)
exports.updateArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const updatedArticle = await NewsArticle.findByIdAndUpdate(
            articleId,
            req.body,
            { new: true }
        );
        if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });
        res.json({ message: 'Article updated successfully', article: updatedArticle });
    } catch (error) {
        console.error("Error updating article:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an article (Admin only)
exports.deleteArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const deletedArticle = await NewsArticle.findByIdAndDelete(articleId);
        if (!deletedArticle) return res.status(404).json({ message: 'Article not found' });
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error("Error deleting article:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
