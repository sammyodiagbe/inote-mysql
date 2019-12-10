const Express = require("express");
const bodyParser = require("body-parser");

const app = Express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "views");

app.listen(PORT, () => {
  console.log("connected");
});
