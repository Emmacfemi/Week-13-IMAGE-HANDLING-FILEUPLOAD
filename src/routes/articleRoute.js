const express = require("express");

const route = express.Router();

const { 
    postArticle, 
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticle,
} = require("../controller/articleController");


const requireAuth = require("../middleware/requireAuthMiddleware");

const { 
    validatePost,
    validateUpdate
} = require("../validation/articleValidation");

const upload = require("../middleware/uploadMiddleware");



route.get("/home", (req, res) => {
    res.send(`BLOG API Class Begins`);
});

route.post("/", requireAuth, upload.array("images", 5), validatePost, postArticle);

route.get("/", requireAuth, getAllArticle);

route.get("/search", requireAuth, searchArticle);

route.get("/:id", requireAuth, getArticleById);

route.put("/:id", requireAuth, upload.array("images", 5), validateUpdate, updateArticleById);

route.delete("/:id", requireAuth, deleteArticleById);

module.exports = route;