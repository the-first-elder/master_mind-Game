import React from 'react'
import { Link } from 'react-router-dom'

const Homepage = () => {
    return (
        <div className='flex items-center justify-center min-h-[calc(100vh-88px)]'>
            <div className='border p-20 w-1/2 h-96 text-white flex flex-col justify-around text-center rounded-lg'>
                <h1 className='text-4xl font-bold'>Mastermind Game 🤯</h1>
                <p>Try to guess the secret code within a limited number of attempts. Each attempt will provide feedback to help you crack the code!
                </p>
                <Link to="/game" className='bg-blue-400 p-4 rounded'>Enter Game</Link>

            </div>
        </div>
    )
}

export default Homepage