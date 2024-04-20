const express = require("express");
const CookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const users = [{ email: "admin@gmail.com", password: "admin" }];

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(CookieParser());

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/userlogin", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user = users.filter((el) => el.email == email && el.password == password);
  res.cookie("sessionCookie", JSON.stringify(user));
  res.status(200).send(user);
});

app.listen("4321", () => {
  console.log("listening at port 4321");
});
