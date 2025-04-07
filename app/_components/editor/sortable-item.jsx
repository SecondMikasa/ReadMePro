import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils";

const SortableItem = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        maxWidth: "300px", // Set maximum width for the entire component
    }

    const onClickSection = () => {
        localStorage.setItem("current-focused-slug", props.id)
        props.setFocusedSectionSlug(props.id)
    }

    const onKeyUp = (e) => {
        if (e.key.toLowerCase() === "enter") {
            onClickSection()
        }
    }

    const onClickTrash = (e) => {
        e.stopPropagation()
        props.onDeleteSection(e, props.section.slug)
    }

    const onClickReset = (e) => {
        e.stopPropagation()
        const sectionResetConfirmed = window.confirm("This section will be reset to default template; To Continue, Click OK")
        if (sectionResetConfirmed) {
            props.onResetSection(e, props.section.slug)
        }
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            onClick={onClickSection}
            onKeyUp={onKeyUp}
            className={cn(
                "bg-white shadow rounded-md px-4 py-2 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 relative select-none mx-0 group",
                props?.section?.slug === props.focusedSectionSlug
                    ? "ring-2 ring-green-400"
                    : ""
            )}
        >
            <div className="flex items-center min-w-0 flex-shrink">
                <button
                    type="button"
                    className="mr-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 flex-shrink-0"
                    {...listeners}
                >
                    <img
                        className="w-5 h-5"
                        src="./drag.svg"
                        alt="Drag handle"
                    />
                </button>
                <p className="text-gray-800 truncate font-medium max-w-[200px]">
                    {props?.section?.name}
                </p>
            </div>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                {props?.section?.slug === props.focusedSectionSlug ? (
                    <>
                        <button
                            type="button"
                            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                            onClick={onClickReset}
                        >
                            <img
                                className="w-5 h-5 hover:opacity-70 transition-opacity"
                                src="./reset.svg"
                                alt="Reset Icon"
                            />
                        </button>
                        <button
                            type="button"
                            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                            onClick={onClickTrash}
                        >
                            <img
                                className="w-5 h-5 hover:opacity-70 transition-opacity"
                                src="./delete.svg"
                                alt="Trash Icon"
                            />
                        </button>
                    </>
                ) : (
                        <div
                            className="w-[66px]"
                        />
                        // Placeholder to maintain consistent width
                )}
            </div>
        </li>
    )
}

export default SortableItem