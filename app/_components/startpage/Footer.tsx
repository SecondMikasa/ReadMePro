import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center mt-10">
        {/* Left Section */}
        <div className="mb-4 md:mb-0">
          <p className="text-center md:text-left">
            Made With ❤️ By &nbsp;
            <span className="hover:text-green-400 font-semibold">
              <Link
                href="https://arnimfolio.vercel.app/"
              >
                Kumar Arnim
              </Link>
            </span>
          </p>
        </div>

        {/* Right Section */}
        <div className="text-center md:text-right">
          <p>
            Star this project at{' '}
            <a
              href="https://github.com/SecondMikasa/ReadMePro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <p className="text-center py-4 text-sm">
          © {new Date().getFullYear()} ReadMePro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer