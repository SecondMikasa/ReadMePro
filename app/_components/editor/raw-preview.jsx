import { useRef, useState } from "react";

const RawPreview = ({ text }) => {
    const [copySuccess, setCopySuccess] = useState(false)

    const textAreaRef = useRef(null)

    const copyToClipboard = async (e) => {
        e.preventDefault()
        if (textAreaRef.current) {
            try {
                await navigator.clipboard.writeText(textAreaRef.current.value)
                setCopySuccess(true)
                setTimeout(() => {
                    setCopySuccess(false)
                }, 3000)
            } catch (err) {
                console.error('Failed to copy text: ', err)
            }
        }
    }

    return (
        <div className="h-full relative">
            <button
                className="absolute top-0 right-7 focus:outline-none"
                type="button"
                onClick={copyToClipboard}
            >
                {
                    !copySuccess ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 hover:text-emerald-500 focus:outline-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-emerald-500 focus:outline-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                        </svg>
                    )}
            </button>
            <textarea
                ref={textAreaRef}
                readOnly
                className="h-full w-full resize-none focus:outline-none"
                value={text}
            />
        </div>
    )
}

export default RawPreview