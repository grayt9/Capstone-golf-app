import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import Navbar from '../Navbar/Navbar'
import './Courses.css'

const Courses = ({ userId }) => {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCourse, setNewCourse] = useState({ name: "", par: "", yardage: "" })
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("https://capstone-golf-app-production.up.railway.app/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err))
  }, [])

  const filteredCourses = courses.filter(course =>
    search.length > 0 &&
    course.CourseName.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.par) {
      alert("Course name and par are required")
      return
    }

    setAdding(true)
    try {
      const res = await fetch("https://capstone-golf-app-production.up.railway.app/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCourse.name,
          par: Number(newCourse.par),
          yardage: newCourse.yardage ? Number(newCourse.yardage) : null
        })
      })

      const data = await res.json()

      if (res.ok) {
        // Add new course to local list so it shows up immediately
        setCourses(prev => [...prev, {
          CourseID: data.courseId,
          CourseName: newCourse.name,
          Par: Number(newCourse.par),
          Yardage: newCourse.yardage ? Number(newCourse.yardage) : null
        }])
        setNewCourse({ name: "", par: "", yardage: "" })
        setShowAddForm(false)
        alert("Course added successfully!")
      } else {
        alert("Error adding course: " + data.error)
      }
    } catch (err) {
      console.error(err)
      alert("Error adding course")
    }
    setAdding(false)
  }

  return (
    <div className='page-shell'>
      <Navbar />
      <section className='page-hero'>
        <p className='page-eyebrow'>Courses</p>
        <h1 className='page-title'>Select a course and head straight to your scorecard.</h1>
        <p className='page-copy'>
          Search your available course list, compare the basics quickly, and choose where you are playing today.
        </p>
      </section>
      <section className='feature-card courses-panel'>

        <div className="courses-top-bar">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="course-search"
          />
          <button
            className="add-course-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "+ Add New Course"}
          </button>
        </div>

        {/* Add course form */}
        {showAddForm && (
          <div className="add-course-form">
            <h3>Add New Course</h3>
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Par (e.g. 72)"
              value={newCourse.par}
              onChange={e => setNewCourse({ ...newCourse, par: e.target.value })}
            />
            <input
              type="number"
              placeholder="Yardage (optional)"
              value={newCourse.yardage}
              onChange={e => setNewCourse({ ...newCourse, yardage: e.target.value })}
            />
            <button onClick={handleAddCourse} disabled={adding}>
              {adding ? "Saving..." : "Save Course"}
            </button>
          </div>
        )}

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