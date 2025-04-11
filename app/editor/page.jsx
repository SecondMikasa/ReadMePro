"use client"
import {
    useEffect,
    useState,
    useMemo,
    useRef,
    useCallback
} from 'react'

import { SectionTemplates } from '@/data/section-template'

import useLocalStorage from '@/hooks/useLocalStorage'

import Navbar from '@/app/_components/editor/Navbar'
import SectionColumn from '@/app/_components/editor/section-column'
import DownloadModal from '@/app/_components/editor/download-modal'

import {Loader} from '@/app/_components/Loader'

import { cn } from '@/lib/utils'

import { toast } from 'sonner'

// --- Constants for localStorage keys ---
const SELECTED_SLUGS_KEY = "current-slug-list"
const FOCUSED_SLUG_KEY = "current-focused-slug"
const DEFAULT_SLUGS = ["title_and_description"]
const DEFAULT_FOCUSED_SLUG = "title_and_description"

const Page = () => {

    const [selectedSectionSlugs, setSelectedSectionSlugs] = useState([])
    const [focusedSectionSlug, setFocusedSectionSlug] = useState(null)
    const [templates, setTemplates] = useState([])
    // Holds combined default + custom templates
    const [showModal, setShowModal] = useState(false)
    const [showDrawer, setShowDrawer] = useState(false)
    // Combined initialization flag
    const [isInitialized, setIsInitialized] = useState(false)

    // Ref to track if the component is mounted to prevent premature saves
    const isMounted = useRef(false)
    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
            // Cleanup on unmount
        }
    }, [])


    // Use the hook for template *content* backup
    const { templateBackup, saveTemplateBackup, deleteTemplateBackup } = useLocalStorage()

    // --- Effect 1: Initialize Slugs, Focus, And Templates ---
    // This now depends on templateBackup being loaded (not undefined)
    useEffect(() => {
        // Only run if templateBackup is loaded (either null or an array)
        if (templateBackup === undefined) {
            console.log("Initialization Effect: Waiting for templateBackup to load...")
            return
        }

        console.log("Initialization Effect: Running with loaded templateBackup:", templateBackup)

        // --- Load Slugs ---
        let loadedSlugs = DEFAULT_SLUGS

        try {
            const storedSlugs = localStorage.getItem(SELECTED_SLUGS_KEY)

            if (storedSlugs && typeof storedSlugs === 'string' && storedSlugs.trim() !== '') {

                const parsedSlugs = storedSlugs.split(',').filter(slug => slug && slug.trim() !== '')

                if (parsedSlugs.length > 0) loadedSlugs = parsedSlugs
            }

        } catch (error) {
            console.error("Init: Error loading slugs:", error)
        }

        console.log("Init: Setting Slugs:", loadedSlugs)
        setSelectedSectionSlugs(loadedSlugs)

        // --- Load Focus ---
        let loadedFocus = loadedSlugs.length > 0 ? loadedSlugs[0] : null

        try {
            const storedFocusedSlug = localStorage.getItem(FOCUSED_SLUG_KEY)
            if (storedFocusedSlug && loadedSlugs.includes(storedFocusedSlug)) {
                loadedFocus = storedFocusedSlug;
            }
        }
        catch (error) {
            console.error("Init: Error loading focus:", error)
        }
        console.log("Init: Setting Focus:", loadedFocus)
        setFocusedSectionSlug(loadedFocus)

        // --- Initialize Templates (Merge Defaults + Backup) ---
        let finalTemplates = []

        try {
            const defaultTemplates = [...SectionTemplates]

            const defaultTemplateMap = new Map(defaultTemplates.map(t => [t.slug, t]))

            if (templateBackup && Array.isArray(templateBackup) && templateBackup.length > 0) {
                const backupTemplateMap = new Map(templateBackup.map(t => [t.slug, t]))
                const mergedMap = new Map([...defaultTemplateMap, ...backupTemplateMap])
                finalTemplates = Array.from(mergedMap.values())
                console.log("Init: Merged defaults and backup for templates.")
            }
            else {
                console.log("Init: Using only default templates.")
                finalTemplates = defaultTemplates
            }
        } catch (error) {
            console.error("Init: Error processing templates:", error)
            toast.error("Failed to initialize templates. Using defaults.")
            finalTemplates = [...SectionTemplates];
        }
        console.log("Init: Setting Templates:", finalTemplates)
        // *** CRITICAL: Set Templates State ***
        setTemplates(finalTemplates) // This is the line that previously caused issues

        // --- Mark Initialization Complete ---
        setIsInitialized(true)
        console.log("Initialization Effect: Complete.")

    }, [templateBackup]) // This effect now correctly runs only when templateBackup is loaded/changes


    // --- Persistence Effects ---

    // Persist Selected Slugs
    useEffect(() => {
        if (isInitialized && isMounted.current) {
            try {
                console.log("Persist Effect: Saving slugs:", selectedSectionSlugs)
                localStorage.setItem(SELECTED_SLUGS_KEY, selectedSectionSlugs.join(","))
            } catch (error) {
                console.error("Persist Error: Failed to save selected slugs:", error)
                toast.error("Could not save section list changes.")
            }
        }
    }, [selectedSectionSlugs, isInitialized]) // Depends on slugs and init flag

    // Persist Focused Slug
    useEffect(() => {
        if (isInitialized && isMounted.current) {
            try {
                if (focusedSectionSlug) {
                    console.log("Persist Effect: Saving focus:", focusedSectionSlug)
                    localStorage.setItem(FOCUSED_SLUG_KEY, focusedSectionSlug)
                } else {
                    console.log("Persist Effect: Removing focus from storage.")
                    localStorage.removeItem(FOCUSED_SLUG_KEY)
                }
            } catch (error) {
                console.error("Persist Error: Failed to save focused slug:", error)
                toast.error("Could not save focus changes.")
            }
        }
    }, [focusedSectionSlug, isInitialized]) // Depends on focus and init flag

    // Persist Template Content (Backup)
    useEffect(() => {
        // Use the memoized saveTemplateBackup from the hook
        // Check isInitialized to prevent saving during the initial render cycle before state is ready
        if (isInitialized && isMounted.current && Array.isArray(templates)) {
            console.log("Persist Effect: Saving template content backup via saveTemplateBackup.")
            // Log here to ensure it doesn't run excessively
            // console.log("Persist Effect: Current Templates:", templates);
            saveTemplateBackup(templates)
        }
    }, [templates, saveTemplateBackup, isInitialized])
    // Depends on templates, the stable save function, and init flag


    // --- Helper Functions ---
    const getTemplate = useCallback((slug) => {
        // Ensure templates is an array before searching
        return Array.isArray(templates)
            ? templates.find((template) => template.slug === slug)
            : undefined
    }, [templates]) // Recreate only if templates array reference changes


    // --- Derived State ---
    const availableSectionSlugs = useMemo(() => {
        if (!Array.isArray(templates) || !Array.isArray(selectedSectionSlugs)) return [];
        const allKnownSlugs = new Set(templates.map(t => t.slug))
        const selectedSlugsSet = new Set(selectedSectionSlugs)
        return Array.from(allKnownSlugs).filter(slug => !selectedSlugsSet.has(slug)).sort();
    }, [templates, selectedSectionSlugs])

    // --- Event Handlers Passed Down ---
    const handleSetSelectedSlugs = useCallback((newSlugsOrCallback) => {
        setSelectedSectionSlugs(prevSlugs => {
            const currentSlugs = Array.isArray(prevSlugs) ? prevSlugs : [];
            const newSlugs = typeof newSlugsOrCallback === 'function'
                ? newSlugsOrCallback(currentSlugs)
                : newSlugsOrCallback;
            return Array.isArray(newSlugs) ? newSlugs : [];
        })
    }, []) // No dependencies needed if only using setter function form

    const handleSetFocusedSlug = useCallback((slug) => {
        setFocusedSectionSlug(slug)
    }, []) // No dependencies needed

    const handleSetTemplates = useCallback((newTemplatesOrCallback) => {
        setTemplates(prevTemplates => {
            const currentTemplates = Array.isArray(prevTemplates) ? prevTemplates : []
            const newTemplates = typeof newTemplatesOrCallback === 'function'
                ? newTemplatesOrCallback(currentTemplates)
                : newTemplatesOrCallback;
            return Array.isArray(newTemplates) ? newTemplates : []
        })
    }, []) // No dependencies needed here

    const handleResetAll = useCallback(() => {
        const resetConfirmed = window.confirm(
            "This will reset all sections to the default 'Title and Description' and remove custom content. Are you sure?"
        );
        if (resetConfirmed) {
            console.log("Resetting all sections...")
            setIsInitialized(false); // Temporarily pause persistence

            // Performing resets
            setSelectedSectionSlugs(DEFAULT_SLUGS)
            setFocusedSectionSlug(DEFAULT_FOCUSED_SLUG)
            setTemplates([...SectionTemplates]) // Fresh copy of defaults
            deleteTemplateBackup() // Clear backup storage

            // Use setTimeout to re-enable initialization/persistence slightly after state updates queued
            // This helps ensure state updates are processed before persistence effects try to run again
            setTimeout(() => {
                if (isMounted.current) { // Check if still mounted
                    setIsInitialized(true)
                    console.log("Re-enabled initialization after reset.")
                }
            }, 0);

            toast.success("Sections reset to default.");
        }
    }, [deleteTemplateBackup])

    if (!isInitialized) {
        return (
                <Loader />
        )
    }

    return (
        <>
            <Navbar
                setShowModal={setShowModal}
                onMenuClick={() => setShowDrawer(!showDrawer)}
                isDrawerOpen={showDrawer}
                onResetAllClick={handleResetAll}
            />
            {showModal && (
                <DownloadModal
                    setShowModal={setShowModal}
                // Pass generated markdown content here eventually
                />
            )}
            <div className='w-screen h-screen bg-[#1b1d1e] bg-dot-8-s-2-neutral-950 overflow-hidden flex flex-col'>

                <div className='flex flex-1 md:px-6 md:pt-6 overflow-hidden'>
                    {/* Drawer/Sidebar */}
                    <div
                        className={cn(
                            "flex-shrink-0 text-gray-800 md:text-white drawer-height absolute md:static top-0 left-0 h-full",
                            "p-6 md:p-0 bg-white md:bg-transparent shadow md:shadow-none z-10 md:z-0",
                            "transform transition-transform duration-300 ease-in-out",
                            showDrawer ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                            "md:w-80 lg:w-96"
                        )}
                    >
                        {/* Pass memoized handlers */}
                        <SectionColumn
                            selectedSectionSlugs={selectedSectionSlugs}
                            setSelectedSectionSlugs={handleSetSelectedSlugs}
                            availableSectionSlugs={availableSectionSlugs}
                            focusedSectionSlug={focusedSectionSlug}
                            setFocusedSectionSlug={handleSetFocusedSlug}
                            templates={templates}
                            setTemplates={handleSetTemplates}
                            getTemplate={getTemplate}
                            originalTemplates={SectionTemplates}
                            handleResetAll={handleResetAll} // Pass memoized reset handler
                        />
                    </div>

                    <div className="flex-1 bg-gray-700 text-white p-6 overflow-auto">
                        <h2 className="text-xl mb-4">
                            Editor / Preview Area
                        </h2>
                        <p>
                            Focused Section: {focusedSectionSlug || 'None'}
                        </p>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Page