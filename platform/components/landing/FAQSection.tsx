"use client";

import { useState } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";

import { cn } from "@/lib/utils";
import Title from "@/components/common/Title";
import Section from "@/components/landing/Section";

const faqItems = [
    {
        question: "What is HacktoNight?",
        answer: "HacktoNight is an overnight hackathon organized by the FOSS Community of NSBM. It’s a high-energy event where student teams come together to develop innovative solutions to real-world problems. Participants brainstorm, build, and present their ideas within a limited time — boosting creativity, collaboration, and practical tech skills.",
    },
    {
        question: "What are the team requirements for the event?",
        answer: "Teams must consist of 4 to 6 members. Each member should be a currently enrolled undergraduate. Interdisciplinary teams are encouraged to bring diverse ideas and strengths to the table.",
    },
    {
        question: "How do I register?",
        answer: "You can register through the official HacktoNight registration link shared on FOSS NSBM’s social media pages and the NSBM student portal. Just fill out the form with your team details and submit it before the deadline.",
    },
    {
        question: "What should I bring?",
        answer: "Bring the essentials:\nA laptop with required software/tools\nChargers and power banks\nStudent ID\nAny personal items you need for an overnight stay (snacks, water, hoodie, etc.)\n A positive attitude and team spirit!",
    },
    
    {
        question: "Who can I contact for more information?",
        answer: "For more details, contact the FOSS Community of NSBM through:\nInstagram: @fossnsbm\nEmail: fosscommunitynsbm@gmail.com\nOr reach out to the organizers listed on the event poster.",
    },
    {
        question: "Who can participate?",
        answer: "Any NSBM undergraduate interested in coding, designing, or tech innovation can participate — whether you’re a developer, designer, or idea generator. Beginners and experienced students are all welcome!",
    },
];

interface AccordionItemProps {
    index: number
    question: string,
    answer: string,
    openItem: number,
    setOpenItem: React.Dispatch<React.SetStateAction<number>>,
}

function AccordionItem({ index, question, answer, openItem, setOpenItem }: AccordionItemProps) {
    const isOpen = openItem == index

    return (
        <div className="overflow-hidden border-2 rounded-lg border-gray-300 shadow-md bg-white dark:bg-gray-800 dark:border-gray-500">
            <button
                onClick={() => setOpenItem(isOpen ? -1 : index)}
                className="w-full flex items-center justify-between p-4"
            >
                <span className="text-sm md:text-lg">{question}</span>
                <FaAngleDoubleDown
                    className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "transform rotate-180"
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96" : "max-h-0"
                )}
            >
                <div className="p-2 border-t-2 border-b-0 border-y-0 text-xs">
                    {answer}
                </div>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const [openItem, setOpenItem] = useState(-1);

    return (
        <Section id="faq">
            <div className="w-full h-full flex flex-col gap-8 items-center justify-center md:p-[25%]">
                <Title title="FAQ" />
                <div className="grid grid-cols-1 gap-2 whitespace-pre-line">
                    {faqItems.map((item, index) => (
                        <AccordionItem 
                            key={index} 
                            index={index}
                            question={item.question} 
                            answer={item.answer} 
                            openItem={openItem} 
                            setOpenItem={setOpenItem} 
                        />
                    ))}
                </div>
            </div>
        </Section>
    );
}
