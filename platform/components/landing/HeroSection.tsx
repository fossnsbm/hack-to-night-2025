'use client';

import Countdown from "@/components/landing/Countdown";
import Section from "@/components/landing/Section";
import { useContest, ContestState } from '@/contexts/ContestContext';

export default function HeroSection() {
    const { contestState } = useContest();

    // More explicit state handling
    const isStarted = contestState === ContestState.STARTED;
    const isNotStarted = contestState === ContestState.NOT_STARTED;
    
    // Determine button text based on contest state
    const buttonText = isStarted ? 'Login' : 'Register';
    
    // Determine button styling and behavior
    const isDisabled = isNotStarted;
    const buttonClasses = `p-4 bg-[#0f2537] shadow-[3px_3px_0px_#98c2e1] active:shadow-none active:translate-y-[2px] rounded transition ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#133553] active:shadow-none'
    }`;

    return (
        <Section id="hero">
            <div className="w-full h-full flex justify-center md:justify-start">
                <div className="md:h-full gap-8 inline-flex flex-col items-center mt-[40%] md:mt-0 md:justify-center md:items-start">
                    <span className="text-3xl md:text-7xl drop-shadow-[0px_0px_5px_#ffffff44]">Hackto Night 2.0</span>
                    <Countdown />
                    <a 
                        href="#auth" 
                        className={buttonClasses}
                        onClick={(e) => isDisabled && e.preventDefault()}
                    >
                        {buttonText}
                    </a>
                </div>
            </div>
        </Section>
    );
}
