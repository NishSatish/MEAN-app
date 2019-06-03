const express = require("express");
const checkAuth = require("../middleware/check-auth");
const PostsController = require("../controllers/post");
const extractFile = require("../middleware/multer-middleware");

const router = express.Router();

//To save post
router.post("", checkAuth, extractFile, PostsController.savePost);

//To edit posts
router.put("/:id", checkAuth, extractFile, PostsController.editPost);

//To get posts to show
router.get('', PostsController.fetchPosts);

//To get information about a post
router.get("/:id", PostsController.getPost);

//To delete a post
router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
