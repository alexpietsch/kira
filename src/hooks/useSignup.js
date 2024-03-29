import { useState, useEffect } from "react" 
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from "./useAuthContext"


export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName) => {
        setError(null)
        setIsPending(true)

        try {
            // signup user
            const response = await projectAuth.createUserWithEmailAndPassword(email, password)
            

            if (!response){
                throw new Error("Could not complete signup")
            }

            // add display name to user profile
            await response.user.updateProfile({ displayName })

            // create user document
            await projectFirestore.collection('users').doc(response.user.uid).set({
                uid: response.user.uid,
                displayName,
                photoURL: null
            })

            // update Context do be current user
            await dispatch({ type: "LOGIN", payload: response.user })
            
            if(!isCancelled){
                setIsPending(false)
                setError(null)
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

    return { error, isPending, signup }
}