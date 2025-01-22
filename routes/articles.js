import express, { response } from "express";
import Article from "../models/Article.js";
import articlesController from '../controllers/articlesController.js'
import { verifyToken } from '../controllers/writersController.js';


const router = express.Router();

// Get all articles
router.get('/', articlesController.getAllArticles);

// Get articles by author name
router.get('/author/:name', articlesController.getArticlesByAuthor);

// Get articles by title
router.get('/title/:title',articlesController.getArticleByTitle);

// Get articles by category
router.get('/categories/:category',articlesController.getArticlesByCategory);

// Post a new article
router.post('/', articlesController.postArticle);

export default router;
