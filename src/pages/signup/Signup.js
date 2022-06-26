import React, { useState } from "react"
import { useSignup } from "../../hooks/useSignup"

// mui components
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")


  const [isEmailError, setIsEmailError] = useState(false)
  const [emailHelperText, setEmailHelperText] = useState("")

  const [isPasswordError, setIsPasswordError] = useState(false)
  const [passwordHelperText, setPasswordHelperText] = useState("")

  const [isDisplayNameError, setIsDisplayNameError] = useState(false)
  const [displayNameHelperText, setDisplayNameHelperText] = useState("")

  const {signup, isPending, error} = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()

    if(email.length === 0){
      setIsEmailError(true)
      setEmailHelperText("Email is required")
    } else {
      setIsEmailError(false)
      setEmailHelperText("")
    }

    if(displayName.length === 0){
      setIsDisplayNameError(true)
      setDisplayNameHelperText("Email is required")
    } else {
      setIsDisplayNameError(false)
      setDisplayNameHelperText("")
    }

    if(password.length === 0){
      setIsPasswordError(true)
      setPasswordHelperText("Password is required")
    } else {
      setIsPasswordError(false)
      setPasswordHelperText("")
    }

    if(email.length === 0 || password.length === 0 || displayName.length === 0) return

    try {
      signup(email, password, displayName)
    } catch(err) {
      console.error(err.message)
      return
    }
  }

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <TextField
            required
            label="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            size="small"
            sx={{ width: "75%", maxWidth: "300px" }}
            error={isEmailError}
            helperText={emailHelperText}
          />
        </label>
      <br />
        <label>
          <TextField
            label="Display Name"
            required
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
            size="small"
            sx={{ width: "75%", maxWidth: "300px", marginTop: "1em" }}
            error={isDisplayNameError}
            helperText={displayNameHelperText}
            type="text"
          />
        </label>
      <br />
        <label>
          <TextField
            label="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            size="small"
            sx={{ width: "75%", maxWidth: "300px", marginTop: "1em" }}
            error={isPasswordError}
            helperText={passwordHelperText}
            type="password"
          />
        </label>
      <br />
      {!isPending && <Button type="submit" variant="contained" sx={{ margin: "1em" }}>Signup</Button>}
      {isPending && <Button variant="contained" disabled sx={{ margin: "1em" }}>loading</Button>}
      {error && <p>{error}</p>}
    </form>
    </div>
  )
}
