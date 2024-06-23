import React from 'react'
import { Link } from 'react-router-dom'

const Homepage = () => {
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='border p-20 w-1/2 h-96 text-white flex flex-col justify-around text-center rounded-lg'>
                <h1 className='text-4xl font-bold'>Mastermind Game</h1>
                <Link to="/game" className='bg-blue-400 p-4 rounded'>Enter Game</Link>

            </div>
        </div>
    )
}

export default Homepage