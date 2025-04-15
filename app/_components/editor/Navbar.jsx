"use client"

import Link from 'next/link'
import Image from 'next/image'

import useDeviceDetect from '@/hooks/useDeviceDetect'

const Navbar = ({
    selectedSectionSlugs,
    getTemplate,
    setShowModal,
    onMenuClick,
    isDrawerOpen,
}) => {

    const { isMobile } = useDeviceDetect()

    const markdown = selectedSectionSlugs?.reduce((acc, section) => {
        const template = getTemplate(section)
        if (template) {
            return `${acc}${template?.markdown}`
        } else {
            return acc
        }

    }, ``)
    // Initial value of the accumulator (empty string in this case)

    const downloadMarkdownFile = () => {
        const a = document.createElement("a")
        const blob = new Blob([markdown])
        a.href = URL.createObjectURL(blob)
        a.download = "README.md"
        a.click()

        if (isMobile && isDrawerOpen) {
            onMenuClick()
        }

        setShowModal(true)
    }

    return (
        <nav className='bg-black text-white shadow-md mx-auto relative z-10'>
            <div className='container mx-auto flex justify-between items-center py-4 px-6'>

                {/* Home Button */}
                <Link href="/">
                    <div className="flex justify-start">
                        <Image
                            src='./logo.svg'
                            alt="Logo"
                            width={50}
                            height={50}
                        />
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-green-400">
                                ReadMePro
                            </span>
                        </div>
                    </div>
                </Link>


                <div className="flex flex-row-reverse gap-5 md:flex-row">
                    <button
                        type="button"
                        className="group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 overflow-hidden bg-[#22c55e] text-black shadow-lg hover:shadow-green-500/30"
                        onClick={downloadMarkdownFile}
                    >
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 16L12 8M12 16L9 13M12 16L15 13M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="relative hidden md:inline-block">
                            Download
                        </span>
                    </button>
                </div>

            </div>
        </nav>
    )
}

export default Navbar