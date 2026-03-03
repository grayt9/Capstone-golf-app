import React from 'react'
import "./Logo.css"
import logoPic from '../../assets/L2.png'

const logo = () => {
  return (
    <div>
      <img src={logoPic} alt="" className='logoPic' />
    </div>
  )
}

export default logo
