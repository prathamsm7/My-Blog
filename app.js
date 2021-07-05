require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const seedDB = require("./seed");
const User = require("./models/user");

//Routes
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");

//DB Connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connected .....");
  })
  .catch((err) => {
    console.log(err);
    console.log("Somethig Went Wrong With Db ");
  });

// seedDB();

const sessionConfig = {
  secret: "ThisIsMySecret",
  resave: false,
  saveUninitialized: true,
};

//Middlewere
app.use(session(sessionConfig));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Routes
app.use(blogRoutes);
app.use(authRoutes);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});
