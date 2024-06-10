const express = require("express");
const router = express.Router();
const {
    create,
    index,
    show,
    update,
    destroy
} = require('../controllers/tagController.js');
const validator = require('../middlewares/validator.js');
const { tagData } = require('../validations/tagValidations.js');

router.post("/", validator(tagData), create);
router.get("/", index);
router.get("/:id", show);
router.put("/:id", validator(tagData), update);
router.delete("/:id", destroy);

module.exports = router;
