import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authService } from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import Logo from '../Logo'

function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const navItems = [
        {
            name: 'Home',
            slug: "/",
            active: true
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus,
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus,
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus,
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus,
        },
    ]

    const handleLogout = () => {
        authService.logout().then(() => {
            dispatch(logout())
            navigate("/")
        })
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Logo width="40px" />
                    
                    <nav className="flex items-center space-x-1">
                        {navItems.map((item) => 
                            item.active ? (
                                <Link
                                    key={item.name}
                                    to={item.slug}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                                >
                                    {item.name}
                                </Link>
                            ) : null
                        )}
                        {authStatus && (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            >
                                Logout
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header