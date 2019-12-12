const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const Session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(Session.Store);
const app = express();
const flash = require('connect-flash');


const PORT = process.env.PORT || 3000;
const sequelize = require("./utils/database");
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth-routes");
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(Session({
    secret: 'hey now brown cow',
    secure: true,
    resave: false,
    saveUninitialized:false,
    store: new SequelizeStore({
        db: sequelize
    })
}));
app.use(flash())
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(mainRoutes);
app.use("/auth", authRoutes);
app.use((req, res, next) => {
    req.url
    if(!req.session.user) {
        return next();
    }
    User.findOne({ id: req.session.user.id})
        .then((user) => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
});
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
