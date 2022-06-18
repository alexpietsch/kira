import { useState } from "react"
import { useLogin } from "../../hooks/useLogin"

// mui components
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isEmailError, setIsEmailError] = useState(false)
  const [emailHelperText, setEmailHelperText] = useState("")

  const [isPasswordError, setIsPasswordError] = useState(false)
  const [passwordHelperText, setPasswordHelperText] = useState("")

  const { login, error, isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()

    if(email.length === 0){
      setIsEmailError(true)
      setEmailHelperText("Email is required")
    } else {
      setIsEmailError(false)
      setEmailHelperText("")
    }

    if(password.length === 0){
      setIsPasswordError(true)
      setPasswordHelperText("Password is required")
    } else {
      setIsPasswordError(false)
      setPasswordHelperText("")
    }

    if(email.length === 0 || password.length === 0) return

    try {
      login(email, password)
    } catch (err) {
      console.log(err.message);
      return
    }
  }

  return (
    <div>
      <h1>Login</h1>
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
            type="email"
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
      {!isPending && <Button type="submit" variant="contained" sx={{ margin: "1em" }}>Login</Button>}
      {isPending && <Button variant="contained" disabled sx={{ margin: "1em" }}>loading</Button>}
      {error && <p>{error}</p>}
    </form>
    </div>
  )
}
