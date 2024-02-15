const express = require("express");
const postController = require("../controllers/post.controller.js");
const checkAuthMiddleware = require("../middleware/check-auth.js");
const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, postController.save);
router.get("/:id", postController.show);
router.get("/", postController.showAll);
router.put("/:id", checkAuthMiddleware.checkAuth, postController.update);
router.delete("/:id", checkAuthMiddleware.checkAuth, postController.deleteById);

module.exports = router;