import React, { useState }  from 'react'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert'

import { useAuthContext } from "../../hooks/useAuthContext";
import EditUserProfile from '../../components/EditUserProfile';


export default function UserProfile() {

    const { user } = useAuthContext()

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setIsSnackBarOpen(false);
    };
    const SnackbarAlert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

return (
    <>
    <EditUserProfile open={isEditProfileOpen} onClose={setIsEditProfileOpen} setIsSnackBarOpen={setIsSnackBarOpen} />
    <Snackbar 
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
    >
        <SnackbarAlert>Successfully updated profile image!</SnackbarAlert>
    </Snackbar>
    
    <Box sx={{ flexGrow: 1, mt: "50px", p: "20px"}}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={5}>
            <Box sx={{
                display: "flex",
                justifyContent: {sm: "flex-end", xs: "center"}
            }}>
                <img style={{ width: "200px", height: "auto" }} src={user.photoURL ? user.photoURL : "/assets/avatar.png"} alt="user profile" />
            </Box>
        </Grid>
        <Grid item xs={12} sm={7}>
            <Box sx={{
                display: "flex",
                justifyContent: {sm: "flex-start", xs: "center"}
            }}>
                <Stack spacing={3} sx={{
                    display: "flex",
                    justifyContent: "flex-start"
                }}>
                    <Box>
                        <span style={{ fontWeight: "bold" }}>Username:</span>
                        <span style={{ marginLeft: "10px" }}>{user.displayName}</span>
                    </Box>
                    <Box>
                        <span style={{ fontWeight: "bold" }}>Email:</span>
                        <span style={{ marginLeft: "10px" }}>{user.email}</span>
                    </Box>
                    <Button onClick={() => setIsEditProfileOpen(true)} variant='outlined'>Edit Profile</Button>
                </Stack>
            </Box>
        </Grid>
      </Grid>
    </Box>
    </>
  )
}
