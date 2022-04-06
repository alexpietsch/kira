import { Link } from "react-router-dom";
//import {ReactComponent as logo} from "./logo.svg";
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
            <li className="page-title">KIRA</li>
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