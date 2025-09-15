import { Fragment, useRef, useState } from "react"
import Image from "next/image";

import { toast } from 'sonner'

import {
    Dialog,
    DialogPanel, 
    DialogTitle,
    Transition,
    TransitionChild
} from "@headlessui/react";

const CustomSection = ({
    setTemplates,
    setSelectedSectionSlugs,
    setFocusedSectionSlug,
    // Removed unnecessary props like setPageRefreshed, setAddAction
}) => {

    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState("")
    // const { saveBackup } = useLocalStorage() // Remove - saving handled by parent effect

    const inputRef = useRef(null);

    const addCustomSection = (e) => {
        e.preventDefault() // Prevent default form submission if wrapped in form
        if (!title.trim()) {
            toast.error("Please enter a title for the custom section.")
            inputRef.current?.focus()
            return
        }

        setShowModal(false)
        const safeTitle = title.trim()

        // Generate a unique slug, handling potential collisions (basic example)
        const baseSlug = "custom-" + safeTitle.toLowerCase()
            .replace(/\s+/g, '-')        // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '')     // Remove non-word chars except hyphens
            .replace(/--+/g, '-')        // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, '')     // Trim leading/trailing hyphens

        let slug = baseSlug || `custom-section`

        // Check if slug already exists in templates (via parent state/prop)
        // This check requires passing 'templates' prop or a 'checkSlugExists' function
        // Simplified: Assume setTemplates handles potential duplicates if needed, or add check later
        // Example check (requires passing `templates` prop):
        // while (templates.some(t => t.slug === slug)) {
        //    slug = `${baseSlug}-${counter++}`
        // }

        const section = {
            slug: `${slug}-${Date.now()}`, // Add timestamp for uniqueness for now
            name: safeTitle,
            markdown: `## ${safeTitle}\n\n<!-- Add your content here -->\n`, // Added placeholder comment
        };

        // console.log("CustomSection: Creating new section:", section) // Debug log

        // 1. Update the main templates array
        setTemplates((prevTemplates) => {
            // Check if slug already exists before adding
            if (prevTemplates.some(t => t.slug === section.slug)) {
                // This shouldn't happen with the timestamp, but good practice
                toast.error("Failed to add custom section: Slug already exists.")
                console.error("Slug collision detected:", section.slug)
                return prevTemplates // Return previous state if collision
            }
            // console.log("CustomSection: Adding new template to state"); // Debug log
            return [...prevTemplates, section] // Add the new section object
        });

        // 2. Add the new slug to the selected list
        setSelectedSectionSlugs((prevSelected) => {
            // console.log("CustomSection: Adding slug to selected list:", section.slug); // Debug log
            return [...prevSelected, section.slug]
        });

        // 3. Set focus to the new section
        setFocusedSectionSlug(section.slug)
        // console.log("CustomSection: Setting focus to:", section.slug); // Debug log

        // Reset title for next time
        setTitle("")
        toast.success(`Custom section "${safeTitle}" added!`)
    };

    const handleCloseModal = () => {
        setShowModal(false)
        setTitle("") // Reset title on cancel
    }

    return (
        <>
            {/* Add Section Button */}
            <div className="mb-4 px-1"> {/* Added padding consistency */}
                <button
                    className="flex items-center justify-center w-full py-2 px-4 bg-[#22c55e] hover:bg-green-700 text-white font-semibold rounded-md shadow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-green-400 transition-colors duration-150"
                    type="button"
                    onClick={() => setShowModal(true)}
                >
                    <Image
                        src="/plus.svg" 
                        alt="" 
                        width={25}
                        height={25}
                    />
                    <span className="ml-2 text-black">
                        Add Custom Section
                    </span>
                </button>
            </div>

            {/* Modal */}
            <Transition
                show={showModal}
                as={Fragment}
            >
                <Dialog
                    as="div"
                    className="relative z-50" // Ensure modal is on top
                    initialFocus={inputRef}
                    onClose={handleCloseModal} // Use handler to reset title
                >
                    {/* Backdrop */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            aria-hidden="true"
                        />
                    </TransitionChild>

                    {/* Modal Panel Container */}
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            {/* Use DialogPanel */}
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle
                                    as="h3"
                                    className="text-lg font-semibold leading-6 text-gray-900 text-center mb-4"
                                >
                                    New Custom Section
                                </DialogTitle>
                                <form onSubmit={addCustomSection}> {/* Wrap in form */}
                                    <div className="mt-2">
                                        <label
                                            htmlFor="custom-section-title"
                                        >
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            ref={inputRef}
                                            name="title"
                                            id="custom-section-title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border" // Added border
                                            placeholder="Enter section title"
                                            required // Make title required
                                            aria-required="true"
                                        />
                                    </div>

                                    <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <button
                                            type="submit" // Use submit type
                                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!title.trim()}
                                        >
                                            Add Section
                                        </button>
                                        <button
                                            type="button" // Explicitly type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:col-start-1 sm:mt-0"
                                            onClick={handleCloseModal} // Use handler
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default CustomSection