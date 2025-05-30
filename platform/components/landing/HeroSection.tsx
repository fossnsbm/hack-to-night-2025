'use client';

import Countdown from "@/components/landing/Countdown";
import Section from "@/components/common/Section";
import { useIsContestStarted, useIsRegistrationDisabled } from '@/components/contexts/ContestContext';
import { getButtonClasses } from '@/lib/client-utils';

export default function HeroSection() {
    const isStarted = useIsContestStarted();
    const isRegistrationDisabled = useIsRegistrationDisabled();
    
    const buttonClasses = getButtonClasses('primary', 'md', false) + 
        (isRegistrationDisabled ? ' opacity-50 cursor-not-allowed' : '');

    return (
        <Section id="hero">
            <div className="w-full h-full flex justify-center md:justify-start">
                <div className="md:h-full gap-8 inline-flex flex-col items-center mt-[40%] md:mt-0 md:justify-center md:items-start">
                    <span className="text-3xl md:text-7xl drop-shadow-[0px_0px_5px_#ffffff44]">Hackto Night 2.0</span>
                    <Countdown />
                    <a 
                        href="#auth" 
                        className={buttonClasses}
                        onClick={(e) => isRegistrationDisabled && e.preventDefault()}
                    >
                        {isStarted ? 'Login' : 'Register'}
                    </a>
                </div>
            </div>
        </Section>
    );
}
