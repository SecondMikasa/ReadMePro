"use client"
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const MarkdownPage = () => {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div
      className={
        cn(
          "min-h-screen scroll-smooth",
          darkMode ? 'bg-[#1b1d1e]' : 'bg-white'
        )
      }
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-12 text-center text-green-500 dark:text-green-400">
          Markdown Cheat Sheet
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-10">
          <div className="space-y-12">
            <section id="headings">
              <h2
                className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Headings
              </h2>

              <div className="space-y-4">
                <pre
                  className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-md text-sm text-black dark:text-gray-300 overflow-x-auto">
                  {`# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6`}
                </pre>
                <div className="p-4 border bg-black dark:text-white border-gray-200 dark:border-gray-700 rounded-md space-y-2">
                  <h1 className="text-3xl font-bold">
                    H1
                  </h1>
                  <h2 className="text-2xl font-semibold">
                    H2
                  </h2>
                  <h3 className="text-xl font-medium">
                    H3
                  </h3>
                  <h4 className="text-lg">
                    H4
                  </h4>
                  <h5 className="text-base font-semibold">
                    H5
                  </h5>
                  <h6 className="text-sm font-semibold">
                    H6
                  </h6>
                </div>
              </div>
            </section>

            {/* --- Text Formatting --- */}
            <section id="text-formatting" className="anchor">
              <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Text Formatting
              </h2>
              <div className="space-y-4">
                <pre className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`**Bold Text** or __Bold Text__\n*Italic Text* or _Italic Text_\n~~Strikethrough~~\n\`Inline code\`\nSuperscript: X^2^\nSubscript: H~2~O`}
                </pre>
                <div className="p-4 border bg-black dark:text-white border-gray-200 dark:border-gray-700 rounded-md space-y-2">
                  <p><strong className="font-bold">Bold Text</strong> or <strong className="font-bold">Bold Text</strong></p>
                  <p><em className="italic">Italic Text</em> or <em className="italic">Italic Text</em></p>
                  <p><del className="line-through">Strikethrough</del></p>
                  <p><code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-red-600 dark:text-red-400">Inline code</code></p>
                  <p>Superscript: X<sup>2</sup></p>
                  <p>Subscript: H<sub>2</sub>O</p>
                </div>
              </div>
            </section>

            {/* --- Lists --- */}
            <section id="lists" className="anchor">
              <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Lists
              </h2>
              <div className="space-y-4">
                <pre className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`1. Ordered item 1\n2. Ordered item 2\n   1. Nested ordered item\n\n- Unordered item (or * or +)\n- Another item\n  - Nested unordered item`}
                </pre>
                <div className="p-4 border bg-black dark:text-white border-gray-200 dark:border-gray-700 rounded-md space-y-2">
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Ordered item 1</li>
                    <li>Ordered item 2
                      <ol className="list-decimal pl-6 mt-1">
                        <li>Nested ordered item</li>
                      </ol>
                    </li>
                  </ol>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Unordered item</li>
                    <li>Another item
                      <ul className="list-disc pl-6 mt-1">
                        <li>Nested unordered item</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* --- Links & Images --- */}
            <section id="links-images" className="anchor">
              <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Links & Images
              </h2>
              <div className="space-y-4">
                <pre className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`[Link Text](https://www.example.com "Link Title")\n\n![Alt text](https://fastly.picsum.photos/id/47/4272/2848.jpg?hmac=G8dXSLa-ngBieraQt5EORu-4r6tveX3fhvBTZM0Y8xM "Image Title")`}
                </pre>
                <div className="p-4 border bg-black dark:text-white border-gray-200 dark:border-gray-700 rounded-md space-y-2">
                  <p>
                    <a href="https://www.example.com" title="Link Title" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Link Text
                    </a>
                  </p>
                  <Image
                    width={100}
                    height={100}
                    src="https://fastly.picsum.photos/id/47/4272/2848.jpg?hmac=G8dXSLa-ngBieraQt5EORu-4r6tveX3fhvBTZM0Y8xM" // Dark placeholder matching theme
                    alt="Alt text"
                    title="Image Title"
                    className="mt-4 rounded-md max-w-[150px] border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </section>

            {/* --- Code Blocks --- */}
            <section id="code-blocks" className="anchor">
              <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Code Blocks
              </h2>
              <div className="space-y-4">
                <pre className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`\`\`\`javascript\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\``}
                </pre>
                {/* Rendered Code Block */}
                  <pre className="p-4 border bg-black dark:text-white border-gray-200 dark:border-gray-700 rounded-md space-y-2 overflow-x-auto">
                  <code className="language-javascript">{`function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');`}</code>
                </pre>
              </div>
            </section>

            {/* --- Tables --- */}
            <section id="tables" className="anchor">
              <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Tables
              </h2>
              <div className="space-y-4">
                <pre className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`| Syntax      | Description |\n| :---------- | :----------: |\n| Header      | Title       |\n| Paragraph   | Text        |`}
                </pre>
                <div className="overflow-x-auto">
                  <table className="min-w-full border bg-black dark:text-white border-gray-200 dark:border-gray-700 rounded-md space-y-2">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="py-2 px-4 text-left border-b border-r dark:border-gray-600">Syntax</th>
                        <th className="py-2 px-4 text-center border-b dark:border-gray-600">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b dark:border-gray-600">
                        <td className="py-2 px-4 border-r dark:border-gray-600">Header</td>
                        <td className="py-2 px-4 text-center">Title</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-r dark:border-gray-600">Paragraph</td>
                        <td className="py-2 px-4 text-center">Text</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* --- Blockquotes --- */}
            <section id="blockquotes" className="anchor">
              <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Blockquotes
              </h2>
              <div className="space-y-4">
                <pre className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`> This is a blockquote.\n> It can span multiple lines.`}
                </pre>
                <blockquote className="bg-black border-l-4 border-gray-400 dark:border-gray-500 pl-4 italic text-white">
                  <p>This is a blockquote.</p>
                  <p>It can span multiple lines.</p>
                </blockquote>
              </div>
            </section>

            {/* --- Horizontal Rule --- */}
            <section id="horizontal-rule" className="anchor">
              <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Horizontal Rule
              </h2>
              <div className="space-y-4">
                <pre className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`--- (Or *** or ___)`}
                </pre>
                <hr className="border-gray-300 dark:border-gray-600 my-6" />
              </div>
            </section>
          </div>

          {/* Sidebar - Sticky Positioning */}
          {/* Added self-start to prevent stretching and ensure sticky works correctly within grid */}
          <aside className="sticky top-20 self-start hidden md:block">
            {/* Hide on mobile, use sticky on medium+ */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Quick Links
              </h3>
              <nav>
                <ul className="space-y-2">
                  <li><a href="#headings" className="text-blue-600 hover:underline text-sm">Headings</a></li>
                  <li><a href="#text-formatting" className="text-blue-600 hover:underline text-sm">Text Formatting</a></li>
                  <li><a href="#lists" className="text-blue-600 hover:underline text-sm">Lists</a></li>
                  <li><a href="#links-images" className="text-blue-600 hover:underline text-sm">Links & Images</a></li>
                  <li><a href="#code-blocks" className="text-blue-600 hover:underline text-sm">Code Blocks</a></li>
                  <li><a href="#tables" className="text-blue-600 hover:underline text-sm">Tables</a></li>
                  <li><a href="#blockquotes" className="text-blue-600 hover:underline text-sm">Blockquotes</a></li>
                  <li><a href="#horizontal-rule" className="text-blue-600 hover:underline text-sm">Horizontal Rule</a></li>
                </ul>
              </nav>
            </div>
          </aside>
        </div>

        {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="dark-mode-toggle fixed bottom-6 right-6 
                        bg-green-500 hover:bg-green-600 text-white 
                        dark:bg-blue-600 dark:hover:bg-blue-700 
                        p-5 rounded-full shadow-lg 
                        transition-all duration-200 ease-in-out 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-green-500 dark:focus:ring-blue-500 
                        dark:ring-offset-gray-900
                        z-50"
              title="Toggle Dark Mode"
              aria-label="Toggle between light and dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
      </div>
    </div>
  )
}

export default MarkdownPage