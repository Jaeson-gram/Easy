import Article from '../models/Article.js';
import Writer from '../models/Writer.js';

// Like an article
const likeArticle = async (req, res) => {
  const articleId = req.params.id;
  const userId = req.user._id;

  try {
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (article.meta.likes.includes(userId)) {
      return res.status(400).json({ message: 'Article already liked' });
    }

    article.meta.likes.push(userId);
    await article.save();
    res.status(200).json({ message: 'Article liked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike an article
const unlikeArticle = async (req, res) => {
  const articleId = req.params.id;
  const userId = req.userId;

  try {
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const likeIndex = article.meta.likes.indexOf(userId);
    if (likeIndex === -1) {
      return res.status(400).json({ message: 'Article is not liked by the user' });
    }

    article.meta.likes.splice(likeIndex, 1);
    await article.save();

    res.status(200).json({ message: 'Article unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Bookmark an article
const bookmarkArticle = async (req, res) => {
  const articleId = req.params.id;
  const userId = req.user._id; 

  try {
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const user = await User.findById(userId);
    if (user.bookmarks.includes(articleId)) return res.status(400).json({ message: 'Article already bookmarked' });

    user.bookmarks.push(articleId);
    article.meta.bookmarks++;
    await user.save();
    await article.save();

    res.status(200).json({ message: 'Article bookmarked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unbookmarkArticle = async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;

    const user = await User.findById(userId);
    const article = await Article.findById(articleId);

    if (!user || !article) {
      return res.status(404).json({ message: 'User or article not found' });
    }

    // Check if the article is already bookmarked
    if (user.bookmarkedArticles.includes(articleId)) {
      // Remove the article from the user's bookmarks
      user.bookmarkedArticles = user.bookmarkedArticles.filter(
        (id) => id.toString() !== articleId
      );
      await user.save();

      // Decrement the bookmark count for the article
      article.meta.bookmarks -= 1;
      await article.save();
    }

    res.status(200).json({
      message: 'Bookmark removed successfully',
      bookmarkCount: article.meta.bookmarks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookmarked articles by user
const getUserBookmarks = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate('bookmarks', 'title body author categories');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment
const addComment = async (req, res) => {
  const articleId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;

  try {
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const comment = { user: userId, content, date: new Date.now() };
    article.comments.push(comment);
    await article.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for an article
 const getComments = async (req, res) => {
  const articleId = req.params.id;

  try {
    const article = await Article.findById(articleId).populate('comments.user', 'name profileImage');
    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.status(200).json(article.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { likeArticle, unlikeArticle, bookmarkArticle, unbookmarkArticle, getUserBookmarks, addComment, getComments };

 