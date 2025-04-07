import { useEffect, useState } from "react"

import {
    KeyboardSensor,
    MouseSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DndContext,
    closestCenter
} from "@dnd-kit/core"
import {
    arrayMove,
    sortableKeyboardCoordinates,
    SortableContext,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

import useLocalStorage from "../../../hooks/useLocalStorage"

import SortableItem from "./sortable-item";
import CustomSection from "./custom-section";

const keybabCaseToTitleCase = (str) => {
    return str
        .split("-")
        .map((word) => {
            return word.slice(0, 1).toUpperCase() + word.slice(1)
        })
        .join(" ")
}

const SectionColumn = ({
    selectedSectionSlugs,
    setSelectedSectionSlugs,
    sectionSlugs,
    setSectionSlugs,
    focusedSectionSlug,
    setFocusedSectionSlug,
    templates,
    originalTemplate,
    setTemplates,
    getTemplate
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const [pageRefreshed, setPageRefreshed] = useState(false)
    const [addAction, setAddAction] = useState(false)
    const [currentSlugList, setCurrentSlugList] = useState([])
    const [slugsFromPreviousSession, setSlugsFromPreviousSession] = useState([])

    const { saveBackup, deleteBackup } = useLocalStorage()

    let alphabetizedSectionSlugs = sectionSlugs.sort()

    useEffect(() => {
        var slugsFromPreviousSession = localStorage.getItem("current-slug-list") == null ?
            "title-and-description"
            :
            localStorage.getItem("current-slug-list")

        setSlugsFromPreviousSession(slugsFromPreviousSession)

        if (slugsFromPreviousSession.length > 0) {
            setPageRefreshed(true)

            let slugsList = []

            var hasMultipleSlugsFromPreviousSession = slugsFromPreviousSession.indexOf(",") > -1

            hasMultipleSlugsFromPreviousSession ?
                (slugsList = slugsFromPreviousSession.split(","))
                :
                slugsList.forEach(function (entry) {
                    setSectionSlugs((prev) => prev.filter((s) => s != entry));
                })

            setCurrentSlugList(slugsList)
            setSelectedSectionSlugs(slugsList)
            setFocusedSectionSlug(currentSlugList[0])

            localStorage.setItem("current-focused-slug", slugsList[0])
        }
    }, [])

    useEffect(() => {
    if(selectedSectionSlugs){
        localStorage.setItem("current-slug-list", selectedSectionSlugs.join(","));
    }
    }, [selectedSectionSlugs])

    useEffect(() => {
        if (selectedSectionSlugs) {    
            localStorage.setItem("current-focused-slug", focusedSectionSlug || selectedSectionSlugs[0])
            setFocusedSectionSlug(localStorage.getItem("current-focused-slug"))
        }
    }, [focusedSectionSlug])

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setSelectedSectionSlugs((sections) => {
                const oldIndex = sections.findIndex((s) => s === active.id)
                const newIndex = sections.findIndex((s) => s === over.id)

                const newSections = arrayMove(sections, oldIndex, newIndex)

                return newSections
            })
        }
    }

    const onAddSection = (sectionSlug) => {
        setSectionSlugs(prev => prev.filter(s => s !== sectionSlug))
        setSelectedSectionSlugs(prev => [...prev, sectionSlug])
        setFocusedSectionSlug(sectionSlug)
        setAddAction(true)
    }

    const onDeleteSection = (e, sectionSlug) => {
        e.stopPropagation()
        setSelectedSectionSlugs((prev) => prev.filter((s) => s !== sectionSlug))
        setSectionSlugs((prev) => [...prev, sectionSlug])
        setFocusedSectionSlug(null)
        localStorage.setItem("current-focused-slug", "noEdit")
    }

    const onResetSection = (e, sectionSlug) => {
        e.stopPropagation()
        let originalSection
        if (sectionSlug.slice(0, 6) === "custom") {
            const sectionTitle = keybabCaseToTitleCase(
                sectionSlug.slice(6, sectionSlug.length)
            )
            originalSection = {
                slug: sectionSlug,
                name: sectionTitle,
                markdown: `
                    ## ${sectionTitle}
                    `,
            }
        }
        else {
            originalSection = originalTemplate.find((s) => s.slug === sectionSlug)
        }

        const newTemplates = templates.map((s) => {
            if (s.slug === originalSection.slug) {
                return originalSection
            }
            return s
        })

        setTemplates(newTemplates)
        saveBackup(newTemplates)
    }

    const resetSelectedSections = () => {
        const data = localStorage.getItem("current-slug-list")

        const sectionResetConfirmed = window.confirm("All sections of your readme will be removed, to continue, click OK")

        if (sectionResetConfirmed) {
            const slugList = data ? data.split(",") : []
            setSectionSlugs((prev) => [
                ...prev, ...slugList
            ].filter((s) => s !== "title-and-description")
            )
            setSelectedSectionSlugs(["title-and-description"])
            setFocusedSectionSlug("title-and-description")

            localStorage.setItem("current-focused-slug", "noEdit")

            setTemplates(originalTemplate)

            deleteBackup()
        }
    }

    return (
        <div className="sections">
            <h3 className="flex items-center justify-between border-transparent text-green-500 whitespace-nowrap px-1 border-b-2 font-medium text-sm focus:outline-none">
                <div className="flex items-center bg-green-500 text-black font-semibold px-4 py-1 rounded-md shadow-md">
                    <img
                        className="w-auto h-5 mr-2"
                        src="sections.svg"
                        alt="Stacks"
                    />
                    Sections
                </div>
                <button
                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-1 rounded-md shadow-md transition-colors duration-200"
                    type="button"
                    onClick={resetSelectedSections}
                >
                    <img
                        className="w-auto h-5 mr-1"
                        src="reset.svg"
                        alt="Reset"
                    />
                    Reset
                </button>
            </h3>

            <div className="full-screen overflow-y-scroll px-3 pr-4">
                {
                    selectedSectionSlugs.length > 1 &&
                    (
                        <h4 className="text-xs leading-6 text-white mb-3">
                            Click on a section below to edit the contents
                        </h4>
                    )
                }

                <ul className="space-y-3 mb-12">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={selectedSectionSlugs}
                        >
                            {
                                (
                                    pageRefreshed || addAction ?
                                        (
                                            selectedSectionSlugs = [...new Set(selectedSectionSlugs)]
                                        )
                                        :
                                        "",
                                    selectedSectionSlugs.map((s) => {
                                        const template = getTemplate(s);
                                        if (template) {
                                            return (
                                                <SortableItem
                                                    key={s}
                                                    id={s}
                                                    section={template}
                                                    focusedSectionSlug={focusedSectionSlug}
                                                    setFocusedSectionSlug={setFocusedSectionSlug}
                                                    onDeleteSection={onDeleteSection}
                                                    onResetSection={onResetSection}
                                                />
                                            )
                                        }
                                    })
                                )
                            }
                        </SortableContext>
                    </DndContext>
                </ul>

                {
                    sectionSlugs.length > 0 &&
                    (
                        <h4 className="text-xs leading-6 text-white mb-3">
                            Click on a section below to add it to your readme
                        </h4>
                    )
                }

                <CustomSection
                    setSelectedSectionSlugs={setSelectedSectionSlugs}
                    setFocusedSectionSlug={setFocusedSectionSlug}
                    setPageRefreshed={setPageRefreshed}
                    setAddAction={setAddAction}
                    setTemplates={setTemplates}
                />

                <ul className="space-y-3 mb-12">
                    {
                        (
                            pageRefreshed && slugsFromPreviousSession.indexOf("title-and-description") === -1 ?
                                sectionSlugs.push("title-and-description")
                                :
                                "",
                            alphabetizedSectionSlugs.map((s) => {
                                const template = getTemplate(s)
                                if (template) {
                                    return (
                                        <li key={s}>
                                            <button
                                                className="flex items-center w-full h-full py-2 pl-3 pr-6 bg-white rounded-md shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 hover:bg-gray-50 transition-colors duration-200"
                                                type="button"
                                                onClick={() => onAddSection(s)}
                                            >
                                                <span className="text-gray-700 text-center font-medium">
                                                    {template.name}
                                                </span>
                                            </button>
                                        </li>
                                    )
                                }
                            })
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

export default SectionColumn