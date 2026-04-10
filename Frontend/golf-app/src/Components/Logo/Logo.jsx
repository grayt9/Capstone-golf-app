import React from 'react'
import "./Logo.css"
import logoPic from '../../Assets/L2.png'

const logo = () => {
  return (
    <div>
      {/* Reusable logo image for screens that need a larger branded mark. */}
      <img src={logoPic} alt="" className='logoPic' />
    </div>
  )
}

export default logo
