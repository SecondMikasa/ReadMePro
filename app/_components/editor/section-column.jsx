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

// Remove useLocalStorage import - handled by parent
import SortableItem from "./sortable-item"
import CustomSection from "./custom-section"

const keybabCaseToTitleCase = (str) => {
    if (!str) return "";
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const SectionColumn = ({
    selectedSectionSlugs,
    setSelectedSectionSlugs, // Renamed prop for clarity
    availableSectionSlugs, // Renamed prop
    focusedSectionSlug,
    setFocusedSectionSlug, // Renamed prop
    templates,
    setTemplates, // Renamed prop
    getTemplate,
    originalTemplates, // Receive original templates for reset
    handleResetAll
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Remove local state for pageRefreshed, addAction, slugsFromPreviousSession

    // No useEffect needed here for localStorage loading/saving

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            // Call the setter function passed from parent
            setSelectedSectionSlugs((currentSlugs) => {
                const oldIndex = currentSlugs.indexOf(active.id)
                const newIndex = currentSlugs.indexOf(over.id)
                if (oldIndex === -1 || newIndex === -1) return currentSlugs // Safety check
                return arrayMove(currentSlugs, oldIndex, newIndex)
            })
            // No need to update localStorage here - parent's useEffect handles it
        }
    };

    const onAddSection = (sectionSlugToAdd) => {
        // Call the parent state setters
        setSelectedSectionSlugs((prev) => [...prev, sectionSlugToAdd]);
        setFocusedSectionSlug(sectionSlugToAdd);
        // No need to manage available slugs here, parent calculates it
        // No need for addAction flag
    };

    const onDeleteSection = (e, sectionSlugToDelete) => {
        e.stopPropagation();

        // Update selected slugs via parent setter
        const updatedSections = selectedSectionSlugs.filter(s => s !== sectionSlugToDelete);
        setSelectedSectionSlugs(updatedSections)

        // Handle focus change via parent setter
        if (focusedSectionSlug === sectionSlugToDelete) {
            const newFocus = updatedSections.length > 0 ? updatedSections[0] : null;
            setFocusedSectionSlug(newFocus)
        }
        // No need to update localStorage - parent handles it
        // No need to manually add back to available slugs - parent calculates it
    };

    const onResetSection = (e, sectionSlugToReset) => {
        e.stopPropagation()

        const originalSectionData = originalTemplates.find(
            (s) => s.slug === sectionSlugToReset
        );

        // Find custom section data if it exists (to keep its structure but reset markdown)
        const currentCustomSection = templates.find(t => t.slug === sectionSlugToReset && t.slug.startsWith('custom-'));

        let sectionToRestore;

        if (originalSectionData) {
            sectionToRestore = { ...originalSectionData }; // Use data from original defaults
        } else if (currentCustomSection) {
            // Reset custom section to its initial state
            sectionToRestore = {
                slug: currentCustomSection.slug,
                name: currentCustomSection.name, // Keep the custom name
                markdown: `\n## ${currentCustomSection.name}\n`, // Default markdown for the custom title
            };
        } else {
            console.error(`Cannot find original or custom template data for slug: ${sectionSlugToReset}`);
            return; // Don't proceed if no data found
        }


        // Update the main templates array via parent setter
        setTemplates((currentTemplates) => {
            const newTemplates = currentTemplates.map((t) =>
                t.slug === sectionSlugToReset ? sectionToRestore : t
            )
            // Ensure the section exists if it wasn't found before (edge case)
            if (!newTemplates.some(t => t.slug === sectionSlugToReset)) {
                newTemplates.push(sectionToRestore)
            }
            return newTemplates
        });
        // Parent's useEffect will handle saving the updated templates array
        console.log(`Reset content for section: ${sectionSlugToReset}`)
    };

    // Use the reset handler passed from the parent (page.jsx)
    // const resetSelectedSections = () => { ... } // Remove this logic, use parent's handleResetAll

    return (
        // Added flex column and overflow handling
        <div
            className="sections flex flex-col h-full bg-gray-800 md:bg-transparent rounded-lg md:rounded-none"
        >
            <h3
                className="flex-shrink-0 flex items-center justify-between border-b border-gray-700 md:border-transparent text-green-500 whitespace-nowrap px-4 py-3 md:px-1 md:py-2 font-medium text-sm"
            >
                <div
                    className="flex items-center bg-green-500 text-black font-semibold px-3 py-1 rounded-md shadow"
                >
                    <img
                        className="w-auto h-4 mr-2"
                        src="/sections.svg"
                        alt="Sections"
                    />
                    Sections
                </div>
                {/* Reset button moved to Navbar or kept here if preferred */}
                <button
                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-md shadow transition-colors duration-200"
                    type="button"
                    onClick={handleResetAll} 
                >
                     <img className="w-auto h-4 mr-1" src="/reset.svg" alt="Reset"/>
                     Reset All
                 </button>
            </h3>

            {/* Make the list areas scrollable */}
            <div className="flex-1 overflow-y-auto px-3 pr-4 pb-6 custom-scrollbar"> {/* Added custom-scrollbar class if needed */}
                {selectedSectionSlugs.length > 0 && (
                    <h4 className="text-xs leading-6 text-gray-300 md:text-white mb-3 mt-2 px-1">
                        Click to edit, drag to reorder.
                    </h4>
                )}

                <ul className="space-y-2 mb-6"> {/* Adjusted spacing */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext items={selectedSectionSlugs}>
                            {selectedSectionSlugs.map((slug) => {
                                const template = getTemplate(slug)
                                // Ensure template exists before rendering SortableItem
                                return template ? (
                                    <SortableItem
                                        key={slug}
                                        id={slug}
                                        section={template}
                                        focusedSectionSlug={focusedSectionSlug}
                                        setFocusedSectionSlug={setFocusedSectionSlug} // Pass down setter
                                        onDeleteSection={onDeleteSection} // Pass down handler
                                        onResetSection={onResetSection} // Pass down handler
                                    />
                                ) : (
                                    slug !== "title-and-description" && (
                                        <li key={slug} className="text-red-400 text-xs p-2">
                                            Error: Template data missing for "{slug}"
                                        </li>
                                    )

                                );
                            })}
                        </SortableContext>
                    </DndContext>
                </ul>

                {/* Custom Section Adder */}
                <CustomSection
                    // Pass only necessary props/handlers
                    setTemplates={setTemplates}
                    setSelectedSectionSlugs={setSelectedSectionSlugs}
                    setFocusedSectionSlug={setFocusedSectionSlug}
                />


                {availableSectionSlugs.length > 0 && (
                    <h4 className="text-xs leading-6 text-gray-300 md:text-white mb-3 mt-6 px-1">
                        Click to add to your README.
                    </h4>
                )}

                <ul className="space-y-2 mb-12"> {/* Adjusted spacing */}
                    {availableSectionSlugs.map((slug) => {
                        const template = getTemplate(slug) // Use getTemplate to ensure we have data
                        return template ? (
                            <li key={slug}>
                                <button
                                    className="flex items-center w-full h-full text-left py-2 pl-3 pr-6 bg-gray-200 md:bg-gray-700 rounded-md shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400 hover:bg-gray-300 md:hover:bg-gray-600 transition-colors duration-150"
                                    type="button"
                                    onClick={() => onAddSection(slug)}
                                >
                                    <span className="text-gray-700 md:text-gray-200 font-medium text-sm">
                                        {template.name}
                                    </span>
                                </button>
                            </li>
                        ) : null // Don't render if template data somehow missing
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SectionColumn