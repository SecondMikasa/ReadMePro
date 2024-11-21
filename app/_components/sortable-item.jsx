import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

const SortableItem = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const onClickSection = () => {
        localStorage.setItem("current-focused-ring", props.id)
        props.setFocusedSectionSLug(props.id)
    }

    const onKeyUp = (e) => {
        if (e.key.toLowerCase() === "enter") {
            onClickSection()
        }
    }

    const onClickTrash = (e) => {
        props.onDeleteSection(e, props.section.slug)
    }

    const onClickReset = (e) => {
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
            className={`bg-white shadow rounded-md pl-1 pr-14 py-2 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 relative select-none ${props?.section?.slug === props.focusesSectionSlug ? "ring-2 ring-green-400" : ""
                }`}
        >
            <button type="button" className="mr-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400" {...listeners}>
                <img className="w-5 h-5" src="./draw.svg" />
            </button>
            <p>
                {props?.section?.name}
            </p>
            {props?.section?.slug === props.focusesSectionSlug && (
                <>
                    <button type="button" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 absolute right-8" onClick={onClickReset}>
                        <img className="w-5 h-5" src="./reset.svg" alt="Reset Icon" />
                    </button>
                    <button type="button" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 absolute right-2" onClick={onClickTrash}>
                        <img className="w-5 h-5" src="./delete.svg" alt="Trash Icon" />
                    </button>
                </>
            )}
        </li>
    )
}