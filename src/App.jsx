import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'

const App = () => {
    const [imageSrc, setImageSrc] = useState(null)
    const webcamRef = useRef(null)

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setImageSrc(imageSrc)
    }, [webcamRef])

    const WebcamComponent = () => (
        <Webcam
            screenshotQuality={1}
            audio={false}
            ref={webcamRef}
            screenshotFormat='image/png'
            className='w-full max-w-md aspect-video rounded-xl border-2 border-gray-700 shadow-lg'
        />
    )

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center gap-6 px-4 py-8'>
            <h1 className='text-2xl md:text-3xl font-semibold text-white drop-shadow-md'>
                React Camera App
            </h1>

            <WebcamComponent />

            <div className='flex gap-6 mt-4'>
                {/* Capture Button */}
                <button
                    onClick={capturePhoto}
                    className='w-16 h-16 rounded-full border-[6px] border-gray-100 bg-white hover:bg-gray-200 transition-all shadow-xl relative'
                >
                    <div className='absolute inset-2 rounded-full bg-gray-900'></div>
                </button>

                {/* Secondary/Dummy Button */}
                <button className='w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-xl'>
                    <div className='w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1'></div>
                </button>
            </div>

            {imageSrc && (
                <div className='mt-6 text-center'>
                    <img
                        src={imageSrc}
                        alt='Captured'
                        className='w-full max-w-xs rounded-lg border border-gray-600 shadow-md mb-3'
                    />
                    <a
                        href={imageSrc}
                        download
                        className='inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition'
                    >
                        Download
                    </a>
                </div>
            )}
        </div>
    )
}

export default App
