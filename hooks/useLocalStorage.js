import {
    useState,
    useEffect,
    useCallback,
    useRef
} from 'react'

import { toast } from 'sonner'

const TEMPLATE_BACKUP_KEY = "readme-template-backup"

const useLocalStorage = () => {
    // Initialize state to undefined to clearly indicate "loading" vs "loaded null" vs "loaded data"
    const [templateBackup, setTemplateBackup] = useState(undefined)

    // Ref to prevent updates triggered by the hook's own initial setting
    const initialLoadDone = useRef(false)

    // Effect 1: Load initial backup from localStorage once on mounting
    useEffect(() => {

        console.log("useLocalStorage Mount Effect: Reading from localStorage...")

        let loadedData = null // Start with null assumption

        try {

            const localBackup = localStorage.getItem(TEMPLATE_BACKUP_KEY)

            if (localBackup) {
                console.log("useLocalStorage Mount Effect: Found backup string:", localBackup)
                loadedData = JSON.parse(localBackup)
                // Validate that it's an array (adjust if other types are valid)
                if (!Array.isArray(loadedData)) {
                    console.warn("useLocalStorage Mount Effect: Backup is not an array. Discarding.")
                    toast.warning("Stored template data was invalid. Resetting.", { duration: 5000 })
                    localStorage.removeItem(TEMPLATE_BACKUP_KEY)
                    loadedData = null // Reset to null if invalid
                }
                else {
                    console.log("useLocalStorage Mount Effect: Successfully parsed backup:", loadedData)
                }
            } else {
                console.log("useLocalStorage Mount Effect: No backup found.")
                loadedData = null // Explicitly null if not found
            }

        }
        catch (error) {
            console.error("useLocalStorage Mount Effect: Failed to parse backup:", error)
            toast.error("Failed to load template data. Resetting.", {
                description: error.message
            })
            localStorage.removeItem(TEMPLATE_BACKUP_KEY) // Clear corrupted data
            loadedData = null // Reset to null on error
        }
        finally {
            // Set state only once after all checks
            setTemplateBackup(loadedData)
            initialLoadDone.current = true
            console.log("useLocalStorage Mount Effect: Initial load complete. State set to:", loadedData)
        }
    }, []) // Empty dependency array ensures this runs only once on mount

    // Memoized function to save data passed to it
    const saveTemplateBackup = useCallback((templatesToSave) => {
        if (!initialLoadDone.current) {
            console.warn("useLocalStorage: Save called before initial load finished. Skipping.")
            return // Avoid saving during initial render cycles
        }
        try {
            console.log("useLocalStorage: Saving template backup:", templatesToSave)
            const dataToSave = JSON.stringify(templatesToSave)
            localStorage.setItem(TEMPLATE_BACKUP_KEY, dataToSave)
            // We do not need to call setTemplateBackup here - this function's job is only to save.
            // The Page component manages the 'templates' state that triggers this save.
        }
        catch (error) {
            console.error("useLocalStorage: Failed to save template backup:", error)
            toast.error("Failed to save template changes", { description: error.message })
        }
    }, []) // Empty dependency, function reference is stable

    // Memoized function to delete data
    const deleteTemplateBackup = useCallback(() => {
        try {
            console.log("useLocalStorage: Deleting template backup...")
            localStorage.removeItem(TEMPLATE_BACKUP_KEY)
            // Update the internal state to reflect deletion
            setTemplateBackup(null)
            toast.success("Template backup deleted.")
        } catch (error) {
            console.error("useLocalStorage: Failed to delete backup:", error)
            toast.error("Failed to delete template backup", {
                description: error.message
            })
        }
    }, []) // Empty dependency, function reference is stable

    return { templateBackup, saveTemplateBackup, deleteTemplateBackup }
}

export default useLocalStorage