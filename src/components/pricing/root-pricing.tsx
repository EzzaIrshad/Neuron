"use client";
import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css"; // Import AOS styles

const RootPricing = () => {
    const [plan, setPlan] = useState(true);
    useEffect(()=>{
        Aos.init({
            duration: 1000,
            easing: "ease-in-cubic",
            offset: 100,
        });
    })
    return (
        <div id="pricing" className="w-full py-18 mt-30" style={{ background: "linear-gradient(251deg, #E2E7FF 0%, #FFEAEA 50%, #D9DAFB 100%)" }}>
            <div className="container mx-auto px-4 ">
                <div className="flex flex-col gap-24">
                    <div className="flex justify-between items-center max-lg:flex-col px-10">
                        <div className="max-w-[500px] max-lg:text-center">
                            <h1 className="text-[#74726f] font-medium text-base/6">PLANS & PRICING</h1>
                            <h2 className="text-[#121211] text-[clamp(1.8rem,5vw,2.5rem)] font-semibold mt-4">Neuron is better than traditional cloud</h2>
                        </div>
                        <div className="relative w-[220px] flex lg:self-start max-lg:mt-10 items-center gap-2 p-1 bg-white rounded-[56px] ">
                            <button onClick={() => setPlan(true)} className={`px-6 py-2 z-20 ${plan ? "text-white" : "text-[#121211]"}`}>Monthly</button>
                            <button onClick={() => setPlan(false)} className={`px-6 py-2 z-20 ${plan ? "text-[#121211]" : "text-white"}`}>Yearly</button>
                            <div className={`absolute top-1 bg-[#121211] rounded-[56px] w-[106px] h-10 transition-transform z-10 ${plan ? "translate-0" : "translate-x-full"}`} />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 col-span-1 gap-6 place-content-center mx-7 sm:mx-auto xl:mx-20">
                        <PricingCard aos="zoom-in-right" type="Basic" price="Free" storage="5 GB" />
                        <PricingCard aos="" type="Personal" price={plan ? "USD$1.99" : "USD$22.99"} storage="100 GB" />
                        <PricingCard aos="zoom-in-left" type="Standard" price={plan ? "USD$5.99" : "USD$70.99"} storage="10TB" />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default RootPricing

interface PricingCardProps {
    aos: string;
    type: string;
    price: string;
    storage: string;
}

const PricingCard = ({ aos, type, price, storage }: PricingCardProps) => {

    return (
        <div data-aos={aos} className={`max-w-[490px] flex flex-col p-6 gap-6 rounded-3xl bg-white ${type === "Personal" && "shadow-[0px_10px_20px_rgba(0,0,0,0.23)]"}`}>
            <div className="max-sm:flex max-sm:items-center max-sm:justify-between">
                <h2 className="text-[clamp(1rem,1vw,1.75rem)] font-semibold text-[#121211]">
                    <span>Neuron 365</span>
                    <br />
                    <span>{type}</span>
                </h2>
                <p className={`sm:mt-5 text-cn text-[clamp(1.6rem,2vw,2.8rem)] font-bold text-[#121211] max-md:max-w-full  ${price == "Free" && 'sm:mt-6'}`}>
                    {price}
                    <span className={`block text-sm ${price == "Free" && 'hidden'}`}>/month</span>
                </p>
            </div>
            <p className={`text-[#74726f] text-sm mt-3 pr-3`}>
                {price == "Free" ? 
                    "Get started with Neuron for free. No credit card required." :
                    (
                        <>
                            Subscription automatically renews unless cancelled in Neuron account.{" "}
                            <a href="#" className="text-[#049aff] underline">See terms.</a>
                        </>
                    )
                }
            </p>

            <button className="self-stretch px-4 py-2 w-fit text-sm tracking-wide bg-black border-2 border-[#1A1A1A] rounded-md text-white transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 focus:outline-none cursor-pointer select-none">
                {price == "Free" ? "Get started for free" : "Subscribe now"}
            </button>
            <ul className="text-xs 2xl:text-sm tracking-wide leading-6 text-neutral-500 max-md:max-w-full">
                <li className="list-disc ml-6">For one person</li>
                <li className="list-disc ml-6">{storage} of cloud storage</li>
                <li className="list-disc ml-6">Works on Windows, macOS, Linux, iOS, and Android™</li>
                <li className="list-disc ml-6">Neuron photo and file backup across your devices</li>
            </ul>
            <p className={`text-[#121211] font-medium ${price == "Free" && 'opacity-0'}`}>Premium value included</p>
        </div>
    )
}