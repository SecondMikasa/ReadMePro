"use client"
export const Loader = () => {

    const size = 48
    const outerColor = "#16a34a"
    const innerColor = "#ef4444"

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center rounded shadow-lg">
            <p className="text-lg font-medium text-gray-800 mb-4">
                Loading Editor...
            </p>

            <div
                className="relative inline-block rounded-full animate-spin"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderColor: outerColor,
                    animationName: 'loaderSpin',
                    animationDuration: '1s',
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: `${size * 0.833}px`,
                        height: `${size * 0.833}px`,
                        borderRadius: '50%',
                        borderWidth: '3px',
                        borderStyle: 'solid',
                        borderColor: `${innerColor} transparent transparent transparent`
                    }}
                />
                <style jsx>
                    {`
                        @keyframes loaderSpin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        </div>
    )
}