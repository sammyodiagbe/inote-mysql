const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require("./utils/database");
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth-routes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(mainRoutes);
app.use("/auth", authRoutes);

app.use((req, res, next) => {
    res.render("404", { title: "Page not found" });
});

sequelize
    .sync()
    .then((result) => {
        app.listen(PORT, () => {
            console.log("connected");
        });
    })
    .catch((err) => console.log(err));
