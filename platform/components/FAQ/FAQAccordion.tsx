"use client";
import { useState } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function FAQAccordion({
    item,
}: {
    item: { question: string; answer: string };
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="overflow-hidden border-2 border-dashed text-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <span className="text-xl">{item.question}</span>
                <FaAngleDoubleDown
                    className={cn(
                        "h-5 w-5 transition-transform duration-200",
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
                <div className="p-5 border-t-2 border-b-0 border-y-0 border-dashed">
                    {item.answer}
                </div>
            </div>
        </div>
    );
}
