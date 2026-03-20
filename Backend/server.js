// test

console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLPORT:", process.env.MYSQLPORT);





const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require('bcrypt');


const app = express();

app.use(cors());
app.use(express.json());

/* ---------- DATABASE CONNECTION ---------- */

const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



/* db.connect((err) => {
    if (err) {
        console.log("Database connection FAILED:", err);
    } else {
        console.log("Connected to MySQL Database!");
    }

    db.query('SELECT * FROM Course', (err, results, fields) => {
    if (err) throw err;
    console.log(results);
  });
}); */

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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
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


app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const sql = "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)"

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: "Database error" })
      }

      res.json({ message: "User created successfully" })
    })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})




app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const sql = "SELECT * FROM Users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      // No user found
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    // 2. Compare entered password with hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Success — user is authenticated
    res.json({ message: "Login successful", userId: user.UserID, username: user.Name });
  });
});


/* CREATE NEW ROUND WITH HOLES */
app.post("/api/rounds", (req, res) => {
  const { userId, courseId, datePlayed, holes } = req.body;

  if (!userId || !courseId || !holes || holes.length === 0) {
    return res.status(400).json({ error: "Missing required data" });
  }

  // 1. Insert new round
  const insertRoundSql = "INSERT INTO Round (UserID, CourseID, DatePlayed) VALUES (?, ?, ?)";
  db.query(insertRoundSql, [userId, courseId, datePlayed], (err, result) => {
    if (err) {
      console.error("Error inserting round:", err);
      return res.status(500).json({ error: "Failed to insert round" });
    }

    const roundId = result.insertId; // newly created RoundID

    // 2. Insert each hole into RoundHoleStats
    const insertHoleSql = `
      INSERT INTO RoundHoleStats
        (RoundID, CourseHoleID, Score, Putts, GIR, FairwayHit)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // holes may or may not match CourseHoleID; if you don't have CourseHoleID, we can insert NULL
    holes.forEach(hole => {
      const courseHoleId = hole.courseHoleId || null; // optional
      db.query(
        insertHoleSql,
        [roundId, courseHoleId, hole.score, hole.putts, hole.GIR, hole.fairwayHit],
        (err2) => {
          if (err2) console.error("Error inserting hole stats:", err2);
        }
      );
    });

    // Done
    res.json({ message: "Round saved successfully", roundId });
  });
});
