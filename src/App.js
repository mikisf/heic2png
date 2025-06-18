import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import heic2any from 'heic2any'

function App() {
    const [convertedURL, setConvertedURL] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0]
        setIsLoading(true) // Show loader

        try {
            const convertedBlob = await heic2any({
                blob: file,
                toType: 'image/png',
            })

            const url = URL.createObjectURL(convertedBlob)
            setConvertedURL(url)
        } catch (err) {
            console.error('Conversion error:', err)
            alert('Failed to convert the file.')
        } finally {
            setIsLoading(false) // Hide loader
        }
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/heic': ['.heic'] },
    })

    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem' }}>
            <h2>HEIC to PNG Converter (Client-side)</h2>
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #aaa',
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#fafafa',
                    cursor: 'pointer',
                }}
            >
                <input {...getInputProps()} />
                <p>Drag & drop a .HEIC file, or click to select one</p>
            </div>

            {convertedURL && (
                <div style={{ marginTop: '2rem' }}>
                    <a
                        href={convertedURL}
                        download="converted.png"
                    >
                        <button>Download PNG</button>
                    </a>
                    <br />
                    <img
                        src={convertedURL}
                        alt="Converted preview"
                        style={{ marginTop: '1rem', maxWidth: '100%' }}
                    />
                </div>
            )}

            {/* Fullscreen Loader */}
            {isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div className="loader" />
                </div>
            )}

            {/* Spinner CSS */}
            <style>{`
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

export default App
