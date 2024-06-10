const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const validator = require("../middlewares/validator.js");
const {register, login} = require ("../controllers/authController.js");
const { registerBody, loginBody } = require('../validations/usersValidation.js');

const storage = multer.diskStorage({
    destination: "public/profile_pics",
    filename: (req, file, cf) => {
        const fileType = path.extname(file.originalname);
        cf(null, String(Date.now()) + fileType)
    }
});
const upload = multer({storage});

//registrazione 
router.post('/register', [
    upload.single("profile_pic"),
    validator(registerBody),
], register);

//autenticazione 
router.post('/login', validator(loginBody), login)

module.exports = router;