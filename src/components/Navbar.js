import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
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
            <li><img src="/logo.svg" alt="logo" className="logo"/></li>
            <li className="page-title"><Link to="/" className="text">Kira</Link></li>
            {!user && (
                <>
                    <li className="buttonLink"><Link to="/login">Login</Link></li>
                    <li className="buttonLink"><Link to="/signup">Signup</Link></li>
                </>
            )}
            {user && (
                <>
                    <li>Logged in as {user.displayName}</li>
                    <li style={{marginLeft: "16px"}}><button className="logoutButton" onClick={logout}><MdLogout /></button></li>
                </>
            )}
        </ul>
    </nav>
  )
}