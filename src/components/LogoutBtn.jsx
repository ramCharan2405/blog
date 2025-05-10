import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authService } from '../appwrite/auth'
import { logout } from '../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
            navigate("/")
        })
    }

    return (
        <button
            onClick={logoutHandler}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
        >
            Logout
        </button>
    )
}

export default LogoutBtn 