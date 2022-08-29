// styles
import "./Navbar.css"

// hooks
import { useLogout } from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"
import { useHistory, Link } from "react-router-dom";
import React from "react"

// icons
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Button, Avatar, Menu, MenuItem, ListItemIcon, Box } from "@mui/material";
import { useState } from "react";

export default function Navbar() {

const { logout } = useLogout()
const { user } = useAuthContext()
const history = useHistory();

const [menuAnchor, setMenuAnchor] = useState(null)
const open = Boolean(menuAnchor);

const handleAvatarClick = (e) => {
    setMenuAnchor(e.currentTarget)
}
const handleProfileMenuClose = () => {
    setMenuAnchor(null);
  };

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
                    <li style={{marginLeft: "8px"}}>
                        <IconButton
                            onClick={handleAvatarClick}
                        >
                            <Avatar 
                                sx={{ width: 32, height: 32 }}
                                alt={user.displayName + " avatar"} 
                                src={user.photoURL ? user.photoURL : "/assets/avatar.png"}
                            />
                        </IconButton>
                    </li>
                </>
            )}
        </ul>
        {user &&
            <Menu
                anchorEl={menuAnchor}
                id="account-menu"
                open={open}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                    elevation: 0,
                        sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1
                            },
                            "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0
                            }
                        }
                    }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
            <MenuItem onClick={() => history.push("/profile")}>
                <ListItemIcon>
                    <Avatar 
                        sx={{ width: 12, height: 12 }}
                        alt={user.displayName + " avatar"} 
                        src={user.photoURL ? user.photoURL : "/assets/avatar.png"}
                    />  
                </ListItemIcon>
                Your Profile
            </MenuItem>
            <MenuItem onClick={logout}>
                <ListItemIcon>
                    <LogoutIcon/>    
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
        }
    </nav>
  )
}