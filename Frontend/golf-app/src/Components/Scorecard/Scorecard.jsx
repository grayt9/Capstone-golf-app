import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Scorecard.css";

const Scorecard = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedCourse = location.state?.course;
  const numHoles = 18;

  const [holes, setHoles] = useState(
    Array.from({ length: numHoles }, (_, i) => ({
      holeNumber: i + 1,
      courseHoleId: null,
      par: "",
      score: "",
      putts: "",
      GIR: false,
      fairwayHit: false
    }))
  );

  const [currentHole, setCurrentHole] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!selectedCourse) return;
    fetch(`https://capstone-golf-app-production.up.railway.app/courses/${selectedCourse.CourseID}/holes`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setHoles(prev => prev.map(hole => {
            const dbHole = data.find(h => h.HoleNumber === hole.holeNumber);
            return dbHole ? { ...hole, par: dbHole.Par, courseHoleId: dbHole.CourseHoleID } : hole;
          }));
        }
      })
      .catch(err => console.error(err));
  }, [selectedCourse]);

  const handleChange = (field, value) => {
    const updatedHoles = [...holes];
    updatedHoles[currentHole][field] = value;
    setHoles(updatedHoles);
  };

  const handleNext = () => {
    const h = holes[currentHole]
    if (h.par === "" || h.score === "" || h.putts === "") {
      setSaveError(`Please fill in par, score, and putts before continuing.`)
      return
    }
    setSaveError("")
    if (currentHole < numHoles - 1) setCurrentHole(currentHole + 1);
  };

  const handlePrev = () => {
    if (currentHole > 0) setCurrentHole(currentHole - 1);
  };

  const handleSaveRound = async () => {
    setSaveError("");

    const incomplete = holes.find(h => h.par === "" || h.score === "" || h.putts === "")
    if (incomplete) {
      setSaveError(`Hole ${incomplete.holeNumber} is missing par, score, or putts.`)
      return
    }

    setSaving(true);
    try {
      const payload = {
        userId,
        courseId: selectedCourse.CourseID,
        datePlayed: new Date().toISOString().slice(0, 10),
        holes: holes.map(h => ({
          holeNumber: h.holeNumber,
          courseHoleId: h.courseHoleId,
          par: Number(h.par),
          score: Number(h.score),
          putts: Number(h.putts),
          GIR: Boolean(h.GIR),
          fairwayHit: Boolean(h.fairwayHit)
        }))
      };

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
        setSaved(true);
        setTimeout(() => navigate("/home"), 1500);
      } else {
        setSaveError(data.error || "Failed to save round. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setSaveError("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const hole = holes[currentHole];

  if (saved) {
    return (
      <div className="scorecard-container">
        <div className="save-success">
          <p className="save-success-icon">✓</p>
          <h2>Round Saved!</h2>
          <p className="save-success-sub">Heading back to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scorecard-container">
      <h2>{selectedCourse?.CourseName}</h2>

      <p className="hole-progress">Hole {currentHole + 1} of {numHoles}</p>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${((currentHole + 1) / numHoles) * 100}%` }}
        />
      </div>

      <div className="hole-card">
        <h3>Hole {hole.holeNumber}</h3>

        <label>Par</label>
        <input
          type="number"
          placeholder="Par"
          value={hole.par}
          onChange={e => handleChange("par", e.target.value)}
        />

        <label>Score</label>
        <input
          type="number"
          placeholder="Score"
          value={hole.score}
          onChange={e => handleChange("score", e.target.value)}
        />

        <label>Putts</label>
        <input
          type="number"
          placeholder="Putts"
          value={hole.putts}
          onChange={e => handleChange("putts", e.target.value)}
        />

        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={hole.GIR}
              onChange={e => handleChange("GIR", e.target.checked)}
            />
            GIR
          </label>
          {Number(hole.par) !== 3 && (
            <label>
              <input
                type="checkbox"
                checked={hole.fairwayHit}
                onChange={e => handleChange("fairwayHit", e.target.checked)}
              />
              Fairway Hit
            </label>
          )}
        </div>
      </div>

      {saveError && <p className="save-error">{saveError}</p>}

      <div className="hole-nav">
        <button onClick={handlePrev} disabled={currentHole === 0}>
          Previous
        </button>
        {currentHole === numHoles - 1 ? (
          <button onClick={handleSaveRound} disabled={saving}>
            {saving ? "Saving…" : "Save Round"}
          </button>
        ) : (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  );
};

export default Scorecard;
