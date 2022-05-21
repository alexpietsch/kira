import { useEffect, useState, useRef } from "react"
import { projectFirestore } from "../firebase/config"

export const useCollection = (collection, _query, _user, _orderBy) => {

    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    const query = useRef(_query).current
    const orderBy = useRef(_orderBy).current
    const user = useRef(_user).current

    useEffect(() => {
        let ref = projectFirestore.collection(collection)

        if (query && user) {
            ref = ref.where(...query).where("user", "==", user.uid)
        }
        if (query && !user) {
            ref = ref.where(...query)
        }
        if (orderBy) {
            ref = ref.orderBy(...orderBy)
        }

        const unsubscribe = ref.onSnapshot((snapshot) => {
            let results = []
            snapshot.docs.forEach((doc) => {
                results.push({...doc.data()})
            })
            setDocuments(results)
            setError(null)
        }, (error) => {
            console.log(error)
            setError("Could not fetch the data.")
        })
        return () => unsubscribe()
    }, [collection, query, orderBy, user])

    return { documents, error }

} 