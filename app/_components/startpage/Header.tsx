import Image from "next/image"
import Link from "next/link"
import Menu from "../icons/menu"

const Header = () => {
    return (
        <>
            <header className="bg-black text-white shadow-md mx-auto relative z-10">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <Link href="/">
                        <div className="flex justify-start">
                            <Image src='./logo.svg' alt="Logo" width={50} height={50} />
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-green-400">ReadMePro</span>
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

                    {/* Contact Button */}
                    <div className="hidden md:block">
                        <Link legacyBehavior href="/login">
                            <a className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition">
                                Contact Us
                            </a>
                        </Link>
                    </div>

                    {/* Mobile Menu Button Baad me Dekhenge */}
                    <button
                        className="md:hidden flex items-center text-green-400 focus:outline-none"
                        aria-label="Toggle Navigation"
                    >
                        <Menu className=""/>
                    </button>
                </div>
            </header>
        </>
    )
}

export default Header


