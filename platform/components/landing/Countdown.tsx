"use client";

import { useEffect, useRef } from "react";

const TARGET_TIME = new Date(2025, 4, 31, 0, 0, 0, 0);
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
        const interval = setInterval(() => {
            const diff = TARGET_TIME.getTime() - Date.now();

            days.current!.textContent = ((diff / DAY) >> 0).toString().padStart(2, "0");
            hours.current!.textContent = (((diff % DAY) / HOUR) >> 0).toString().padStart(2, "0");
            mins.current!.textContent = (((diff % HOUR) / MINUTE) >> 0).toString().padStart(2, "0");
            secs.current!.textContent = (((diff % MINUTE) / SECOND) >> 0).toString().padStart(2, "0");
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <div className="w-full flex justify-between text-md md:text-3xl drop-shadow-[0px_0px_5px_#ffffff44]">
            <div className="inline-flex flex-col items-center">
                <span ref={days}>0</span>
                <span>Days</span>
            </div>
            <div className="inline-flex flex-col items-center">
                <span ref={hours}>0</span>
                <span>Hours</span>
            </div>
            <div className="inline-flex flex-col items-center">
                <span ref={mins}>0</span>
                <span>Minutes</span>
            </div>
            <div className="inline-flex flex-col items-center">
                <span ref={secs}>0</span>
                <span>Seconds</span>
            </div>
        </div>
    );
}

export default Countdown;
