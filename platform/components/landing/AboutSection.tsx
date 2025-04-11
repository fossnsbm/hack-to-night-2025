"use client";

import React, { useState, useEffect } from "react";
import * as motion from "motion/react-client";

import Title from "@/components/common/Title";
import Section from "@/components/landing/Section";

function TextStream() {
    const text = `HacktoNight is an annual event organized by FOSS community in nsbm. This remarkable gathering aims to inspire individuals to contribute to the world of open source, fostering a spirit of collaboration and innovation. Open to everyone, HacktoNight provides a platform for tech enthusiasts, developers, and open-source advocates to come together, share knowledge, and celebrate the essence of open-source culture.\n\nThis event is not just a celebration but a movement to empower individuals to explore, learn, and make meaningful contributions to open-source projects. Whether you are a seasoned programmer or a curious beginner, HacktoNight welcomes you to be part of this vibrant and inclusive community, marking another milestone in the journey of open-source innovation.`;

    const [displayedCharCount, setDisplayedCharCount] = useState(0);

    useEffect(() => {
        if (displayedCharCount >= text.length) return;
        const wordTimer = setTimeout(() => {
            setDisplayedCharCount((prevCount) => prevCount + 1);
        }, 10);
        return () => clearTimeout(wordTimer);
    }, [displayedCharCount, text.length]);

    return (
        <div className="w-full max-w-5xl mx-auto text-justify text-xs md:text-sm whitespace-pre-line">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                {text.substring(0, displayedCharCount)}
                {displayedCharCount < text.length && (
                    <span className="animate-pulse">|</span>
                )}
            </motion.div>
        </div>
    );
}

export default function AboutSection() {
    return (
        <Section id="about">
            <div className="h-full w-full flex flex-col items-center gap-8 justify-center md:justify-start md:mt-32">
                <Title title="About Us" />
                <TextStream />
            </div>
        </Section>
    );
}
