import Link from "next/link"

const Introduction = () => {
    return (
        <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                    <span className="block text-white">
                        The fastest way to manage
                    </span>
                    <span className="block text-green-600">
                        README
                    </span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Our Markdown editor allows you to effectively manage and maintain your Readme`s on the go
                </p>
            </div>
            <div className="flex justify-center mt-6">
                <span className="inline-flex rounded-md shadow">
                    <Link legacyBehavior href="/editor">
                        <a className="px-4 py-2 bg-green-500 border border-transparent hover:bg-green-600 text-white rounded-lg shadow transition">
                            Get Started
                        </a>
                    </Link>
                </span>
            </div>
            <div className="mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <img
                        src="/demo.png"
                        alt="Editor Demo Image"
                        className="relative rounded-md shadow-lg border border-white"
                    />
                </div>
            </div>
      </div>
    )
}

export default Introduction