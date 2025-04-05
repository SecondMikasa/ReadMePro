import { useState, useEffect } from 'react'

import { toast } from 'sonner'

const useLocalStorage = () => {
    const [backup, setBackup] = useState(null)
    const [timer, setTimer] = useState(null)

    useEffect(() => {
        const localBackup = localStorage.getItem("readme-backup")
        
        if (localBackup) {
            setBackup(JSON.parse(localBackup))
        }
    }, [])

    const saveBackup = (templates) => {
        try {
            if (timer) {
                clearTimeout(timer)
            } 
            setTimer(
                setTimeout(() => {
                    localStorage.setItem("readme-backup", JSON.stringify(templates))
                }, 1000)
            )
        } catch (error) {
            toast.error("Failed to create local backup", error)
        }
    }
    
    const deleteBackup = () => {
        try {
            localStorage.removeItem("readme-backup")
        } catch (error) {
            toast.error("Failed to delete local backup", error)
        }
    }

    return { backup, saveBackup, deleteBackup }
}

export default useLocalStorage