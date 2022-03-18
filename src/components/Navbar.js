import { Link } from "react-router-dom"

// styles
import "./Navbar.css"

// hooks
import { useLogout } from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"

export default function Navbar() {

const { logout } = useLogout()
const { user } = useAuthContext()

  return (
    <nav className="nav-container">
        <ul>
            <li className="page-title">Kira</li>
            {!user && (
                <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                </>
            )}
            {user && (
                <>
                    <li>Logged in as {user.displayName}</li>
                    <li><button onClick={logout}>Logout</button></li>
                </>
            )}
        </ul>
    </nav>
  )
}