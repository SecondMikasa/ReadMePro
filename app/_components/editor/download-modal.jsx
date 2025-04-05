import { useEffect, useRef } from 'react';
import Image from 'next/image';

const DownloadModal = ({ setShowModal }) => {
    const modalRef = useRef(null);

    const closeModal = () => setShowModal(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Focus on the modal when it opens
        modalRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div
            className="fixed z-50 inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-90"
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            ref={modalRef}
            tabIndex="-1"
        >
            <div className="bg-black text-white rounded-lg shadow-2xl max-w-md w-full p-8">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center">
                            <Image src='./idone.svg' alt='Download Done' height={150} width={150} />
                        </div>
                    </div>
                    <h3
                        id="modal-title"
                        className="text-2xl font-semibold mb-4 text-white"
                    >
                        README Generated Successfully!
                    </h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-green-500 hover:bg-green-600 transition-colors text-white font-medium py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;
