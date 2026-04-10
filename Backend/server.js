// Log the active database target during startup so deployment issues are easier to spot.
console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLPORT:", process.env.MYSQLPORT);

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require('bcrypt');

const app = express();

// Enable cross-origin requests from the React frontend and parse JSON request bodies.
app.use(cors());
app.use(express.json());

/* ---------- DATABASE CONNECTION ---------- */

// Use a connection pool so the API can serve multiple requests without opening
// a brand-new database connection every time.
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

// Simple health-check route used to verify that the Express server is running.
app.get("/", (req, res) => {
    res.send("Golf App Backend Running");
});

// Return all users for testing and verification while the project is in development.
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

// Start listening after routes are registered so the API is ready to accept traffic.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



/* List of rounds */

// Fetch recent rounds and join each round to its course name for display in the UI.
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

// Return the course catalog so users can choose where they are playing before
// filling out a scorecard.
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

// Create a new user account by hashing the password before it is stored.
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body

  try {
    // Bcrypt protects stored passwords so the database never keeps them in plain text.
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



// Authenticate a returning user by looking up the account and comparing the
// submitted password against the stored hash.
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Step 1: find the user record that matches the submitted email address.
  const sql = "SELECT * FROM Users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      // Stop early when the email does not exist so we do not compare passwords unnecessarily.
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    // Step 2: compare the submitted password with the hashed password in the database.
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Step 3: return the small set of user data the frontend needs after login.
    res.json({ message: "Login successful", userId: user.UserID, username: user.Name });
  });
});


/* CREATE NEW ROUND WITH HOLES */
// Save a round header first, then save the per-hole stats that belong to that round.
app.post("/api/rounds", (req, res) => {
  const { userId, courseId, datePlayed, holes } = req.body;

  // Basic validation prevents incomplete scorecards from being inserted.
  if (!userId || !courseId || !holes || holes.length === 0) {
    return res.status(400).json({ error: "Missing required data" });
  }

  // Step 1: create the parent round row so we get a RoundID to attach hole stats to.
  const insertRoundSql = "INSERT INTO Round (UserID, CourseID, DatePlayed) VALUES (?, ?, ?)";
  db.query(insertRoundSql, [userId, courseId, datePlayed], (err, result) => {
    if (err) {
      console.error("Error inserting round:", err);
      return res.status(500).json({ error: "Failed to insert round" });
    }

    const roundId = result.insertId;

    // Step 2: insert one row per hole into the hole-stats table.
    const insertHoleSql = `
      INSERT INTO RoundHoleStats
        (RoundID, CourseHoleID, Score, Putts, GIR, FairwayHit)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Some clients may not know the CourseHoleID yet, so the API allows that field to be null.
    holes.forEach(hole => {
      const courseHoleId = hole.courseHoleId || null;
      db.query(
        insertHoleSql,
        [roundId, courseHoleId, hole.score, hole.putts, hole.GIR, hole.fairwayHit],
        (err2) => {
          if (err2) console.error("Error inserting hole stats:", err2);
        }
      );
    });

    // Respond once the round header exists and the hole inserts have been queued.
    res.json({ message: "Round saved successfully", roundId });
  });
});
