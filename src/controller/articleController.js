const joi = require("joi");
const ArticleModel = require("../model/articleModel");

const postArticle = async (req, res, next) => {
  try {
    // Extract file paths uploaded by Multer (if any)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path);
    }

    const newArticle = new ArticleModel({
      title: req.body.title,
      introduction: req.body.introduction,
      body: req.body.body,
      conclusion: req.body.conclusion,
      images: images, // Save array of image URLs/paths
      userId: req.user.userId,
    });

    await newArticle.save();

    return res.status(201).json({
      message: "Article created!",
      data: newArticle,
    });
  } catch (error) {
    next(error);
  }
};

const getAllArticle = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const articles = await ArticleModel.find({})
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("userId", "fullname username email avatar");

    return res.status(200).json({
      message: "Articles fetched",
      data: articles,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id).populate(
      "userId",
      "fullname username email avatar"
    );

    if (!article) {
      return res.status(404).json({
        message: `Article with ${req.params.id} not found`,
      });
    }

    return res.status(200).json({
      message: "Article Found",
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

const updateArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    if (!article.userId) {
      return res.status(400).json({
        message: "Article has no owner",
      });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // ownership check
    if (article.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "You can only update your own article",
      });
    }

    // Handle optional image updates
    let updatedData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.path);
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Article Updated",
      data: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};

const deleteArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    // ownership check
    if (article.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "You can only delete your own post/article",
      });
    }

    const deletedArticle = await ArticleModel.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      message: "Article Deleted Successfully",
      data: deletedArticle,
    });
  } catch (error) {
    next(error);
  }
};

const searchArticle = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search keyword is required",
      });
    }

    const articles = await ArticleModel.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { introduction: { $regex: q, $options: "i" } },
        { body: { $regex: q, $options: "i" } },
        { conclusion: { $regex: q, $options: "i" } },
      ],
    }).populate("userId", "fullname username email avatar");

    return res.status(200).json({
      message: "Article Search Completed",
      total: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postArticle,
  getAllArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
  searchArticle,
};