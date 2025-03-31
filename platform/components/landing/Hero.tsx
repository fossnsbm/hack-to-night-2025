import Countdown from "@/components/landing/Countdown";

function Hero() {
    return (
        <div className="w-full h-full flex justify-center md:justify-start">
            <div className="md:h-full gap-8 inline-flex flex-col items-center mt-[40%] md:mt-0 md:justify-center">
                <span className="text-3xl md:text-7xl drop-shadow-[0px_0px_5px_#ffffff44]">Hackto Night 2.0</span>
                <Countdown />
                <button className="p-4 bg-[#0f2537] shadow-[2px_2px_0px_#98c2e1] active:shadow-none active:ml-[2px] active:mt-[2px] rounded transition">Register now</button>
            </div>
        </div>
    );
}

export default Hero;
