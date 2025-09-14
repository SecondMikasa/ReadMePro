"use client"
import { useState } from "react"

import Image from "next/image"
import Link from "next/link"

const Header = () => {
    const [mobileMenu, setMobileMenu] = useState(false)

    return (
        <>
            <header className="bg-black text-white shadow-md mx-auto relative z-10">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">

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

                    {/* Navigation Links */}
                    <nav className="hidden md:flex space-x-6">
                        <Link legacyBehavior href="/">
                            <a className="hover:text-green-400 transition">Home</a>
                        </Link>
                        <Link legacyBehavior href="/features">
                            <a className="hover:text-green-400 transition">Features</a>
                        </Link>
                        <Link legacyBehavior href="/about">
                            <a className="hover:text-green-400 transition">About</a>
                        </Link>
                    </nav>

                    {/* Markdown Guide Button */}
                    <div className="hidden md:block">
                        <Link legacyBehavior href="/markdown">
                            <a className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition">
                                Markdown Guide
                            </a>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex items-center text-green-400 focus:outline-none"
                        aria-label="Toggle Navigation"
                        onClick={() => setMobileMenu(true)}
                    >
                        {
                            !mobileMenu && (
                                <Image
                                    height={30}
                                    width={30}
                                    src={"/menu.svg"}
                                    alt="Menu"
                                />
                            )
                        }
                    </button>
                </div>

                {/* Mobile Menu - Right Aligned */}
                {mobileMenu && (
                    <div className="fixed top-0 right-0 h-full w-64 bg-black border-l border-gray-800 z-50 shadow-lg">
                        <div className="flex justify-end p-4">
                            <button
                                onClick={() => setMobileMenu(false)}
                                className="text-green-400"
                                aria-label="Close Menu"
                            >
                                <Image
                                    height={30}
                                    width={30}
                                    src={"/cross.svg"}
                                    alt="Cross"
                                />
                            </button>
                        </div>
                        <nav className="flex flex-col p-6">
                            <Link legacyBehavior href="/">
                                <a className="py-3 text-center hover:text-green-400 transition border-b border-gray-800">
                                    Home
                                </a>
                            </Link>
                            <Link legacyBehavior href="/features">
                                <a className="py-3 text-center hover:text-green-400 transition border-b border-gray-800">
                                    Features
                                </a>
                            </Link>
                            <Link legacyBehavior href="/about">
                                <a className="py-3 text-center hover:text-green-400 transition border-b border-gray-800">
                                    About
                                </a>
                            </Link>
                            <div className="mt-6 text-center">
                                <Link legacyBehavior href="/markdown">
                                    <a className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition inline-block w-full">
                                        Markdown Guide
                                    </a>
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}

            </header>
        </>
    )
}

export default Header