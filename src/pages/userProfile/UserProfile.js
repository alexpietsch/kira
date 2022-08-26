import React from 'react'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import { useAuthContext } from "../../hooks/useAuthContext"


export default function UserProfile() {

    const { user } = useAuthContext()

return (
    <Box sx={{ flexGrow: 1, mt: "50px", p: "20px"}}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={5}>
            <Box sx={{
                display: "flex",
                justifyContent: {sm: "flex-end", xs: "flex-start"}
            }}>
                <img style={{ width: "200px", height: "auto" }} src={user.photoUrl ? user.photoUrl : "/assets/avatar.png"} alt="user profile" />
            </Box>
        </Grid>
        <Grid item xs={12} sm={7}>
            <Box sx={{
                display: "flex",
                justifyContent: "flex-start"
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
                </Stack>
            </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
