const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------- DATABASE CONNECTION ---------- */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tadgus312",
    database: "Seminar"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection FAILED:", err);
    } else {
        console.log("Connected to MySQL Database!");
    }

    db.query('SELECT * FROM Course', (err, results, fields) => {
    if (err) throw err;
    console.log(results);
  });
});

/* TEST ROUTES */

// Base test
app.get("/", (req, res) => {
    res.send("Golf App Backend Running");
});

// Pull users from database


app.get("/users", (req, res) => {
    db.query("SELECT * FROM Users", (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Database query failed");
        } else {
            res.json(results);
        }
    });
});


/* START SERVER */

app.listen(3001, () => {
    console.log("Server running on port 3001");
});



/* List of rounds */

app.get("/rounds", (req, res) => {

    const query = `
        SELECT
            r.RoundID,
            r.DatePlayed,
            c.Name AS CourseName
        FROM Round r
        JOIN Course c ON r.CourseID = c.CourseID
        ORDER BY r.DatePlayed DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Query failed");
        } else {
            res.json(results);
        }
    });

});


/* List of Courses */

app.get("/courses", (req, res) => {
   
    const query = `
        SELECT
            CourseID,
            Name AS CourseName,
            Par,
            Yardage
        FROM Course
        ORDER BY CourseID
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Query failed");
        } else {
            res.json(results);
        }
    });
});
