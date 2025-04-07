import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const useLocalStorage = () => {
    const [backup, setBackup] = useState(null)
    const [timer, setTimer] = useState(null)
    
    const BACKUP_KEY = "readme-backup"
    
    useEffect(() => {
        const localBackup = localStorage.getItem(BACKUP_KEY)
       
        if (localBackup) {
            try {
                setBackup(JSON.parse(localBackup))
            } catch (error) {
                toast.error("Failed to parse local backup", error)
            }
        }
    }, [])
    
    const saveBackup = (templates) => {
        try {
            if (timer) {
                clearTimeout(timer)
            }
            
            // Update the state immediately for internal use
            setBackup(templates)
            
            // Debounce the localStorage write operation
            setTimer(
                setTimeout(() => {
                    localStorage.setItem(BACKUP_KEY, JSON.stringify(templates))
                }, 1000)
            )
        } catch (error) {
            toast.error("Failed to create local backup", error)
        }
    }
    
    const getBackup = () => {
        try {
            // First try to use the in-memory backup if available
            if (backup) {
                return backup
            }
            
            // Otherwise try to get from localStorage
            const localBackup = localStorage.getItem(BACKUP_KEY)
            if (localBackup) {
                return JSON.parse(localBackup)
            }
            
            return null
        } catch (error) {
            toast.error("Failed to retrieve local backup", error)
            return null
        }
    }
   
    const deleteBackup = () => {
        try {
            localStorage.removeItem(BACKUP_KEY)
            setBackup(null)
        } catch (error) {
            toast.error("Failed to delete local backup", error)
        }
    }
    
    return { backup, saveBackup, getBackup, deleteBackup }
}

export default useLocalStorage