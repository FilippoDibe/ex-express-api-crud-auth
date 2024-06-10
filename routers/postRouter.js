const express = require("express");
const router = express.Router();

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

router.post("/", uniqueSlug, validator(postData), create);
router.get("/:slug", showBySlug);
router.get("/", index);
router.put("/:slug", validator(postData), update);
router.delete("/:slug", uniqueSlug, destroy);

module.exports = router;
