const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

// Order matters - in middle wares
app.use(bodyParser.urlencoded({ extended: false })); // In node js we have to do with the CHUNKS and the BUFFER
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, ".", "Views", "404.html"));
});

app.listen(3000);

// use() - to use the middlewares
// next(); // allow request to travel on the next middleware
