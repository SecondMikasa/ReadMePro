import { useEffect, useState } from "react"

import { SectionTemplates } from '@/data/section-template'
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

    const { backup, saveBackup, deleteBackup, getBackup } = useLocalStorage()

    let alphabetizedSectionSlugs = sectionSlugs.sort()

    useEffect(() => {
        // Check for backup templates first
        const backupTemplates = getBackup();
        if (backupTemplates && backupTemplates.length > 0) {
            setTemplates(backupTemplates);
        }
        
        // Then load section data
        const storedSlugs = localStorage.getItem("current-slug-list");
        if (storedSlugs) {
            const slugsArray = storedSlugs.split(",");
            setSelectedSectionSlugs(slugsArray);
            
            // Get focused slug or default to first section
            const storedFocusedSlug = localStorage.getItem("current-focused-slug");
            const focusedSlug = storedFocusedSlug && storedFocusedSlug !== "noEdit" 
                ? storedFocusedSlug 
                : slugsArray[0];
            
            setFocusedSectionSlug(focusedSlug);
            setPageRefreshed(true);
            
            // Update available slugs - make sure to get ALL possible section slugs
            const allPossibleSlugs = [...SectionTemplates.map(t => t.slug)];
            
            // Add any custom sections from templates
            if (backupTemplates) {
                backupTemplates.forEach(template => {
                    if (template.slug.startsWith('custom-') && !allPossibleSlugs.includes(template.slug)) {
                        allPossibleSlugs.push(template.slug);
                    }
                });
            }
            
            // Filter out the selected ones
            setSectionSlugs(allPossibleSlugs.filter(s => !slugsArray.includes(s)));
        }
    }, []);

    // Persist changes to localStorage
    useEffect(() => {
        if (selectedSectionSlugs.length > 0 && pageRefreshed) {
            localStorage.setItem("current-slug-list", selectedSectionSlugs.join(","));
            
            if (focusedSectionSlug) {
                localStorage.setItem("current-focused-slug", focusedSectionSlug);
            }
        }
    }, [selectedSectionSlugs, focusedSectionSlug, pageRefreshed]);

    // Save templates when they change
    useEffect(() => {
        if (pageRefreshed && templates.length > 0) {
            saveBackup(templates);
        }
    }, [templates, pageRefreshed]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setSelectedSectionSlugs((sections) => {
                const oldIndex = sections.findIndex((s) => s === active.id)
                const newIndex = sections.findIndex((s) => s === over.id);
                const newSections = arrayMove(sections, oldIndex, newIndex)
                return newSections;
            });
        }
    }

    const onAddSection = (sectionSlug) => {
        setSectionSlugs(prev => prev.filter(s => s !== sectionSlug));
        setSelectedSectionSlugs(prev => [...prev, sectionSlug]);
        setFocusedSectionSlug(sectionSlug);
        setAddAction(true);
    }

    const onDeleteSection = (e, sectionSlug) => {
        e.stopPropagation()
        
        // First update the selected sections
        const updatedSections = selectedSectionSlugs.filter(s => s !== sectionSlug);
        setSelectedSectionSlugs(updatedSections);
        
        // Add it back to available sections
        setSectionSlugs(prev => [...prev, sectionSlug]);
        
        // Handle focused section updates
        if (focusedSectionSlug === sectionSlug) {
            if (updatedSections.length > 0) {
                setFocusedSectionSlug(updatedSections[0]);
                localStorage.setItem("current-focused-slug", updatedSections[0]);
            } else {
                setFocusedSectionSlug(null);
                localStorage.setItem("current-focused-slug", "noEdit");
            }
        }
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
            originalSection = originalTemplate.find((s) => s.slug === sectionSlug);
        }

        const newTemplates = templates.map((s) => {
            if (s.slug === originalSection.slug) {
                return originalSection;
            }
            return s
        })
        setTemplates(newTemplates)
        saveBackup(newTemplates)
    }

    const resetSelectedSections = () => {
        const sectionResetConfirmed = window.confirm("All sections of your readme will be removed, to continue, click OK")

        if (sectionResetConfirmed) {
            const currentSections = [...selectedSectionSlugs];
            
            // Keep only title-and-description in selected sections
            setSelectedSectionSlugs(["title-and-description"]);
            
            // Move all other sections (except title-and-description) to available sections
            setSectionSlugs(prev => [
                ...prev, 
                ...currentSections.filter(s => s !== "title-and-description")
            ]);
            
            // Focus on title-and-description section
            setFocusedSectionSlug("title-and-description");

            // Update localStorage
            localStorage.setItem("current-focused-slug", "title-and-description");
            localStorage.setItem("current-slug-list", "title-and-description");

            // Reset templates to original
            setTemplates(originalTemplate);
            deleteBackup();
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