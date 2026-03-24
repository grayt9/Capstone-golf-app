import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Scorecard.css";

const Scorecard = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedCourse = location.state?.course; // course selected from previous page
  const numHoles = 18; // default 18, can adjust

  // Initialize holes array
  const [holes, setHoles] = useState(
    Array.from({ length: numHoles }, (_, i) => ({
      holeNumber: i + 1,
      par: "",
      score: "",
      putts: "",
      GIR: false,
      fairwayHit: false
    }))
  );

  const handleChange = (index, field, value) => {
    const updatedHoles = [...holes];
    updatedHoles[index][field] = value;
    setHoles(updatedHoles);
  };


  console.log("userId from props:", userId)
  const handleSaveRound = async () => {
    try {
      const payload = {
        userId: userId, // pass from logged-in context
        courseId: selectedCourse.CourseID,
        datePlayed: new Date().toISOString().slice(0, 10),
        holes: holes.map(h => ({
          holeNumber: h.holeNumber,
          par: Number(h.par),
          score: Number(h.score),
          putts: Number(h.putts),
          GIR: Boolean(h.GIR),
          fairwayHit: Boolean(h.fairwayHit)
        }))
      };
      

      console.log("payload:", payload);
      const response = await fetch(
        "https://capstone-golf-app-production.up.railway.app/api/rounds",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Round saved successfully!");
        navigate("/home"); // redirect after save
      } else {
        alert("Error saving round: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving round");
    }
  };

  return (
    <div className="scorecard-container">
      <h2>{selectedCourse?.CourseName} - Scorecard</h2>
      {holes.map((hole, idx) => (
        <div key={idx} className="hole-row">
          <span>Hole {hole.holeNumber}</span>
          <input
            type="number"
            placeholder="Par"
            value={hole.par}
            onChange={e => handleChange(idx, "par", e.target.value)}
          />
          <input
            type="number"
            placeholder="Score"
            value={hole.score}
            onChange={e => handleChange(idx, "score", e.target.value)}
          />
          <input
            type="number"
            placeholder="Putts"
            value={hole.putts}
            onChange={e => handleChange(idx, "putts", e.target.value)}
          />
          <label>
            GIR
            <input
              type="checkbox"
              checked={hole.GIR}
              onChange={e => handleChange(idx, "GIR", e.target.checked)}
            />
          </label>
          <label>
            Fairway Hit
            <input
              type="checkbox"
              checked={hole.fairwayHit}
              onChange={e => handleChange(idx, "fairwayHit", e.target.checked)}
            />
          </label>
        </div>
      ))}

      <button onClick={handleSaveRound}>Save Round</button>
    </div>
  );
};

export default Scorecard;

