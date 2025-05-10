import React from 'react'
import { Link } from 'react-router-dom'

function Logo({ width = "100px" }) {
  return (
    <Link to="/" className="flex items-center space-x-3">
      <svg 
        width={width} 
        height={width} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-blue-600"
      >
        <path 
          d="M20 20H80V80H20V20Z" 
          fill="currentColor"
          className="opacity-10"
        />
        <path 
          d="M35 35H65V65H35V35Z" 
          fill="currentColor"
          className="opacity-20"
        />
        <path 
          d="M50 50H50V50H50V50Z" 
          fill="currentColor"
        />
        <path 
          d="M20 20L80 80M80 20L20 80" 
          stroke="currentColor" 
          strokeWidth="4"
          className="opacity-30"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900">Blog</span>
      </div>
    </Link>
  )
}

export default Logo