const express = require("express");
const postRouter = require("./routers/postRouter.js");
const categoryRouter = require ('./routers/categoryRouter.js')
const tagRouter = require('./routers/tagRouter.js');
const app = express();
const errorHandler = require("./middlewares/errorHandler.js");
const notFound = require("./middlewares/notFound.js");


require("dotenv").config();
const {PORT} = process.env;
const port = PORT || 3000;

app.use(express.json());



app.use('/posts', postRouter);
app.use('/category', categoryRouter)
app.use('/tag', tagRouter)
app.use(notFound);

app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});