import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'

const LogoutBtn = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await authService.logout()
            dispatch(logout())
            navigate('/')
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <button 
            onClick={handleLogout}
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
        >
            Logout
        </button>
    )
}

export default LogoutBtn