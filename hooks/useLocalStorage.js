import { useState, useEffect } from 'react'

const useLocalStorage = () => {
    const [backup, setBackup] = useState(null)
    const [timer, setTimer] = useState(null)

    useEffect(() => {
        const localBackup = localStorage.getItem("readme-backup")
        
        if (localBackup) {
            setBackup(JSON.parse(localBackup))
        }
    }, [])

    const saveBackup = (template) => {
        try {
            if (timer) {
                clearTimeout(timer)
            } 
            setTimer(
                setTimeout(() => {
                    localStorage.setItem("readme-backup", JSON.stringify(template))
                }, 1000)
            )
        } catch (error) {
            console.log("Failed to create local backup")
        }
    }
    
    const deleteBackup = () => {
        try {
            localStorage.removeItem("readme-backup")
        } catch (error) {
            console.log("Failed to delete local backup")
        }
    }

    return (backup, saveBackup, deleteBackup)
}

export default useLocalStorage