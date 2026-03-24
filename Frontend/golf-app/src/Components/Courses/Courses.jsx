import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import './Courses.css'

const Courses = ({ userId }) => {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  // Fetch courses from backend
  useEffect(() => {
    fetch("https://capstone-golf-app-production.up.railway.app/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err))
  }, [])

  // Filter courses based on search input
  const filteredCourses = courses.filter(course =>
    course.CourseName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="courses-container">
      <h1>Course Select Page</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="course-search"
      />

      {/* List courses */}
      <div className="course-list">
        {filteredCourses.map(course => (
          <div key={course.CourseID} className="course-item">
            <h3>{course.CourseName}</h3>
            <p>Par: {course.Par}</p>
            <p>Yardage: {course.Yardage}</p>
            <button onClick={() => navigate("/scorecard", { state: { course, userId } })}>
            Select Course
            </button>
            <hr />
          </div>
        ))}
        {filteredCourses.length === 0 && <p>No courses found.</p>}
      </div>
    </div>
  )
}

export default Courses
