import { motion } from "framer-motion";
import React from "react";

interface ComponentProps {
    isVisible: boolean;
}

export function Component({ isVisible }: ComponentProps) {
    return <motion.div animate={{ opacity: isVisible ? 1 : 0 }} />;
}

function About() {
    return (
        <section id="about-us">
        <div className="w-full h-full flex justify-center md:justify-end">
            <div className="md:h-full gap-8 inline-flex flex-col items-center mt-[20%] md:mt-0 md:justify-center md:items-start">
                <span className="text-3xl md:text-5xl">About us</span>
                <p className="max-w-lg">
                    HacktoNight is an annual event organized by FOSS community in nsbm. This remarkable gathering aims to inspire individuals to contribute to the world of open source, fostering a spirit of collaboration and innovation. Open to everyone, HacktoNight provides a platform for tech enthusiasts, developers, and open-source advocates to come together, share knowledge, and celebrate the essence of open-source culture.
                    <br /> <br />
                    This event is not just a celebration but a movement to empower individuals to explore, learn, and make meaningful contributions to open-source projects. Whether you are a seasoned programmer or a curious beginner, HacktoNight welcomes you to be part of this vibrant and inclusive community, marking another milestone in the journey of open-source innovation.
                </p>
            </div>
        </div>
    </section>
    );
}

export default About;

