"use client";

import { useEffect, useState } from "react";
import { LogoSvg } from "../../logo_svg";
import ProfileCard from "../../profileCard";
import RootSignIn from "../../signin/root-signin";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";

const RootHeader = () => {

    const { user, signOut } = useAuthStore();

    const [showSignin, setShowSignin] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);

    const handleProfileClick = () => setShowProfileCard(prev => !prev);

    const handleSignOut = async () => {
        await signOut();
        setShowProfileCard(false);
    };

    useEffect(() => {
        if (user && showSignin) {
            setShowSignin(false);
        }
    }, [user, showSignin]);

    return (
        <header className="w-full min-h-screen">
            <div className="relative container mx-auto">
                <div className="flex items-center justify-between p-4">
                    <div className="w-[110px] h-12">
                        <LogoSvg />
                    </div>

                    {user ? (
                        <button onClick={handleProfileClick} className="flex items-center gap-2">
                            <p className="text-sm font-medium">{user.full_name}</p>
                            <Image
                                src={user.avatar_url || "/images/user.png"}
                                alt="profile picture"
                                width={36}
                                height={36}
                                className="object-contain shrink-0 w-9 aspect-square rounded-full"
                            />
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowSignin(true)}
                            className="flex items-center gap-2"
                        >
                            <p className="text-sm font-medium">Sign in</p>
                            <div className="size-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="34"
                                    height="34"
                                    viewBox="0 0 34 34"
                                    fill="none"
                                >
                                    <path
                                        d="M17 33C25.8366 33 33 25.8366 33 17C33 8.16344 25.8366 1 17 1C8.16344 1 1 8.16344 1 17C1 25.8366 8.16344 33 17 33Z"
                                        stroke="#707070"
                                    />
                                    <path
                                        d="M16.3657 16.4235C18.615 16.4235 20.4384 14.6 20.4384 12.3507C20.4384 10.1014 18.615 8.27802 16.3657 8.27802C14.1164 8.27802 12.293 10.1014 12.293 12.3507C12.293 14.6 14.1164 16.4235 16.3657 16.4235Z"
                                        stroke="#707070"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M22.184 23.4053H28.0022M25.0931 20.4962V26.3144M22.6687 21.7122C22.3908 20.1356 21.5321 18.7204 20.2621 17.7458C18.992 16.7712 17.4029 16.308 15.8081 16.4475C14.2133 16.587 12.7287 17.3192 11.6472 18.4995C10.5656 19.6798 9.96574 21.2226 9.96582 22.8235"
                                        stroke="#707070"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            </div>
                        </button>
                    )}
                </div>

                {showProfileCard && user && (
                    <div className="absolute top-16 right-5 w-[80vw] sm:w-[440px] z-40">
                        <ProfileCard
                            name={user.full_name}
                            email={user.email}
                            profilePic={user.avatar_url || "/images/user.png"}
                            onSignOut={handleSignOut}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-12 max-w-7xl w-[75vw] mt-[10vh] mx-auto px-3 sm:px-8">
                    <h1 className="text-[clamp(2rem,3.5vw,4rem)] font-bold text-[#121211] text-center">
                        AI-Powered Cloud Storage Reinvented with DNA, Graphene & Brain Signals
                    </h1>
                    <p className="text-[#74726f] text-center text-[clamp(1rem,1.5vw,2rem)] sm:px-10">
                        Neuron fuses Artificial Intelligence, synthetic biology, and advanced materials to unlock the future of cloud storage and human-data interaction.
                    </p>
                    <div className="flex justify-center items-center gap-9 sm:flex-row flex-col">
                        <button
                            style={{ background: "linear-gradient(336.57deg, rgba(0, 74, 185, 0.4) 32.06%, rgba(255, 245, 253, 0.4) 78.63%), linear-gradient(138.02deg, #0D6AFF 5.96%, #004AB9 96.24%)" }}
                            className="text-white px-5 py-2.5 rounded-full font-medium shadow-lg hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)]"
                            onClick={user ? handleSignOut : () => setShowSignin(true)}
                            >

                            {user ? "Sign out" : "Create account"}
                        </button>
                        <button
                            style={{ background: "linear-gradient(147deg, #4B4E53 0%, #000000 74%)" }}
                            className="text-white px-5 py-2.5 rounded-full font-medium shadow-lg hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)]"
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = "/neuron.exe";
                                link.download = "neuron.exe";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            >
                            Download App
                        </button>
                        <a
                            href="#pricing"
                            className="text-[#121211] font-medium underline underline-offset-auto"
                        >
                            See plans and pricing 
                        </a>
                    </div>
                </div>

                <div className="mt-14">
                    <video
                        width={1500}
                        height={1073}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        style={{ display: "block", marginInline: "auto" }}
                    >
                        <source src="/videos/overview_video.webm" type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            {showSignin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <RootSignIn
                        setShowSignin={setShowSignin}
                        isUserRegistered={false}
                        onUserNotFound={() => {
                            console.warn("User not found");
                        }}
                    />
                </div>
            )}
        </header>
    );
};

export default RootHeader;

// function VisitorCounter() {
//     const [visitorCount, setVisitorCount] = useState(0);

//     useEffect(() => {
//         const fetchVisitorCount = async () => {
//             try {
//                 const { count, error } = await supabase
//                     .from('visitors')
//                     .select('*', { count: 'exact' });

//                 if (error) throw error;

//                 setVisitorCount(count ?? 0);
//             } catch (error) {
//                 console.error('Error fetching visitor count:', error);
//             }
//         };

//         fetchVisitorCount();
//     }, []);

//     return (
//         <div>
//             <p>Total Visitors: {visitorCount}</p>
//         </div>
//     );
// }