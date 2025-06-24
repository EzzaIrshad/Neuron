"use client"
import React from 'react'
import { LogoIconSvgWhite, LogoSvg } from '../logo_svg'
import { FacebookIcon, GoogleIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from '../socialIcons'

const RootFooter = () => {
    const navigation = [
        {
            title: "Product",
            links: [
                "Feature",
                "Pricing",
                "Case studies",
                "Reviews",
                "Updates"
            ]
        },
        {
            title: "Company",
            links: [
                "About",
                "Contact Us",
                "Careers",
                "Culture",
                "Blog"
            ]
        },
        {
            title: "Support",
            links: [
                "Getting started",
                "Help center",
                "Server status",
                "Report a bug",
                "Chat support"
            ]
        },
        {
            title: "Downloads",
            links: [
                "iOS",
                "Android",
                "Mac",
                "Windows",
                "Chrome"
            ]
        },
    ];

    return (
        <div className='w-full bg-[#1E2939]'>
            <div className='w-full bg-[#101828]'>
                <div className='container mx-auto px-10 '>
                    <div className='flex max-sm:flex-col py-15 max-sm:gap-10 max-sm:items-center  justify-between'>
                        <div className='w-[177px] h-[70px]'>
                            <LogoIconSvgWhite />
                        </div>
                        <p className='text-[#cac5be] text-lg max-sm:w-[80vw] w-[35vw]'>Secure. Smart. Scalable. Effortless cloud storage for all your files — anytime, anywhere.</p>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-10'>
                <div className='flex flex-wrap py-20 gap-x-10 gap-y-15 border-b border-b-[#d3d5db]'>
                    <div className='xl:w-[60%] w-full flex flex-wrap gap-10'>
                        {
                            navigation.map((item, index) => (
                                <div key={index} className='flex flex-1 min-w-[110px] flex-col gap-10'>
                                    <h4 className='text-white text-lg font-bold'>{item.title}</h4>
                                    <ul className='space-y-2'>
                                        {item.links.map((link, index) => (
                                            <li key={index} className='text-[#ebebeb] text-[1vw] cursor-pointer'>{link}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        }
                    </div>

                    <div id="subscribe" className='xl:w-[30%] flex flex-col gap-10 '>
                        <h4 className='text-white text-xl font-bold'>Subscribe to our newsletter</h4>
                        <div className='flex flex-col gap-6'>
                            <p className="text-md text-[#ebebeb]">
                                We care about your data. Read our <a href="#" className="cursor-pointer hover:underline font-bold">Privacy Policy</a>
                            </p>

                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="w-full rounded-full px-6 py-4.5 bg-white border border-[#c0bdb8] text-base shadow-[0_2px_12px_0_rgba(20,20,43,0.08))] placeholder:text-[#74726f] focus:outline-none "

                            />
                            <button
                                type="submit"
                                style={{ background: "linear-gradient(336.57deg, rgba(0, 74, 185, 0.4) 32.06%, rgba(255, 245, 253, 0.4) 78.63%), linear-gradient(138.02deg, #0D6AFF 5.96%, #004AB9 96.24%)"}}
                                className="w-fit px-6 py-3 rounded-full font-semibold shadow-xs text-white transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)] hover:shadow-[0_8px_15px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 focus:outline-none cursor-pointer select-none"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex max-lg:flex-col-reverse gap-y-5 justify-between py-[2vw] bg-[#1E2939]'>
                    <p className='text-white text-[1vw]'>Copyright © 2025 Neuron | All Rights Reserved </p>
                    <div className='flex gap-8 items-center cursor-pointer'>
                        {[
                            { icon: <GoogleIcon /> },
                            { icon: <FacebookIcon /> },
                            { icon: <WhatsappIcon /> },
                            { icon: <LinkedinIcon /> },
                            { icon: <TwitterIcon /> },
                        ].map(({ icon }, i) => (
                            <div
                                key={i}
                                className="hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 hover:bg-transparent rounded-full transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)] cursor-pointer"
                            >
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RootFooter


