import Image from 'next/image'
import React from 'react'

const RootDownload2 = () => {
    return (
        <div className='w-full py-36 px-5'>
            <div className='container mx-auto'>
                <div className='flex flex-col gap-14 items-center'>
                    <div className="flex flex-col gap-4 items-center">
                        <h2 className="text-[clamp(1.8rem,5vw,2.5rem)] px-5 font-semibold text-center text-[#121211]">
                            Get the Neuron mobile app
                        </h2>
                        <p className="text-base tracking-wide text-center text-[#121211]">
                            Access, edit, or share your photos and files from anywhere with the
                            Neuron PWA.
                        </p>
                    </div>
                    <div className="flex gap-12 max-md:flex-col max-md:gap-4 max-sm:gap-3">
                        <button className="px-4 py-2 text-base leading-6 tracking-wide bg-black border-2 border-[#1A1A1A] rounded-md text-white transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 focus:outline-none cursor-pointer select-none">
                            Download for iOS
                        </button>
                        <button className="max-sm:w-full max-sm:max-w-[300px] px-4 py-3 tracking-wide leading-6 bg-transparent border-2 border-[#1A1A1A] rounded-lg text-[#3B3B3B] text-base font-semibold transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)] hover:bg-[#1A1A1A] hover:text-white hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 focus:outline-none cursor-pointer select-none">
                            Download for Android
                        </button>
                    </div>
                    <div className="flex justify-center items-center p-1 bg-white rounded-xl shadow-[0_0_12px_2px_rgba(0,0,0,0.15)]">
                        <Image
                            src="/images/qr_code.png"
                            className="aspect-square"
                            alt="QR Code"
                            width={176}
                            height={176}

                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RootDownload2