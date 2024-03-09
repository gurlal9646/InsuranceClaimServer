require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors());

app.set("view engine", "ejs");

app.use("/images", express.static("./assets/images"));

app.use("/css", express.static("./assets/styles"));

// Import routers

const apiRouter = require("./routes/api");


// Mount routers

app.use("/api", apiRouter);


app.use((req, res, next) => {
  // Option 1: Send a simple 404 message

  res.render("404");

  // Option 2: Render a custom 404 page (if using a view engine)

  // res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
