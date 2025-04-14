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
        <div className="flex">
            <div className="flex flex-0 pb-3">
                <ColumnHeader.Tab
                    isActive={selectedTab === TAB.EDITOR}
                    className="flex-1"
                    onClick={() => setSelectedTab(TAB.EDITOR)}
                >
                    Editor
                </ColumnHeader.Tab>
                {
                    focusedSectionSlug ? (
                        <button
                            onClick={toggleTheme}
                            aria-label="Color Mode"
                            className="toggle-dark-mode focus:outline-none transition hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none"
                        >
                            <img
                                className="w-auto h-8 mr-2"
                                alt={toggleState.theme}
                                src={toggleState.img}
                            />
                        </button>
                    ) : (
                        <button />
                    )
                }
            </div>
            <div className="flex flex-1 justify-end border-b border-gray-200">
                <nav
                    className="-mb-px flex space-x-8"
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