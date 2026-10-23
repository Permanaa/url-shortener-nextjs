'use client'

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RedirectCode() {
    const params = useParams();
    const code = params.code

    const [error, setError] = useState("")
    const [url, setUrl] = useState("...")

    useEffect(() => {
        const getUrl = async () => {
          try {
            const data = await fetch(`http://localhost:1804/shortnd/${code}`)
              const url = await data.json()

              console.log(url)

            if (!url.success) {
                setError(url.error)
            } else {
              setUrl(url.data.url)
            }

            } catch (e) {
                console.log('error fetching url:', e)
          }
        }

        getUrl()
    }, [])

    useEffect(() => {
        if (url) {
            setTimeout(() => {
                window.location.href = url
            }, 3000)
        }
    }, [url])

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
            <main className="flex-1 items-center justify-center h-full">
                <div className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1
                      className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.12]"
                      style={{ textWrap: 'balance' }}
                    >
                        Shortnd.
                    </h1>
                    <p className="pt-2">You are being redirected to {url}</p>
                    {!!error && (
                        <p className='text-red-400'>{error}</p>
                    )}
                </div>
            </main>
        </div>
    )
}
