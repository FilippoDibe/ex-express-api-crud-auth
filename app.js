const express = require("express");
const postRouter = require("./routers/postRouter.js");
const categoryRouter = require ('./routers/categoryRouter.js');
const tagRouter = require('./routers/tagRouter.js');
// const authRouter =require ('./routers/authRouter.js');
const app = express();
const errorHandler = require("./middlewares/errorHandler.js");
const notFound = require("./middlewares/notFound.js");
const cors = require("cors");
// const authMiddleware = require('./middlewares/authMiddleware.js'); 



require("dotenv").config();
const {PORT, HOST} = process.env;
const port = PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());


app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/category', categoryRouter);
app.use('/tag', tagRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server attivo su ${HOST}:${port}`);
});