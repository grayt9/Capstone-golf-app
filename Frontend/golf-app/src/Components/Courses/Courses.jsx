import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import Navbar from '../Navbar/Navbar'
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
    <div className='page-shell'>
      <Navbar/>
      <section className='page-hero'>
        <p className='page-eyebrow'>Courses</p>
        <h1 className='page-title'>Select a course and head straight to your scorecard.</h1>
        <p className='page-copy'>
          Search your available course list, compare the basics quickly, and choose where you are playing today.
        </p>
      </section>
      <section className='feature-card courses-panel'>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="course-search"
        />

        <div className="course-list">
          {filteredCourses.map(course => (
            <div key={course.CourseID} className="course-item">
              <div>
                <h3>{course.CourseName}</h3>
                <p className='muted'>Par: {course.Par}</p>
                <p className='muted'>Yardage: {course.Yardage}</p>
              </div>
              <button onClick={() => navigate("/scorecard", { state: { course, userId } })}>
                Select Course
              </button>
            </div>
          ))}
          {filteredCourses.length === 0 && <p className='muted'>No courses found.</p>}
        </div>
      </section>
    </div>
  )
}

export default Courses
