const express = require('express');
const path = require('path');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

mongoose.connect("mongodb+srv://nish:" + process.env.MONGO_ATLAS_PWD + "@cluster0-y99uv.mongodb.net/test")
  .then(() => {
    console.log("Connect aagbittide");
  })

  .catch(() => {
    console.log("Connect aagilla");
  });

app.use(bodyParser.json());
app.use("/img", express.static(path.join("server/img")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/posts", postsRoutes);
app.use("/users", userRoutes);

module.exports = app;

