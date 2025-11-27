import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'

const App = () => {
    const [imageSrc, setImageSrc] = useState(null)

    const [capturing, setCapturing] = useState(false)
    const [recordedChunks, setRecordedChunks] = useState([])
    const [videoBlob, setVideoBlob] = useState(null)

    const [timer, setTimer] = useState(0)

    const webcamRef = useRef(null)
    const mediaRecorderRef = useRef(null)

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setImageSrc(imageSrc)
    }, [webcamRef])

    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => [...prev, data])
            }
        },
        [setRecordedChunks]
    )

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true)
        setTimer(0)
        setVideoBlob(null)
        setRecordedChunks([])

        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: 'video/webm',
        })
        mediaRecorderRef.current.addEventListener(
            'dataavailable',
            handleDataAvailable
        )
        mediaRecorderRef.current.start()
    }, [webcamRef, setCapturing, handleDataAvailable])

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop()
        setCapturing(false)
    }, [mediaRecorderRef, setCapturing])

    useEffect(() => {
        if (recordedChunks.length && !capturing) {
            const blob = new Blob(recordedChunks, {
                type: 'video/webm',
            })
            const url = URL.createObjectURL(blob)
            setVideoBlob(url)
            setRecordedChunks([])
        }
    }, [recordedChunks, capturing])

    useEffect(() => {
        let interval = null
        if (capturing) {
            interval = setInterval(() => {
                setTimer((prevTime) => prevTime + 1)
            }, 1000)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [capturing])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center gap-6 px-4 py-8'>
            <h1 className='text-2xl md:text-3xl font-semibold text-white drop-shadow-md'>
                React Camera App
            </h1>

            <div className='relative w-full max-w-md'>
                <Webcam
                    screenshotQuality={1}
                    audio={true}
                    muted={true}
                    ref={webcamRef}
                    screenshotFormat='image/png'
                    className='w-full aspect-video rounded-xl border-2 border-gray-700 shadow-lg'
                />

                {capturing && (
                    <div className='absolute top-4 right-4 bg-red-600/90 text-white px-3 py-1 rounded-md font-mono text-sm animate-pulse'>
                        REC {formatTime(timer)}
                    </div>
                )}
            </div>

            <div className='flex gap-6 mt-4'>
                <button
                    disabled={capturing}
                    onClick={capturePhoto}
                    className={`w-16 h-16 rounded-full border-[6px] border-gray-100 bg-white hover:bg-gray-200 transition-all shadow-xl relative ${
                        capturing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title='Take Photo'
                >
                    <div className='absolute inset-2 rounded-full bg-gray-900'></div>
                </button>

                {capturing ? (
                    <button
                        onClick={handleStopCaptureClick}
                        className='w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-xl border-4 border-white'
                        title='Stop Recording'
                    >
                        <div className='w-6 h-6 bg-white rounded-sm'></div>
                    </button>
                ) : (
                    <button
                        onClick={handleStartCaptureClick}
                        className='w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-xl'
                        title='Start Recording'
                    >
                        <div className='w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1'></div>
                    </button>
                )}
            </div>

            <div className='flex flex-wrap justify-center gap-6 mt-6'>
                {imageSrc && (
                    <div className='text-center'>
                        <p className='text-sm text-gray-400 mb-2'>
                            Captured Photo
                        </p>
                        <img
                            src={imageSrc}
                            alt='Captured'
                            className='w-full max-w-xs rounded-lg border border-gray-600 shadow-md mb-3'
                        />
                        <a
                            href={imageSrc}
                            download='photo.png'
                            className='inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition'
                        >
                            Download Photo
                        </a>
                    </div>
                )}

                {videoBlob && (
                    <div className='text-center'>
                        <p className='text-sm text-gray-400 mb-2'>
                            Recorded Video
                        </p>
                        <video
                            src={videoBlob}
                            controls
                            className='w-full max-w-xs rounded-lg border border-gray-600 shadow-md mb-3'
                        />
                        <a
                            href={videoBlob}
                            download='video.webm'
                            className='inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition'
                        >
                            Download Video
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
