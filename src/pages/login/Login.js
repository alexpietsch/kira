import { useState } from "react"
import { useLogin } from "../../hooks/useLogin"



export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, error, isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        <span>E-Mail:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>Passwort:</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          />
      </label>
      {!isPending && <button>Login</button>}
      {isPending && <button disabled>loading</button>}
      {error && <p>{error}</p>}
    </form>
  )
}
