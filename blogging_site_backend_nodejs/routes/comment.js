const express = require('express');
const commentController = require('../controllers/comment.controller.js');
const checkAuthMiddleware = require("../middleware/check-auth.js");
const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, commentController.save);
router.get("/", commentController.showAll);
router.get("/:id", commentController.show);
router.put("/:id", checkAuthMiddleware.checkAuth, commentController.update);
router.delete("/:id", checkAuthMiddleware.checkAuth, commentController.deleteById);

module.exports = router;