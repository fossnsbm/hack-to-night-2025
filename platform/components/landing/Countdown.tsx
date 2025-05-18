"use client";

import { useEffect, useRef } from "react";
import { CONTEST_START_DATE } from "@/components/contexts/ContestContext";

const MS = 1;
const SECOND = MS * 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function Countdown() {
    const days = useRef<HTMLSpanElement>(null);
    const hours = useRef<HTMLSpanElement>(null);
    const mins = useRef<HTMLSpanElement>(null);
    const secs = useRef<HTMLSpanElement>(null);
    
    useEffect(() => {
        const updateCountdown = () => {
            const diff = CONTEST_START_DATE.getTime() - Date.now();
            
            const remainingTime = Math.max(0, diff);
            
            days.current!.textContent = ((remainingTime / DAY) >> 0).toString().padStart(2, "0");
            hours.current!.textContent = (((remainingTime % DAY) / HOUR) >> 0).toString().padStart(2, "0");
            mins.current!.textContent = (((remainingTime % HOUR) / MINUTE) >> 0).toString().padStart(2, "0");
            secs.current!.textContent = (((remainingTime % MINUTE) / SECOND) >> 0).toString().padStart(2, "0");
        };
        
        updateCountdown();
        
        const interval = setInterval(updateCountdown, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);
    
    return (
        <div className="w-full flex gap-4 text-md md:text-2xl drop-shadow-[0px_0px_5px_#ffffff44]">
            <div className="inline-flex flex-col items-center">
                <span ref={days}>00</span>
                <span>Days</span>
            </div>
            <div className="inline-flex flex-col items-center">
                <span ref={hours}>00</span>
                <span>Hours</span>
            </div>
            <div className="inline-flex flex-col items-center">
                <span ref={mins}>00</span>
                <span>Minutes</span>
            </div>
            <div className="inline-flex flex-col items-center">
                <span ref={secs}>00</span>
                <span>Seconds</span>
            </div>
        </div>
    );
}

export default Countdown;
