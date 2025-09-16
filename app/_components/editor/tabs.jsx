import Image from "next/image"

import ColumnHeader from "./column-header" 
import { TAB } from "../../../lib/constants" 

const Tabs = ({
    selectedTab,
    setSelectedTab,
    focusedSectionSlug,
    toggleTheme,
    toggleState
}) => {
    return (
        <div className="flex w-full items-end px-3 md:px-0 relative z-10"> 
            
             {/* Editor Tab and Theme Toggle */}
            <div className="flex items-center border-b border-gray-600 pb-0"> 
                <ColumnHeader.Tab
                    isActive={selectedTab === TAB.EDITOR}
                    className="pb-3" 
                    onClick={() => setSelectedTab(TAB.EDITOR)}
                >
                    Editor
                </ColumnHeader.Tab>
                 {/* Show toggle only if a section is selected */}
                {focusedSectionSlug && (
                    <button
                        onClick={toggleTheme}
                        aria-label="Color Mode"
                        className="ml-2 mb-2 toggle-dark-mode focus:outline-none transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none relative z-10 w-12 h-12" // Added margin and padding
                    >
                        <Image
                            fill
                            className="w-auto" 
                            alt={toggleState.theme === 'vs-dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            src={`/${toggleState.img}`} 
                        />
                    </button>
                 )}
            </div>

             {/* Preview/Raw Tabs */}
            <div className="flex flex-1 justify-end border-b border-gray-600">
                <nav
                    className="-mb-px flex space-x-4 sm:space-x-8" 
                    aria-label="Tabs"
                >
                    <ColumnHeader.Tab
                        isActive={selectedTab === TAB.PREVIEW}
                        className="pb-3"
                        onClick={() => setSelectedTab(TAB.PREVIEW)}
                    >
                        Preview
                    </ColumnHeader.Tab>
                    <ColumnHeader.Tab
                        isActive={selectedTab === TAB.RAW}
                        className="pb-3"
                        onClick={() => setSelectedTab(TAB.RAW)}
                    >
                        Raw
                    </ColumnHeader.Tab>
                </nav>
            </div>
        </div>
    )
}

export default Tabs