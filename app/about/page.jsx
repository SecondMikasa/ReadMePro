import Link from "next/link"

import Header from "../_components/startpage/Header"
import Footer from "../_components/startpage/Footer"

const AboutPage = () => {
    return (
        <div className="bg-[#1b1d1e] bg-dot-8-s-2-neutral-950 text-white">
            <Header />

            <main className="flex-grow container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-4">
                        <span className="block">
                            About
                        </span>
                        <span className="block text-green-400">
                            ReadMePro
                        </span>
                    </h1>
                    <p
                        className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-2xl"
                    >
                        Simplifying documentation, one README at a time.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-10 text-lg text-gray-300">
                    <section className="bg-gray-900/50 p-6 rounded-lg shadow border border-gray-700">
                        <h2 className="text-2xl font-semibold text-green-400 mb-4">
                            Our Mission
                        </h2>
                        <p>
                            ReadMePro was born from a simple observation: creating and maintaining high-quality README files can be tedious and time-consuming. Developers often juggle markdown syntax, structure, and content updates manually. Our mission is to provide a fast, intuitive, and powerful tool that streamlines this process, allowing developers to focus more on coding and less on documentation friction.
                        </p>
                    </section>

                    <section className="bg-gray-900/50 p-6 rounded-lg shadow border border-gray-700">
                        <h2 className="text-2xl font-semibold text-green-400 mb-4">
                            Why ReadMePro?
                        </h2>
                        <p>
                            We believe that good documentation is crucial for any project's success. A well-crafted README serves as the front door, guiding users and contributors effectively. ReadMePro tackles common pain points by offering:
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-300">
                            <li>
                                <span className="font-medium text-green-300">
                                    Structure & Consistency:
                                </span>
                                &nbsp;
                                <span>
                                    Template sections ensure key information isn't missed.
                                </span>
                            </li>
                            <li>
                                <span className="font-medium text-green-300">
                                    Speed & Efficiency:
                                </span>
                                &nbsp;
                                <span>
                                    Quickly add, remove, and reorder sections with ease.
                                </span>
                            </li>
                            <li>
                                <span className="font-medium text-green-300">
                                    Flexibility:
                                </span>
                                &nbsp;
                                <span>
                                    Custom sections allow you to tailor the README precisely to your project's needs.
                                </span>
                            </li>
                            <li>
                                <span className="font-medium text-green-300">
                                    Persistence:
                                </span>
                                &nbsp;
                                <span>
                                    Auto-saving means you never lose your progress.
                                </span>
                            </li>
                        </ul>
                    </section>

                    <section className="bg-gray-900/50 p-6 rounded-lg shadow border border-gray-700">
                        <h2 className="text-2xl font-semibold text-green-400 mb-4">
                            The Creator
                        </h2>
                        <p className="mb-4">
                            ReadMePro is a project developed and maintained by 
                            &#8239;
                            <Link
                                legacyBehavior href="https://arnimfolio.vercel.app/"
                            >
                                <a className="text-green-300 hover:underline font-medium">
                                    Kumar Arnim
                                </a>
                            </Link>
                            <span>
                                . It reflects a passion for developer tools and improving workflows within the software development lifecycle.
                            </span>
                        </p>
                        <p>
                            Feedback and contributions are always welcome! Feel free to check out the project on GitHub.
                        </p>
                        <div className="mt-6">
                            <a
                                href="https://github.com/SecondMikasa/ReadMePro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-github mr-2" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                </svg>
                                View on GitHub
                            </a>
                        </div>
                    </section>
                </div>

                <div className="text-center mt-20">
                    <Link legacyBehavior href="/editor">
                        <a className="px-8 py-3 bg-green-500 border border-transparent hover:bg-green-600 text-white text-lg rounded-lg shadow-lg transition transform hover:scale-105">
                            Start Creating Your README
                        </a>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default AboutPage