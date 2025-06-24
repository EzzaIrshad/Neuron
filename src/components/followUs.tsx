import React from 'react'
import { FacebookIcon, GoogleIcon, LinkedinIcon, TwitterIcon, WhatsappIcon } from './socialIcons'

const FollowUs = () => {
    return (
        <div className='w-full mt-25'>
            <div className='container mx-auto px-10 py-12'>
                <div className='flex gap-6'>
                    <span className='text-[#121211] font-medium'>Follow us/</span>
                    <div className='flex gap-5 items-center'>
                        {[
                            { icon: <GoogleIcon />},
                            { icon: <FacebookIcon /> },
                            { icon: <WhatsappIcon />},
                            { icon: <LinkedinIcon /> },
                            { icon: <TwitterIcon />},
                        ].map(({ icon}, i) => (
                            <div key={i}
                                className="hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 bg-transparent rounded-full transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)] cursor-pointer"
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

export default FollowUs