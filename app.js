const bodyParser = require("body-parser")
const express = require("express")
const ejs = require("ejs")
const port = process.env.PORT || 8080;

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set("view engine", "ejs")
app.set("views", "./src/views")

// main page
app.get("/", (req, res, next) => {
    res.render("index")
})

app.get("/temp", (req, res, next) => {
    res.render("sheets")
})

// safety net route
app.get("*", function (req, res) {
    res.redirect("/")
})

app.listen(port, (err) => {
    console.log("analytics2sheets server is running on port " + port);
});