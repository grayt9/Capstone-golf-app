// test

console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLPORT:", process.env.MYSQLPORT);





const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);


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

  const insertRoundSql = "INSERT INTO Round (UserID, CourseID, DatePlayed) VALUES (?, ?, ?)";
  db.query(insertRoundSql, [userId, courseId, datePlayed], (err, result) => {
    if (err) {
      console.error("Error inserting round:", err);
      return res.status(500).json({ error: "Failed to insert round" });
    }

    const roundId = result.insertId;
    let completed = 0;
    let hasError = false;

    holes.forEach(hole => {
      // Check if CourseHole already exists for this course + hole number
      const checkSql = "SELECT CourseHoleID FROM CourseHole WHERE CourseID = ? AND HoleNumber = ?";
      db.query(checkSql, [courseId, hole.holeNumber], (err, rows) => {
        if (err || hasError) {
          hasError = true;
          return;
        }

        const insertHoleStats = (courseHoleId) => {
          const statsSql = `
            INSERT INTO RoundHoleStats (RoundID, CourseHoleID, Score, Putts, GIR, FairwayHit)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          db.query(statsSql, [roundId, courseHoleId, hole.score, hole.putts, hole.GIR, hole.fairwayHit], (err) => {
            if (err) console.error("Error inserting hole stats:", err);
            completed++;
            if (completed === holes.length) {
              res.json({ message: "Round saved successfully", roundId });
            }
          });
        };

        if (rows.length > 0) {
          // CourseHole already exists, use it
          insertHoleStats(rows[0].CourseHoleID);
        } else {
          // Create new CourseHole record with par data
          const insertHoleSql = "INSERT INTO CourseHole (CourseID, HoleNumber, Par) VALUES (?, ?, ?)";
          db.query(insertHoleSql, [courseId, hole.holeNumber, hole.par], (err, holeResult) => {
            if (err) {
              console.error("Error inserting course hole:", err);
              completed++;
              return;
            }
            insertHoleStats(holeResult.insertId);
          });
        }
      });
    });
  });
});

// get stats for individual user
app.get("/api/stats/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT
      r.RoundID,
      r.DatePlayed,
      c.Name AS CourseName,
      SUM(rhs.Score) AS TotalScore,
      SUM(rhs.Putts) AS TotalPutts,
      ROUND(AVG(rhs.GIR) * 100, 1) AS GIRPercent,
      ROUND(AVG(rhs.FairwayHit) * 100, 1) AS FairwayPercent
    FROM Round r
    JOIN Course c ON r.CourseID = c.CourseID
    JOIN RoundHoleStats rhs ON r.RoundID = rhs.RoundID
    WHERE r.UserID = ?
    GROUP BY r.RoundID, r.DatePlayed, c.Name
    ORDER BY r.DatePlayed ASC
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Query failed" });
    res.json(results);
  });
});


// hole-by-hole stats for a specific round
app.get("/api/rounds/:roundId/holes", (req, res) => {
  const { roundId } = req.params;
  const query = `
    SELECT
      ch.HoleNumber,
      ch.Par,
      rhs.Score,
      rhs.Putts,
      rhs.GIR,
      rhs.FairwayHit
    FROM RoundHoleStats rhs
    JOIN CourseHole ch ON rhs.CourseHoleID = ch.CourseHoleID
    WHERE rhs.RoundID = ?
    ORDER BY ch.HoleNumber
  `;
  db.query(query, [roundId], (err, results) => {
    if (err) return res.status(500).json({ error: "Query failed" });
    res.json(results);
  });
});

//fix for dynamic course par saving
app.get("/courses/:courseId/holes", (req, res) => {
  const { courseId } = req.params;
  db.query(
    "SELECT * FROM CourseHole WHERE CourseID = ? ORDER BY HoleNumber",
    [courseId],
    (err, results) => {
      if (err) return res.status(500).send("Query failed");
      res.json(results);
    }
  );
});

// Request password reset
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  db.query("SELECT UserID FROM Users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    // Always respond the same way to avoid leaking whether an email exists
    if (results.length === 0) return res.json({ message: "If that email exists, a reset link has been sent." });

    const userId = results[0].UserID;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    db.query(
      "INSERT INTO PasswordResetTokens (UserID, Token, ExpiresAt) VALUES (?, ?, ?)",
      [userId, token, expiresAt],
      async (err) => {
        if (err) return res.status(500).json({ error: "Failed to create reset token" });

        const resetLink = `https://capstone-golf-app.vercel.app/reset-password?token=${token}`;

        try {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Reset your password',
            html: `
              <p>You requested a password reset for your Golf App account.</p>
              <p><a href="${resetLink}">Click here to reset your password</a></p>
              <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
            `
          });
          res.json({ message: "If that email exists, a reset link has been sent." });
        } catch (emailErr) {
          console.error("Email send failed:", emailErr);
          res.status(500).json({ error: "Failed to send reset email" });
        }
      }
    );
  });
});

// Reset password with token
app.post("/api/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: "Token and password are required" });

  const now = new Date();
  db.query(
    "SELECT * FROM PasswordResetTokens WHERE Token = ? AND Used = 0 AND ExpiresAt > ?",
    [token, now],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(400).json({ error: "Invalid or expired reset link." });

      const { TokenID, UserID } = results[0];
      const hashed = await bcrypt.hash(password, 10);

      db.query("UPDATE Users SET password = ? WHERE UserID = ?", [hashed, UserID], (err) => {
        if (err) return res.status(500).json({ error: "Failed to update password" });

        db.query("UPDATE PasswordResetTokens SET Used = 1 WHERE TokenID = ?", [TokenID]);
        res.json({ message: "Password updated successfully" });
      });
    }
  );
});

//Allow user to add a new course
app.post("/api/courses", (req, res) => {
  const { name, par, yardage } = req.body;

  if (!name || !par) {
    return res.status(400).json({ error: "Name and par are required" });
  }

  const sql = "INSERT INTO Course (Name, Par, Yardage) VALUES (?, ?, ?)";
  db.query(sql, [name, par, yardage || null], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add course" });
    }
    res.json({ message: "Course added successfully", courseId: result.insertId });
  });
});