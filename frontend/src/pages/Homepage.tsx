import React from 'react'
import { Link } from 'react-router-dom'

const Homepage = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1>Homepage</h1>
      <Link to="/game" className='bg-blue-400 p-2'>Enter Game</Link>
    </div>
  )
}

export default Homepage