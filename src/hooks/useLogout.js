import { useState, useEffect } from "react"
import { projectAuth } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"



export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsPending(true)
        // sign user out
        try {
            await projectAuth.signOut()

            // dispatch(update state) logout action
            dispatch({ type: "LOGOUT"})

            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
        } catch (err) {
            if(!isCancelled){
                setIsPending(false)
                setError(null)
                console.log(err.message)
            }
        }
    }

    useEffect(() => {
        return () => {
            setIsCancelled(true)
        }
    }, [])

    return { logout, error, isPending}
}