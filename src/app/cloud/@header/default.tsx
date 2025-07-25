"use client"
import Image from "next/image"
import Link from "next/link"
import { HelpIcon, PremiumIcon, SettingIcon } from "../components/icons"
import { useAuthStore } from "@/stores/useAuthStore";
import { useTableFilterStore } from "@/stores/useTableFilterStore";
import { useState } from "react";
import ProfileCard from "@/components/profileCard";

const Header = () => {
    const { user, signOut } = useAuthStore();
    const { search, setSearch } = useTableFilterStore();
    const [showProfileCard, setShowProfileCard] = useState(false);
    const handleProfileClick = () => {
        setShowProfileCard((prev) => !prev);
    };
    const handleSignOut = async () => {
        await signOut();
        setShowProfileCard(false);
    };
    return (
        <header className="flex items-center justify-between w-full h-full px-6 border-b border-gray-200">
            {/* Branding */}
            <div className="flex flow-row gap-2">
                <svg className=" size-6" xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 21 19" fill="none">
                    <path d="M19.3703 7.44834C18.8357 6.86501 18.0925 6.5537 17.3948 6.2114C17.3783 6.18861 17.5104 5.85757 17.5276 5.79519C17.9729 4.18831 17.2597 2.69104 15.8407 1.89558C15.3151 1.60093 14.2733 1.01553 13.7079 0.946067C11.9074 0.724768 10.6176 2.65339 11.5244 4.23541C11.7843 4.68884 12.1221 4.92389 12.5692 5.167C13.414 5.62655 14.3182 6.01927 15.1584 6.48382C15.2134 6.51424 15.2898 6.55258 15.3392 6.58454C15.3622 6.59926 15.3813 6.58217 15.3694 6.63677L10.2753 8.9884C8.7207 8.26505 7.14438 7.58281 5.5964 6.8457C5.56236 6.82945 5.23562 6.65844 5.2284 6.63746C5.26466 6.62329 5.33023 6.60885 5.37788 6.58676C6.29725 6.16014 7.33122 5.69212 8.21711 5.21423C10.6258 3.91478 9.22289 0.31954 6.59314 0.978297C6.11109 1.09916 4.77441 1.81765 4.34098 2.11438C3.00041 3.03208 2.51405 4.73552 3.15766 6.23626C2.58726 6.50646 1.97726 6.73554 1.48702 7.14271C-0.0883307 8.45106 -0.115698 10.846 1.41645 12.2022C1.90697 12.6364 2.55892 12.8973 3.13266 13.2041C3.10237 13.3741 3.02402 13.5283 2.98124 13.6958C2.59935 15.1888 3.26408 16.653 4.56242 17.4325C5.02905 17.7125 5.70448 18.0626 6.20084 18.2884C8.7946 19.4684 10.6725 15.8965 8.1703 14.4365L5.11101 12.8251L5.14977 12.7819L10.2755 10.4104L15.393 12.7785L15.2289 12.8847C14.2486 13.4544 13.0072 13.9416 12.0912 14.5939C10.2674 15.8927 11.4209 18.8246 13.6835 18.492C14.2214 18.413 15.4952 17.7217 15.9972 17.4176C17.4493 16.5374 18.0504 14.807 17.395 13.2171C17.8619 12.9319 18.3905 12.7406 18.8358 12.4208C20.4711 11.2465 20.7418 8.94464 19.3703 7.4482V7.44834ZM5.2127 3.08029C5.73518 2.76341 6.35476 2.51058 6.89904 2.22552C8.09278 1.94045 8.69944 3.48927 7.59031 4.09315C6.57008 4.64883 5.42386 5.07226 4.39835 5.63071L4.31195 5.64836C3.92408 4.63994 4.30611 3.62999 5.2127 3.08043V3.08029ZM7.57378 15.5743C8.51843 16.0971 7.9597 17.4899 6.91738 17.1954C6.37615 16.8986 5.76199 16.6519 5.23618 16.3353C4.36335 15.8095 3.91255 14.8219 4.29889 13.8378L7.57364 15.5744L7.57378 15.5743ZM4.6862 11.5655C4.39446 11.7328 4.11718 11.925 3.87588 12.161C3.17169 11.7282 2.31984 11.506 1.86835 10.762C1.54911 10.2358 1.47979 9.61354 1.6815 9.03147C2.03756 8.00471 3.03194 7.71965 3.92172 7.29539C4.16955 7.50002 4.42364 7.7002 4.70967 7.85009C5.92494 8.48662 7.28608 9.00354 8.53093 9.6052C8.59039 9.63396 8.6743 9.66244 8.7107 9.71926L4.68606 11.5655H4.6862ZM12.9386 3.90353C12.0659 3.33632 12.6631 1.96727 13.676 2.24844C14.0144 2.34249 14.8565 2.81731 15.1973 3.00958C16.1626 3.55414 16.632 4.51463 16.2399 5.60182L12.9386 3.90353ZM13.6286 17.1901C12.6223 17.4722 12.0141 16.1878 12.9062 15.5972C13.429 15.2514 14.1545 14.8883 14.7186 14.586C15.2112 14.3221 15.719 14.0852 16.2092 13.8163C16.266 13.811 16.2903 13.9494 16.304 13.9967C16.8415 15.8441 14.9197 16.5574 13.6284 17.1901H13.6286ZM18.7148 10.6766C18.2739 11.4806 17.4008 11.7182 16.6516 12.1435C16.4095 11.9416 16.1657 11.7421 15.8877 11.5898L11.8167 9.71939C11.8019 9.70022 11.886 9.66008 11.902 9.65202C13.1918 8.99882 14.6538 8.49246 15.9112 7.80244C16.1797 7.65505 16.4106 7.45612 16.653 7.27135C17.1342 7.53836 17.733 7.75257 18.167 8.08681C18.9656 8.70181 19.2041 9.78399 18.7146 10.6766H18.7148Z" fill="black" />
                </svg>
                <span className="text-xl font-semibold text-[#121211]">Neuron</span>
            </div>

            {/* Search */}
            <div className="flex items-center flex-1 max-w-md mx-auto w-56 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.05)] px-4 py-[1vh] gap-4">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 0C11.0052 0 11.4922 0.0651042 11.9609 0.195312C12.4297 0.325521 12.8672 0.510417 13.2734 0.75C13.6797 0.989583 14.0495 1.27865 14.3828 1.61719C14.7214 1.95052 15.0104 2.32031 15.25 2.72656C15.4896 3.13281 15.6745 3.57031 15.8047 4.03906C15.9349 4.50781 16 4.99479 16 5.5C16 6.00521 15.9349 6.49219 15.8047 6.96094C15.6745 7.42969 15.4896 7.86719 15.25 8.27344C15.0104 8.67969 14.7214 9.05208 14.3828 9.39062C14.0495 9.72396 13.6797 10.0104 13.2734 10.25C12.8672 10.4896 12.4297 10.6745 11.9609 10.8047C11.4922 10.9349 11.0052 11 10.5 11C9.84896 11 9.22396 10.8906 8.625 10.6719C8.03125 10.4531 7.48438 10.138 6.98438 9.72656L0.851562 15.8516C0.752604 15.9505 0.635417 16 0.5 16C0.364583 16 0.247396 15.9505 0.148438 15.8516C0.0494792 15.7526 0 15.6354 0 15.5C0 15.3646 0.0494792 15.2474 0.148438 15.1484L6.27344 9.01562C5.86198 8.51562 5.54688 7.96875 5.32812 7.375C5.10938 6.77604 5 6.15104 5 5.5C5 4.99479 5.0651 4.50781 5.19531 4.03906C5.32552 3.57031 5.51042 3.13281 5.75 2.72656C5.98958 2.32031 6.27604 1.95052 6.60938 1.61719C6.94792 1.27865 7.32031 0.989583 7.72656 0.75C8.13281 0.510417 8.57031 0.325521 9.03906 0.195312C9.50781 0.0651042 9.99479 0 10.5 0ZM10.5 10C11.1198 10 11.7031 9.88281 12.25 9.64844C12.7969 9.40885 13.2734 9.08594 13.6797 8.67969C14.0859 8.27344 14.4062 7.79688 14.6406 7.25C14.8802 6.70312 15 6.11979 15 5.5C15 4.88021 14.8802 4.29688 14.6406 3.75C14.4062 3.20312 14.0859 2.72656 13.6797 2.32031C13.2734 1.91406 12.7969 1.59375 12.25 1.35938C11.7031 1.11979 11.1198 1 10.5 1C9.88021 1 9.29688 1.11979 8.75 1.35938C8.20312 1.59375 7.72656 1.91406 7.32031 2.32031C6.91406 2.72656 6.59115 3.20312 6.35156 3.75C6.11719 4.29688 6 4.88021 6 5.5C6 6.11979 6.11719 6.70312 6.35156 7.25C6.59115 7.79688 6.91406 8.27344 7.32031 8.67969C7.72656 9.08594 8.20312 9.40885 8.75 9.64844C9.29688 9.88281 9.88021 10 10.5 10Z" fill="#99a1af" />
                </svg>
                <input
                    type="text"
                    placeholder="Search files ...."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-56 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                {/* Premium */}
                <Link href="/cloud/upgrade" className="hover:bg-gray-100 rounded-full p-2 transition" title="Upgrade">
                    <PremiumIcon />
                </Link>

                {/* Notification Bell */}
                <div className="relative">
                    <button
                        aria-label="Notifications"
                        className="hover:bg-gray-100 rounded-full p-2 transition relative"
                        title="Notifications"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
                            <path d="M18 8.4C18 6.7 17.37 5.07 16.24 3.87C15.12 2.67 13.59 2 12 2C10.41 2 8.88 2.67 7.76 3.87C6.63 5.07 6 6.7 6 8.4C6 15.87 3 18 3 18H21C21 18 18 15.87 18 8.4Z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21C13.55 21.3 13.3 21.55 12.99 21.73C12.69 21.9 12.35 22 12 22C11.65 22 11.31 21.9 11 21.73C10.7 21.55 10.45 21.3 10.27 21" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="absolute top-1 right-1 h-4 w-4 text-[10px] bg-blue-600 text-white rounded-full flex items-center justify-center">
                            8
                        </span>
                    </button>
                </div>

                {/* Settings */}
                <Link href="/cloud/settings" className="hover:bg-gray-100 rounded-full p-2 transition" title="Settings">
                    <SettingIcon />
                </Link>

                {/* Help */}
                <Link href="/cloud/help" className="hover:bg-gray-100 rounded-full p-2 transition" title="Help">
                    <HelpIcon />
                </Link>

                {/* User Avatar */}
                <div className="relative ml-1">
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    {user ? (
                        <button
                            onClick={handleProfileClick}
                            className="hover:scale-105 transition rounded-full p-1.5"
                        >
                            <Image
                                src={user?.avatar_url || ""}
                                alt="User Avatar"
                                width={32} height={32}
                                className="rounded-full"
                            />
                        </button>
                    ) : null}
                    {showProfileCard && user && (
                        <div className="absolute top-13 right-0 w-[33vw] z-50">
                            <ProfileCard
                                name={user.full_name}
                                email={user.email}
                                profilePic={user.avatar_url}
                                onSignOut={handleSignOut}
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header