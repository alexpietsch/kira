import { useNavigate } from "react-router-dom"
import React from "react"

// mui components
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';



export default function BoardSelection({data}) {
  const navigate = useNavigate()
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "60vh" }}
    >
      <Grid item xs={3}>
        <Paper sx={{ width: 320 }}>
        <MenuList>
            {data.map((board) => (
                <MenuItem sx={{ padding: ".6em"}} key={board.boardID} onClick={() => navigate(`/board/${board.boardID}`)}>
                    <ListItemText primary={board.boardName} />
                </MenuItem>
            ))}
            <div style={{padding: "1em"}}>
                <Button variant="contained" onClick={() => navigate('/new')}>Create a new board</Button>
            </div>
        </MenuList>
        </Paper>
      </Grid>
    </Grid> 
  )
}
