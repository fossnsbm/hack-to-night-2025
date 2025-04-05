"use client";
import faqItems from "./FAQItems";
import FAQAccordion from "./FAQAccordion";

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
