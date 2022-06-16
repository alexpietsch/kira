import { Link } from "react-router-dom";
// styles
import "./Navbar.css"

// hooks
import { useLogout } from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"
import { useHistory } from "react-router-dom";

// icons
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Button } from "@mui/material";

export default function Navbar() {

const { logout } = useLogout()
const { user } = useAuthContext()
const history = useHistory();

  return (
    <nav className="nav-container">
        <ul>
            <li><img src="/logo.svg" alt="logo" className="logo"/></li>
            <li className="page-title"><Link to="/" className="text">Kira</Link></li>
            {!user && (
                <>
                    
                    <li><Button variant="contained" onClick={() => history.push("/login")}>Login</Button></li>
                    <li style={{marginLeft: "16px"}}><Button variant="contained" onClick={() => history.push("/signup")}>Signup</Button></li>
                </>
            )}
            {user && (
                <>
                    <li>Logged in as {user.displayName}</li>
                    <li style={{marginLeft: "16px"}}><IconButton onClick={logout}><LogoutIcon /></IconButton></li>
                </>
            )}
        </ul>
    </nav>
  )
}