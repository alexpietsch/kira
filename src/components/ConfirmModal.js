import React from 'react'

// mui components
import { Button } from "@mui/material";
    //Dialog
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmModal({handleYesAction, handleNoAction, title, message}) {
  return (
    <div>
        <Dialog
            open={true}
            onClose={handleNoAction}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {message}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleYesAction} color="primary">Yes</Button>
                <Button variant='contained' onClick={handleNoAction} color="primary">No</Button>
            </DialogActions>
        </Dialog>



    </div>
  )
}
