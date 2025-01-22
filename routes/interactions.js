import express from 'express';
const router = express.Router();
import interactionsController from '../controllers/interactionsController.js';

router.post('/:articleId/like', interactionsController.likeArticle);
router.delete('/:articleId/unlike', interactionsController.unlikeArticle);

router.post('/:articleId/bookmark', interactionsController.bookmarkArticle);
router.delete('/:articleId/unbookmark', interactionsController.unbookmarkArticle);

router.get('/:articleId/bookmark', interactionsController.getUserBookmarks);

router.post('/:articleId/comments', interactionsController.addComment);
router.get('/:articleId/comments', interactionsController.getComments);

export default router;
