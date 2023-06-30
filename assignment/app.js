const express = require("express")

const app = express();

const mainRoutes = require("./routes/user")
const userRoutes = require("./routes/user")

app.set("view engine","pug")
app.use(mainRoutes)
app.use(userRoutes)

app.listen(3000);