const express = require("express");
const router = express.Router();
 const authMiddleware = require('../middlewares/authMiddleware.js')
const {
    index,
    showBySlug,
    create,
    update,
    destroy
} = require('../controllers/postController.js');
const validator = require('../middlewares/validator.js');
const { postData } = require('../validations/postValidation.js');
const uniqueSlug = require('../middlewares/uniqueSlug.js');

router.post("/", uniqueSlug,authMiddleware, validator(postData), create);
router.get("/:slug",authMiddleware, showBySlug);
router.get("/",authMiddleware, index);
router.put("/:slug",authMiddleware, validator(postData), update);
router.delete("/:slug", authMiddleware, destroy);

module.exports = router;
