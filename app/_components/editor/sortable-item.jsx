import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { cn } from "@/lib/utils"

const SortableItem = (props) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: props.id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        // maxWidth: "300px", 
        // // Max width might be better handled by the parent container
    }

    const onClickSection = () => {
        // Use the setter function passed down from parent
        props.setFocusedSectionSlug(props.id)
    }

    // For accessibility
    const onKeyUp = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault() 
            onClickSection()
        }
    }

    const onClickTrash = (e) => {
        // e.stopPropagation() 
        // // Already done in parent handler if needed
        props.onDeleteSection(e, props.section.slug)
    }

    const onClickReset = (e) => {
        e.stopPropagation() // Prevent triggering onClickSection
        const sectionResetConfirmed = window.confirm(
            `Reset "${props.section.name}" to its default content?`
        )
        if (sectionResetConfirmed === true) {
            props.onResetSection(e, props.section.slug)
        }
    }

    const isFocused = props?.section?.slug === props.focusedSectionSlug

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes} // Spread attributes here for Sortable
            onClick={onClickSection}
            onKeyUp={onKeyUp}
            role="button" // Add role for accessibility
            tabIndex={0} // Make it focusable
            aria-pressed={isFocused} // Indicate selection state
            className={cn(
                "bg-white shadow rounded-md px-3 py-3 flex items-center justify-between min-h-[44px]",
                "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-400", // Use focus-visible
                "relative select-none group transition-shadow",
                isFocused ? "ring-2 ring-green-500 shadow-md" : "hover:shadow-md"
            )}
        >
            {/* Drag Handle and Name */}
            <div className="flex items-center min-w-0 flex-1 mr-2">
                {/* Drag Handle */}
                <button
                    type="button"
                    className="mr-2 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-400 rounded flex-shrink-0 cursor-grab active:cursor-grabbing min-w-[44px] min-h-[44px] flex items-center justify-center"
                    {...listeners} // Listeners for dragging on the handle
                    aria-label={`Drag ${props.section.name}`}
                    tabIndex={-1} // Prevent handle from being tabbed to separately
                >
                    <img className="w-5 h-5 text-gray-500" src="/drag.svg" alt="" aria-hidden="true" />
                </button>

                {/* Name (Truncated) */}
                <p className="text-gray-800 truncate font-medium text-sm flex-1">
                    {props?.section?.name || "Unnamed Section"}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {isFocused || props.section.slug.startsWith('custom-') || props.section.slug !== 'title_and_description' ? ( // Show buttons if focused OR custom OR not title/desc
                    <>
                        <button
                            type="button"
                            className="p-2 rounded hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
                            onClick={onClickReset}
                            aria-label={`Reset ${props.section.name} section content`}
                            title="Reset Section Content"
                        >
                            <img className="w-4 h-4 text-gray-600 hover:text-indigo-600" src="/reset.svg" alt="" aria-hidden="true" />
                        </button>

                        {/* Prevent deleting title_and_description */}
                        {props.section.slug !== 'title_and_description' && (
                            <button
                                type="button"
                                className="p-2 rounded hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                onClick={onClickTrash}
                                aria-label={`Delete ${props.section.name} section`}
                                title="Delete Section"
                            >
                                <img className="w-4 h-4 text-gray-600 hover:text-red-600" src="/delete.svg" alt="" aria-hidden="true" />
                            </button>
                        )}
                    </>
                ) : (
                    // Placeholder to maintain layout consistency when buttons are hidden
                    <div
                        className="w-[60px] h-[24px]"
                    /> 
                )}
            </div>
        </li>
    )
}

export default SortableItem