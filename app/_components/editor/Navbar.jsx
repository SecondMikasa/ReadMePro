"use client"

import Link from 'next/link'
import Image from 'next/image'

import useDeviceDetect from '@/hooks/useDeviceDetect'

const Navbar = ({
    selectedSectionSlugs,
    setShowModal,
    getTemplate,
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

    }, ``) // Initial value of the accumulator (empty string in this case)


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


                <div className='flex flex-row-reverse gap-5 md:flex-row'>
                    <button type='button' className='px-4 py-2 flex bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition' onClick={downloadMarkdownFile}>
                        <img className='w-auto h-6 cursor-pointer' src="./download.svg" alt="Download Button" />
                        <span className='hidden md:inline-block ml-2'>
                            Download
                        </span>
                    </button>
                </div>

            </div>
        </nav>
    )
}

export default Navbar