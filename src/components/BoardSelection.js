import { Link, useHistory } from "react-router-dom"

// mui components
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


export default function BoardSelection({data}) {
  const history = useHistory()
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
                <MenuItem key={board.boardID} onClick={() => history.push(`/board/${board.boardID}`)}>
                    <ListItemText primary={board.boardName} />
                </MenuItem>
            ))}
            <div style={{padding: "3em"}}>
                <Button variant="contained" onClick={() => history.push('/new')}>Create a new board</Button>
            </div>
        </MenuList>
        </Paper>
      </Grid>   
    </Grid> 
  )
}
