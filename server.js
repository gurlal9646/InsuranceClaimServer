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
app.get("/", (request, response) => {
  response.status(200).send("API is running");
})

app.use("/api", apiRouter);


app.use((req, res, next) => {
  res.render("404");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
