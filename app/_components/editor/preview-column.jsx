import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm" // Plugin for GitHub Flavored Markdown (tables, strikethrough, etc.)

import RawPreview from "./raw-preview" 

import { cn } from "../../../lib/utils" 
import { TAB } from "../../../lib/constants" 

export const PreviewColumn = ({
    selectedSectionSlugs,
    getTemplate,
    selectedTab,
}) => {
    // Ensure slugs are unique, though the parent state should handle this
    const uniqueSelectedSlugs = [...new Set(selectedSectionSlugs)]

    // Generate the combined markdown string from selected sections
    const combinedMarkdown = uniqueSelectedSlugs.reduce((acc, slug) => {
        const template = getTemplate(slug)
        // Add template markdown if found, otherwise add nothing
        // Add newline between sections for better separation
        return template ? `${acc}${template.markdown}\n\n` : acc
    }, "")

    const showPreview = selectedTab === TAB.PREVIEW;

    return (
        <div
            className={cn(
                "h-full w-full border border-gray-600 rounded-md p-6 preview bg-white text-black", 
                "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none", 
                showPreview ? "overflow-y-auto" : "overflow-hidden" 
            )}
        >
            {
                showPreview ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // Enable GFM features
                >
                    {combinedMarkdown}
                </ReactMarkdown>
                // TODO: Add custom components if needed, e.g., for links or images
            ) : (
                <RawPreview text={combinedMarkdown} />
            )}
        </div>
    )
}