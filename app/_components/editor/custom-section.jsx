import { Fragment, useRef, useState } from "react"

import useLocalStorage from '../../../hooks/useLocalStorage'

import {
    Dialog,
    DialogBackdrop,
    DialogTitle,
    Transition,
    TransitionChild
} from "@headlessui/react"

const CustomSection = ({
    setTemplates,
    setSelectedSectionSlugs,
    setFocusedSectionSlug,
    setPageRefreshed,
    setAddAction
}) => {

    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState("")

    const { saveBackup } = useLocalStorage()

    const inputRef = useRef(null)

    const addCustomSection = () => {
        setShowModal(false)

        const safeTitle = title || "untitled"
        // Handle empty title case

        const slug = "custom-" + safeTitle.toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/[^\w-]+/g, ''); // Remove non-word characters except hyphens

        const section = {
            slug: slug || `custom-section-${Date.now()}`,
            name: safeTitle,
            markdown: `
                ## ${safeTitle}
            `,
        }

        localStorage.setItem("current-focused-slug", section.slug)
        setTemplates((prev) => {
            const newTemplates = [...prev, section]
            return newTemplates
        })

        setPageRefreshed(false)
        setAddAction(true)
        setSelectedSectionSlugs((prev) => [...prev, section.slug])
        setFocusedSectionSlug(localStorage.getItem("current-focused-slug"))
    }

    return (
        <>
            <Transition
                show={showModal}
                as={Fragment}
            >
                <Dialog
                    as="div"
                    className="relative z-50"
                    initialFocus={inputRef}
                    onClose={() => setShowModal(false)}
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
                        <DialogBackdrop
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        />
                    </TransitionChild>

                    {/* Modal Panel Container */}
                    <div className="fixed inset-0 z-10 overflow-y-auto"> 
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div
                                    className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                                >
                                    <div>
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left"> 
                                            <DialogTitle
                                                as="h3"
                                                className="text-lg font-semibold leading-6 text-gray-900 text-center"
                                            >
                                                New Custom Section
                                            </DialogTitle>
                                            <div
                                                className="mt-4"
                                            >
                                                <input
                                                    type="text"
                                                    ref={inputRef}
                                                    name="Title"
                                                    id="title"
                                                    value={title} onChange={(e) => setTitle(e.target.value)}
                                                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                    placeholder="Section Title"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 sm:col-start-2 disabled:opacity-50"
                                            disabled={!title}
                                            onClick={addCustomSection}
                                        >
                                            Add Section
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                            onClick={() => {
                                                setShowModal(false);
                                                setTitle("")
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <div className="mb-3">
                <button
                    className="flex items-center justify-center w-full py-2 px-4 bg-white font-semibold rounded-md shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 hover:bg-gray-50 transition-colors duration-200"
                    type="button"
                    onClick={() => setShowModal(true)}
                >
                    <img
                        className="w-5 h-5"
                        src="./plus.svg"
                        alt=""
                    /> 
                    <span className="ml-2 text-gray-800">
                        Custom Section
                    </span>
                </button>
            </div >
        </>
    )
}

export default CustomSection