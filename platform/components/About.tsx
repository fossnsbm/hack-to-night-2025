"use client";

import React, { useState, useEffect } from "react";
import * as motion from "motion/react-client";

function TextStream() {
    const text = "amet, eiusmod ut ut sit aliquip Lorem nisi adipiscing do dolore laboris veniam, et ex exercitation ea consectetur Ut ullamco consequat. tempor magna incididunt Sed enim aliqua. elit. nostrud ipsum labore commodo ad quis minim dolor amet, laboris commodo ut eiusmod dolor Ut elit. quis veniam, ut Sed consectetur exercitation sit ullamco adipiscing dolore nisi consequat. tempor ea labore ad do minim et ipsum aliqua. aliquip Lorem enim incididunt ex nostrud magna veniam, Ut amet, laboris nostrud incididunt eiusmod ad";

    const [displayedCharCount, setDisplayedCharCount] = useState(0);

    useEffect(() => {
        if (displayedCharCount >= text.length) return;
        const wordTimer = setTimeout(() => {
            setDisplayedCharCount(prevCount => prevCount + 1);
        }, 50);
        return () => clearTimeout(wordTimer);
    }, [displayedCharCount, text.length]);

    return (
        <div className="w-full max-w-5xl mx-auto text-justify text-sm">
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


function About() {
    return (
        <section id="about-us">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="md:h-full w-full flex flex-col items-center gap-6 mt-[40%] md:mt-12 md:justify-center">
                    <motion.div initial={{ scale: 0.8 }} whileInView={{ scale: 1, transition: { duration: 0.4 } }}>
                        <h2 className="text-2xl md:text-3xl text-center mb-4">About Us</h2>
                    </motion.div>
                    <TextStream />
                </div>
            </div>
        </section>
    );
}


export default About;
