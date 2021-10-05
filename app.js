const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors')
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection succeed.");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //optional
app.use(cors())

app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});

app.use("/users", require("./routes/users"));
app.use("/mentees", require("./routes/mentees"));
app.use("/mentors", require("./routes/mentors"));
app.use("/connections", require("./routes/connections"));

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log("Server started listening on PORT: " + port);
});