import { useState, useEffect } from "react"
import { projectAuth } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"
import {useNavigate} from "react-router-dom";


export const useLogin = (email, password) => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    let navigate = useNavigate();

    const login = async (email, password) => {
        setError(null)
        setIsPending(true)
        try {
            const response = await projectAuth.signInWithEmailAndPassword(email, password)

            dispatch({ type: "LOGIN", payload: response.user })

            if(!isCancelled){
                setIsPending(false)
                setError(null)
                navigate("/")
            }
        } catch (err) {
            if(!isCancelled){
                setIsPending(false)
                setError(err.message)
            }
        }
    }

    const resetUserPassword = async (email) => {
        setError(null)
        setIsPending(true)
        try {
            await projectAuth.sendPasswordResetEmail(email)
            if(!isCancelled){
                setIsPending(false)
                setError(null)
                navigate("/")
            }
        } catch (err) {
            if(!isCancelled){
                setIsPending(false)
                setError(err.message)
            }
        }
    }

    useEffect(() => {
        return () => {
            setIsCancelled(true)
        }
    }, [])

    return { login, error, isPending, resetUserPassword }
}