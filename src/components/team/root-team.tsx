
import Image from "next/image"
import { FacebookIcon, GoogleIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "../socialIcons"
import Aos from "aos"
import "aos/dist/aos.css" // Import AOS styles

const RootTeam = () => {
    Aos.init({
        duration: 500,
        easing: "ease-out-sine",
        offset: 100,
    });
    const teamMembers = [
        {
            name: "Ezza Irshad",
            role: "Front-End Developer",
            image: "/images/team_1.png",
            facebook: "https://www.facebook.com/",
            github: "https://github.com/EzzaIrshad",
            linkedIn: "https://www.linkedin.com/in/ezza-irshad/",
            Google: "mailto:ezzairshad19@gmail.com",
        },
        {
            name: "Aneela Kiran",
            role: "BackEnd Developer",
            image: "/images/team_2.png",
            facebook: "https://www.facebook.com/",
            github: "https://github.com/Aneela-Kiran",
            linkedIn: "https://www.linkedin.com/in/aneelakiran/",
            twitter: "https://x.com/AneelaKira45",
            Google: "mailto:aneelakiran839@gmail.com"
        }
    ]

    return (
        <div id="team" className="w-full px-2.5 py-35 mt-6" style={{ background: "url('/images/team_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-16 max-sm:items-center">
                    <div>
                        <h2 className="text-[#121211] text-[clamp(1.8rem,5vw,2.5rem)] font-semibold">Our Talented Team</h2>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-30 px-6">
                        {
                            teamMembers.map((member, index) => (
                                <div data-aos="zoom-in" key={index} className="flex items-center max-sm:flex-col max-sm:max-w-[385px] p-1 rounded-[28px] bg-white shadow-[0_4px_12px_2px_rgba(0,0,0,0.15)]">
                                    <div className="flex-1">
                                        <Image src={member.image} alt="team_1" width={372} height={400} className="max-sm:h-[60vw] rounded-3xl object-cover object-top" />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between p-6 h-full">
                                        <div className="flex flex-col gap-3 text-[#74726f]">
                                            <span className=" text-xs ">{member.role}</span>
                                            <h3 className="text-[clamp(1rem,4vw,1.8rem)] text-[#121211] font-semibold 2xl:mb-8 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-gradient-to-r after:from-red-500 after:to-cyan-500 after:bottom-[-5px] after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-400 after:ease-out before:content-[''] before:absolute before:w-full before:h-0.5 before:bg-gradient-to-r before:from-red-500 before:to-cyan-500 before:top-[-5px] before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-400 before:ease-out hover:after:scale-x-100 hover:before:scale-x-100">
                                                {member.name}</h3>
                                                <p className="text-sm">Final-year students combining skills and vision to create something meaningful and innovative.</p>
                                            </div>
                                            <div className="flex justify-between max-sm:mt-7 sm:gap-8 items-center xl:max-2xl:mt-5 ">

                                                {[
                                                    { icon: <GoogleIcon />, href: member.Google },
                                                    { icon: <FacebookIcon />, href: member.facebook },
                                                    { icon: <GithubIcon />, href: member.github },
                                                    { icon: <LinkedinIcon />, href: member.linkedIn },
                                                    { icon: <TwitterIcon />, href: member.twitter },
                                                ].map(({ icon, href }, i) => (
                                                    <a
                                                        target="_blank"
                                                        key={i}
                                                        href={href}
                                                        className="hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 bg-transparent rounded-full transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)] cursor-pointer"
                                                    >
                                                        {icon}
                                                    </a>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                    )
                                    )  
                        }
                                </div>
                </div>
                </div>
            </div>
            )
}

            export default RootTeam