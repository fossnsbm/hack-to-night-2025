import { BsInstagram, BsTwitter } from 'react-icons/bs';
import { FaFacebook, FaLinkedinIn, FaMedium, FaYoutube } from 'react-icons/fa';

function Footer() {
    return (
        <div className="snap-end">
            <footer className="bg-gray-900 text-white px-4 sm:px-8 md:px-16 lg:px-28 py-6 sm:py-8">
                <div className={`text-[32px] sm:text-[40px] text-center pb-4 sm:pb-10`}>
                    <h1>HackToNight 2.0</h1>
                </div>

                <div
                    className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center sm:text-left`}
                >
                    <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-0">
                        <h2 className="text-[15px] sm:text-[20px] font-bold">
                            30<sup>th</sup> - 31<sup>st</sup> of May 2025
                        </h2>
                    </div>

                    <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-0 text-center">
                        <h2 className="text-[15px] sm:text-[20px] font-bold">6.00 pm Onwards</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                        <h2 className="text-[15px] sm:text-[20px]  font-bold sm:text-right">Faculty of Computing</h2>
                    </div>
                </div>

                <div className={`border-t border-gray-700 mt-6 sm:mt-8 pt-6`}>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4">
                        <div className="text-[#8CB6EA] text-center sm:text-left">
                            <p className="text-[15px]">
                                Organized by
                                <br />
                                Foss community of NSBM
                            </p>
                        </div>

                        <div className="flex justify-center gap-4 order-3 sm:order-2">
                            <img src="/FOSS.png" alt="FOSS" className="h-10 sm:h-15 w-auto" />
                            <img src="/WomenInFOSS.png" alt="Women In FOSS" className="h-8 sm:h-12 w-auto" />
                        </div>

                        <div className="flex flex-col items-center sm:items-end order-2 sm:order-3">
                            <div className="flex gap-3 sm:gap-4 text-[#fcfcfc] text-lg sm:text-xl">
                                <a href="https://www.facebook.com/foss.nsbm/" target="_blank" rel="noopener noreferrer">
                                    <FaFacebook className="hover:text-blue-500 transition duration-300 cursor-pointer" />
                                </a>
                                <a
                                    href="https://www.instagram.com/fossnsbm?igsh=a2M1MHJnYzdxOHN2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <BsInstagram className="hover:text-pink-500 transition duration-300 cursor-pointer" />
                                </a>
                                <a href="https://x.com/fossnsbm" target="_blank" rel="noopener noreferrer">
                                    <BsTwitter className="hover:text-blue-400 transition duration-300 cursor-pointer" />
                                </a>
                                <a href="https://blog.fossnsbm.org/" target="_blank" rel="noopener noreferrer">
                                    <FaMedium className="hover:text-gray-500 transition duration-300 cursor-pointer" />
                                </a>
                                <a
                                    href="https://www.youtube.com/@fosscommunitynsbm/videos"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaYoutube className="hover:text-red-500 transition duration-300 cursor-pointer" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/fossnsbm?originalSubdomain=lk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaLinkedinIn className="hover:text-blue-700 transition duration-300 cursor-pointer" />
                                </a>
                            </div>

                            <div className="text-[8px] py-2 sm:py-4 flex items-center">
                                <p>Made with ❤️ by the FOSS community of NSBM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
