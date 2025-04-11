"use client";

import { useState } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";

import { cn } from "@/lib/utils";
import Title from "@/components/common/Title";
import Section from "@/components/landing/Section";

const faqItems = [
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
        <div className="overflow-hidden border-2 border-dashed text-center">
            <button
                onClick={() => setOpenItem(isOpen ? -1 : index)}
                className="w-full flex items-center justify-between p-2 text-center"
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
                <div className="p-2 border-t-2 border-b-0 border-y-0 border-dashed text-xs md:text-sm">
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
            <div className="w-full h-full flex flex-col gap-8 items-center justify-center md:p-[25%] text-center">
                <Title title="FAQ" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
