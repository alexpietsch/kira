import { TextField, DialogTitle, Dialog, DialogActions, Button } from '@mui/material'
import { useAuthContext } from "../hooks/useAuthContext"
import React, { useState } from 'react'
import { projectStorage } from "../firebase/config"

export default function EditUserProfile({ open, onClose, setIsSnackBarOpen }) {

    const { user } = useAuthContext()

    const [displayName, setDisplayName] = useState(user.displayName)
    const [profileImage, setProfileImage] = useState(null)
    const [profileImageError, setProfileImageError] = useState(null)

    const handleFileChange = async (e) => {
        setProfileImage(null)
        let selectedFile = e.target.files[0]
        
        if (!selectedFile){
            setProfileImageError('No file selected')
            return
        }
        if (!selectedFile.type.includes('image')){
            setProfileImageError('File must be an image')
            return
        }
        if (selectedFile.size > 100000){
            setProfileImageError('File must be less than 100kb')
            return
        }
        setProfileImageError(null)
        setProfileImage(selectedFile)
    }

    const handleSubmitProfilePicture = async () => {
        if(!profileImage) return
        const uploadPath = `${user.uid}/profilePicture/${profileImage.name}`
        let img
        let imgUrl
        try {
            img = await projectStorage.ref(uploadPath).put(profileImage)
            imgUrl = await img.ref.getDownloadURL()
        } catch (error) {
            console.error(error);
            return
        }
        
        if(imgUrl){
            await user.updateProfile({ photoURL: imgUrl })
            onClose(false)
            setIsSnackBarOpen(true)
        }
    }
  return (
    <div>
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth="lg"
            sx={{ p: "20px" }}
        >
            <DialogTitle>Edit Profile</DialogTitle>
            <TextField
                label="Username"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                sx={{ maxWidth: "500px", m: "20px" }}
            />
            <p style={{ marginLeft: "20px" }}>Change Avatar</p>
            <input 
                style={{ marginLeft: "20px" }}
                required
                type="file"
                onChange={handleFileChange}
            />
            <Button 
                size='small'
                variant='outlined'
                style={{ marginLeft: "20px", marginTop: "10px", maxWidth: "100px" }}
                disabled={profileImage == null}
                onClick={handleSubmitProfilePicture}>Submit</Button>
            {profileImageError && <p style={{ marginLeft: "20px" }} className='error'>{profileImageError}</p>}
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancle</Button>
                <Button variant='contained' onClick={
                    () => {
                        user.updateProfile({ displayName })
                        onClose(false)
                    }
                }
                >Save Changes</Button>
            </DialogActions>
        </Dialog>
    </div>
  )
}
