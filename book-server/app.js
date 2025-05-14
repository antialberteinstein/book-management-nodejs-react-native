require('dotenv').config();

const cors = require("cors");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const port = 7749

const indexUser = require("./routes/index");
const booksManager = require("./routes/books");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use('/api/v1/user', indexUser)
app.use('/api/v1/book', booksManager)

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});

var mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL,
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
    process.exit();
});

