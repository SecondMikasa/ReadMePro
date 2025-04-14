import Link from "next/link" // Keep if using Next.js links
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm" // Plugin for GitHub Flavored Markdown (tables, strikethrough, etc.)

import RawPreview from "./raw-preview" // Assuming this component exists and works

import { cn } from "../../../lib/utils" // Assuming path is correct
import { TAB } from "../../../lib/constants" // Assuming path is correct

export const PreviewColumn = ({
    selectedSectionSlugs,
    getTemplate,
    selectedTab,
}) => {
    // Ensure slugs are unique, though the parent state should handle this
    const uniqueSelectedSlugs = [...new Set(selectedSectionSlugs)];

    // Generate the combined markdown string from selected sections
    const combinedMarkdown = uniqueSelectedSlugs.reduce((acc, slug) => {
        const template = getTemplate(slug);
        // Add template markdown if found, otherwise add nothing
        // Add newline between sections for better separation
        return template ? `${acc}${template.markdown}\n\n` : acc;
    }, ""); // Start with an empty string

    const showPreview = selectedTab === TAB.PREVIEW;

    return (
        <div
            className={cn(
                "h-full w-full border border-gray-600 rounded-md p-6 preview bg-white text-black", // Base styles
                "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none", // Tailwind typography styles (adjust sizes as needed)
                showPreview ? "overflow-y-auto" : "overflow-hidden" // Conditional overflow
            )}
        >
            {showPreview ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // Enable GFM features
                    // children prop is deprecated, use content prop or pass markdown as children
                    // content={combinedMarkdown} // If using newer versions? Check react-markdown docs
                    // Or simply:
                >
                    {combinedMarkdown}
                </ReactMarkdown>
                // TODO: Add custom components if needed, e.g., for links or images
                // components={{
                //     a: ({ node, ...props }) => ( // Example for external links
                //         <a href={props.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                //             {props.children}
                //         </a>
                //     ),
                //     // Add other custom renderers here
                // }}

            ) : (
                 // Assuming RawPreview handles displaying raw text appropriately
                <RawPreview text={combinedMarkdown} />
            )}
        </div>
    );
};