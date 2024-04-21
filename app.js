const express = require("express");
const CookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const mysql = require("mysql");
const bodyparser = require("body-parser");

const config = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "student_database",
  charset: "utf8mb4",
  multipleStatement: true,
};

const databaseConnection = mysql.createConnection(config);

const users = [{ email: "admin@gmail.com", password: "admin" }];

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(CookieParser());
app.use(bodyparser.urlencoded({ extended: true, limit: "15mb" }));
app.use(bodyparser.json());

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

// retrieve students
app.get("/students", (req, res) => {
  const query = "SELECT * FROM `student`";
  databaseConnection.query(query, (err, result, field) => {
    if (err) res.status(500).json(err);
    res.json({ students: result });
  });
});

// add new student
app.post("/students", (req, res) => {
  const student = req.body;
  const query =
    "INSERT INTO `student` (`idno`,`lastname`,`firstname`,`course`,`level`) VALUES " +
    `('${student.idno}', '${student.lastname}', '${student.firstname}', '${student.course}', '${student.level}')`;
  databaseConnection.query(query, (err, results, fields) => {
    if (err) res.status(500).json(err);
    res.json({ Message: "New Student Added" });
  });
});

// delete student
app.delete("/students/:idno", (req, res) => {
  const idno = req.params.idno;
  const query = `DELETE FROM \`student\` WHERE \`idno\` = '${idno}'`;
  databaseConnection.query(query, (err, results, fields) => {
    if (err) res.status(500).json(err);
    res.json({ Message: "Student was deleted" });
  });
});

// update student
app.put("/students", (req, res) => {
  const student = req.body;
  const query = `UPDATE \`student\` SET \`lastname\`='${student.lastname}', \`firstname\`='${student.firstname}', \`course\`='${student.course}', \`level\`='${student.level}' WHERE \`idno\`='${student.idno}'`;
  databaseConnection.query(query, (err, results, fields) => {
    if (err) res.status(500).json(err);
    res.json({ Message: "Student was updated" });
  });
});

// retrieve subjects
app.get("/subject", (req, res) => {
  const query = "SELECT * FROM `subject`";
  databaseConnection.query(query, (err, result, fields) => {
    if (err) res.status(500).json(err);
    res.json({ subjects: result });
  });
});

// add subject
app.post("/subject", (req, res) => {
  const subject = req.body;
  const query =
    "INSERT INTO `subject` (`edpcode`,`subjectcode`,`time`,`days`,`room`) VALUES " +
    `('${subject.edpcode}', '${subject.subjectcode}', '${subject.time}', '${subject.days}', '${subject.room}')`;
  databaseConnection.query(query, (err, results, fields) => {
    if (err) res.status(500).json(err);
    res.json({ Message: "New Subject Added" });
  });
});

// delete student
app.delete("/subject/:edpcode", (req, res) => {
  const edpcode = req.params.edpcode;
  const query = `DELETE FROM \`subject\` WHERE \`edpcode\` = '${edpcode}'`;
  databaseConnection.query(query, (err, results, fields) => {
    if (err) res.status(500).json(err);
    res.json({ Message: "Subject was deleted" });
  });
});

// update student
app.put("/subject", (req, res) => {
  const subject = req.body;
  const query = `UPDATE \`subject\` SET \`subjectcode\`='${subject.subjectcode}', \`time\`='${subject.time}', \`days\`='${subject.days}', \`room\`='${subject.room}' WHERE \`edpcode\`='${subject.edpcode}'`;
  databaseConnection.query(query, (err, results, fields) => {
    if (err) res.status(500).json(err);
    res.json({ Message: "Subject was updated" });
  });
});

app.listen("4321", () => {
  console.log("listening at port 4321");
});
