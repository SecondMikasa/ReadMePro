import Link from "next/link"

import Header from "../_components/startpage/Header"
import Footer from "../_components/startpage/Footer"

import {
  TemplateIcon,
  PlusCircleIcon,
  SaveIcon,
  DownloadIcon,
  ArrowsExpandIcon,
  EyeIcon
} from '@heroicons/react/outline'

const features = [
  {
    name: 'Template-Based Sections',
    description: 'Start quickly by selecting from a variety of pre-defined README sections like Introduction, Installation, Usage, and more.',
    icon: TemplateIcon
  },
  {
    name: 'Drag & Drop Reordering',
    description: 'Effortlessly organize your README structure by simply dragging and dropping sections into your preferred order.',
    icon: ArrowsExpandIcon
  },
  {
    name: 'Custom Section Creation',
    description: 'Need something unique? Easily create your own custom sections with the exact title and content you require.',
    icon: PlusCircleIcon
  },
  {
    name: 'Local Storage Persistence',
    description: 'Your work is automatically saved to your browser\'s local storage, so you can pick up right where you left off, even after refreshing.',
    icon: SaveIcon
  },
  {
    name: 'Live Markdown Preview',
    description: 'See your formatted README take shape in real-time as you edit your markdown content.',
    icon: EyeIcon
  },
  {
    name: 'Easy Markdown Download',
    description: 'Once you\'re finished, download your complete README.md file with a single click, ready to be added to your project.',
    icon: DownloadIcon
  },
]

const FeaturesPage = () => {
  return (
    <div className="bg-[#1b1d1e] bg-dot-8-s-2-neutral-950 text-white">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-4">
            <span className="block">
              Powerful Features of
            </span>
            <span className="block text-green-400">
              ReadMePro
            </span>
          </h1>
          <p
            className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
          >
            Everything you need to create professional, well-structured README files efficiently.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {
            features.map((feature) => (
              <div
                key={feature.name}
                className="bg-gray-900/50 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
              <div className="flex items-center mb-4">
                  <feature.icon
                    className="h-8 w-8 text-green-400 mr-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <h3
                    className="text-xl font-semibold text-green-400">
                    {feature.name}
                  </h3>
              </div>
                <p className="text-gray-300">
                  {feature.description}
                </p>
            </div>
            ))
          }
        </div>

        <div className="text-center mt-20">
          <Link
            legacyBehavior href="/editor"
          >
            <a
              className="px-8 py-3 bg-green-500 border border-transparent hover:bg-green-600 text-white text-lg rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Try ReadMePro Now
            </a>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}

export default FeaturesPage