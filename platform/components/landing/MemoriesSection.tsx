import React from "react";
import Image from "next/image";

import Section from "@/components/common/Section";
import Title from "@/components/common/Title";

export default function MemoriesSection() {
    return (
        <Section id="memories">
            <div className="flex flex-col gap-8 justify-center items-center w-full h-full">
                <Title title="Memories" />
                <div className="hidden md:inline-flex items-center h-[30dvh]">
                    <div className="relative aspect-square rounded-full overflow-hidden h-full scale-75 translate-x-[40%] z-10 hover:scale-125 hover:z-40 transition">
                        <Image className="rounded-full object-cover" src="/memory-1.jpg" alt="Memory Image 1" fill />
                    </div>
                    <div className="relative aspect-square rounded-full overflow-hidden h-full scale-90 translate-x-[15%] z-20 hover:scale-125 hover:z-40 transition">
                        <Image className="rounded-full object-cover" src="/memory-2.jpg" alt="Memory Image 2" fill />
                    </div>
                    <div className="relative aspect-square rounded-full overflow-hidden h-full scale-100 z-30 hover:scale-125 hover:z-40 transition">
                        <Image className="rounded-full object-cover" src="/memory-3.jpg" alt="Memory Image 3" fill />
                    </div>
                    <div className="relative aspect-square rounded-full overflow-hidden h-full scale-90 -translate-x-[15%] z-20 hover:scale-125 hover:z-40 transition">
                        <Image className="rounded-full object-cover" src="/memory-4.jpg" alt="Memory Image 4" fill />
                    </div>
                    <div className="relative aspect-square rounded-full overflow-hidden h-full scale-75 -translate-x-[40%] z-10 hover:scale-125 hover:z-40 transition">
                        <Image className="rounded-full object-cover" src="/memory-5.jpg" alt="Memory Image 5" fill />
                    </div>
                </div>
                {/* Mobile */}
                <div className="md:hidden w-full h-[calc(50dvw_*_2)] relative">
                    <div className="size-[50dvw] absolute top-0 left-0 rounded-full overflow-hidden z-10 scale-90 origin-top-left border-white border-2">
                        <Image className="rounded-full object-cover" src="/memory-1.jpg" alt="Memory Image 1" fill />
                    </div>
                    <div className="size-[50dvw] absolute top-0 right-0 rounded-full overflow-hidden z-10 scale-90 origin-top-right border-white border-2">
                        <Image className="rounded-full object-cover" src="/memory-2.jpg" alt="Memory Image 2" fill />
                    </div>
                    <div className="size-[50dvw] absolute top-1/2 left-1/2 -translate-1/2 rounded-full overflow-hidden z-20 border-white border-2">
                        <Image className="rounded-full object-cover" src="/memory-3.jpg" alt="Memory Image 3" fill />
                    </div>
                    <div className="size-[50dvw] absolute bottom-0 left-0 rounded-full overflow-hidden z-10 scale-90 origin-bottom-left border-white border-2">
                        <Image className="rounded-full object-cover" src="/memory-4.jpg" alt="Memory Image 4" fill />
                    </div>
                    <div className="size-[50dvw] absolute bottom-0 right-0 rounded-full overflow-hidden z-10 scale-90 origin-bottom-right border-white border-2">
                        <Image className="rounded-full object-cover" src="/memory-5.jpg" alt="Memory Image 5" fill />
                    </div>
                </div>
            </div>
        </Section>
    );
}
