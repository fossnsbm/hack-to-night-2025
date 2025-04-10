import Countdown from "@/components/landing/Countdown";
import Section from "@/components/landing/Section";

export default function HeroSection() {
    return (
        <Section id="hero">
            <div className="w-full h-full flex justify-center md:justify-start">
                <div className="md:h-full gap-8 inline-flex flex-col items-center mt-[40%] md:mt-0 md:justify-center md:items-start">
                    <span className="text-3xl md:text-7xl drop-shadow-[0px_0px_5px_#ffffff44]">Hackto Night 2.0</span>
                    <Countdown />
                    <button className="opacity-50 pointer-events-none p-4 bg-[#0f2537] shadow-[3px_3px_0px_#98c2e1] active:shadow-none active:ml-[2px] active:mt-[2px] rounded transition">Register now</button>
                </div>
            </div>
        </Section>
    );
}
