import { request, response } from "express";
import Writer from "../models/Writer.js";
import Article from "../models/Article.js";

//  ---   API ENDPOINTS ---
//create article
const postArticle = async (request, response) => {
  try {
    const writerId = request.body.writerId;

    // const { title, imageURL, body, categories } = request.body;

    if (!request.body.writerId || !request.body.title || !request.body.body || !request.body.categories) {
      const error = new Error(
        "what's an article without a title, and a content? Please add at least one category, too. Oh, and writer id"
      );
      error.status = 400;
      return next(error);
    }

    const article = await Article({
      writer: writerId,
      title: request.body.title,
      body: request.body.body,
      imageURL: request.body.imageURL,
      categories: request.body.categories,
      date: Date.now(), //use date formatting tool
      meta: { likes: 0, bookmarks: 0 },
    });

    // Find the writer by their ID to ensure they exist
    const writer = await Writer.findById(writerId);

    if (!writer) {
      const error = new Error("Writer not found.");
      error.status = 404;
      return next(error);
    }

    const savedArticle = await article.save();

    await Writer.findByIdAndUpdate(
      writerId,
      { $push: { articles: savedArticle._id } },
      { new: true }
    );

    response
      .status(201)
      .json({ msg: "article created successfully", data: savedArticle });
  } catch (err) {
    response
      .status(500)
      .json({ msg: "oopsie. we encountered an error", error: err.message });
  }
};

//get all articles
const getAllArticles = async (request, response, next) => {
  try {
    const articles = await Article.find()
      .populate("writer", "name profileImage")
      .populate("comments.commentator", "name profileImage"); // Populate commentator details

    response.status(200).json(articles);
  } catch (error) {
    response.status(500).json({
      msg: "sorry we couldn't retrieve articles at this time :(",
      error,
    });
  }
};

//get articles by author name
const getArticlesByAuthor = async (request, response) => {
  try {
    const writerName = request.params.name;

    // const authors = await Author.find({name: authorName});

    // case insensitive
    const writers = await Writer.find({
      name: { $regex: new RegExp(`^${authorName}$`, "i") },
    });

    if (writers.length === 0) {
      return response
        .status(400)
        .json({ msg: "No writers found with that name" });
    }

    //extractign author ids
    const writerIds = writers.map((author) => writer._Id);

    //finding all articles associated to these writers
    const articlces = await Article.find(
      { writerId: { $in: writerIds } }.polulate("writer", "name profileImage")
    ).populate("comments.commentator", "name profileImage"); // Populate commentator details
    response.status(200).json(articlces);
  } catch (error) {
    response.status(500).json({
      msg: "sorry, we couldn't get your articles at this time :(",
      error,
    });
  }
};

//get articles by title
const getArticleByTitle = async (request, response) => {
  try {
    const articleTitle = request.params.title;

    //fetching articles by title
    const articles = await Article.find({
      title: { $regex: new RegExp(`^${articleTitle}$`, "i") },
    })
      .populate("writer", "name profileImage")
      .populate("comments.commentator", "name profileImage"); // Populate commentator details
    if (!articles.length) {
      return response
        .status(404)
        .json({ msg: "No articles found with this title" });
    }

    response.status(200).json(articles);
  } catch (error) {
    response.status(500).json({
      msg: "sorry, we couldn't get your articles at this time :(",
      error,
    });
  }
};

//get articles by category
const getArticlesByCategory = async (request, response) => {
  try {
    const { categories } = request.query;
    const categoryArray = categories.split(",").map((cat) => RegExp(cat, "i"));

    //fetching the articles in the categor(y/ies)...
    const articles = await Article.find({
      categories: { $regex: new RegExp(`^${categoryArray}$`, "i") },
    })
      .populate("writer", "name profileImage")
      .populate("comments.commentator", "name profileImage"); // Populate commentator details
    if (!articles.length) {
      return response
        .status(404)
        .json({ msg: "Kudos! you searched for the world's rarest categories" });
    }

    response.status(200).json(articles);
  } catch (error) {
    response.status(500).json({
      msg: "sorry, we couldn't get your articles at this time :(",
      error,
    });
  }
};

export default {
  postArticle,
  getAllArticles,
  getArticlesByAuthor,
  getArticleByTitle,
  getArticlesByCategory,
};
