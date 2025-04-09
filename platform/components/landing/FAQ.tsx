"use client";

import { useState } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";

import { cn } from "@/lib/utils";

const faqItems = [
    {
        id: 1,
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 2,
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 4,
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 5,
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 6,
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
];

function FAQAccordion({
    item,
}: {
    item: { question: string; answer: string };
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="overflow-hidden border-2 border-dashed text-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 text-center"
            >
                <span className="text-xl">{item.question}</span>
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
                <div className="p-2 border-t-2 border-b-0 border-y-0 border-dashed text-sm">
                    {item.answer}
                </div>
            </div>
        </div>
    );
}

export default function FAQSection() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center snap-start h-screen w-full py-[50px] px-4">
            <div className="w-[80%] max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-center mb-8">
                    FAQ
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faqItems.map((item, index) => (
                        <FAQAccordion key={index} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
