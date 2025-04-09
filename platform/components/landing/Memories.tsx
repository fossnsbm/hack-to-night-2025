import React from "react";
import Image from "next/image";
import * as motion from "motion/react-client";

export default function Memories() {
    return (
        <div className="flex flex-col gap-8 justify-center items-center w-full h-full">
            <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{
                    scale: 1,
                    transition: { duration: 0.4 },
                }}
            >
                <h2 className="text-2xl md:text-3xl text-center mb-4">
                    Memories
                </h2>
            </motion.div>
            <div className="inline-flex items-center h-[30dvh]">
                <div className="relative aspect-square rounded-full overflow-hidden h-full scale-75 translate-x-[40%] z-10 hover:scale-125 hover:z-40 transition">
                    <Image className="object-cover" src="/memory-1.jpg" alt="Memory Image 1" fill />
                </div>
                <div className="relative aspect-square rounded-full overflow-hidden h-full scale-90 translate-x-[15%] z-20 hover:scale-125 hover:z-40 transition">
                    <Image className="object-cover" src="/memory-2.jpg" alt="Memory Image 2" fill />
                </div>
                <div className="relative aspect-square rounded-full overflow-hidden h-full scale-100 z-30 hover:scale-125 hover:z-40 transition">
                    <Image className="object-cover" src="/memory-3.jpg" alt="Memory Image 3" fill />
                </div>
                <div className="relative aspect-square rounded-full overflow-hidden h-full scale-90 -translate-x-[15%] z-20 hover:scale-125 hover:z-40 transition">
                    <Image className="object-cover" src="/memory-4.jpg" alt="Memory Image 4" fill />
                </div>
                <div className="relative aspect-square rounded-full overflow-hidden h-full scale-75 -translate-x-[40%] z-10 hover:scale-125 hover:z-40 transition">
                    <Image className="object-cover" src="/memory-5.jpg" alt="Memory Image 5" fill />
                </div>
            </div>
        </div>
    );
}
