import React from "react";
import Image from "next/image";

function Memory() {
    return (
        <>
            <div className="ml-10 mb-10 p-10">
                <div className="flex items-center justify-center [&_svg]:size-full [&:nth-child(1)]:[&_figure]:order-3 [&:nth-child(2)]:[&_figure]:order-2 [&:nth-child(3)]:[&_figure]:order-4 [&:nth-child(4)]:[&_figure]:order-1 [&:nth-child(5)]:[&_figure]:order-5 [&_figure]:[box-shadow:#0000001f_0_2px_6px,#0000003d_0_0_2px] [&_figure]:[transition:all_.25s_ease] hover:[&_figure]:z-[50] hover:[&_figure]:size-[300px] [&:hover_figure:not(:hover)]:size-[250px]">


                    {/* Square 1 */}
                    <figure className="flex items-center justify-center text-3xl font-extrabold leading-none text-zinc-400 p-6 bg-white relative object-cover border border-solid border-zinc-300 size-[150px] z-[3] -ml-4 cursor-pointer">
                        <Image
                            src="/memory-5.jpg"
                            alt="Memory Image 5"
                            fill
                        />
                    </figure>


                    {/* Square 2 */}
                    <figure className="flex items-center justify-center text-3xl font-extrabold leading-none text-zinc-400 p-6 bg-white relative object-cover border border-solid border-zinc-300 size-[200px] z-[4] -ml-4 cursor-pointer">
                        <Image
                            src="/memory-3.jpg"
                            alt="Memory Image 5"
                            fill
                        />
                    </figure>

                    {/* Square 3 */}
                    <figure className="flex items-center justify-center text-3xl font-extrabold leading-none text-zinc-400 p-6 bg-white relative object-cover border border-solid border-zinc-300 size-[250px] z-[6] -ml-4 cursor-pointer">
                        <Image
                            src="/memory-1.jpg"
                            alt="Memory Image 5"
                            fill
                        />
                    </figure>



                    {/* Square 4 */}
                    <figure className="flex items-center justify-center text-3xl font-extrabold leading-none text-zinc-400 p-6 bg-white relative object-cover border border-solid border-zinc-300 size-[200px] z-[4] -ml-4 cursor-pointer">
                        <Image
                            src="/memory-2.jpg"
                            alt="Memory Image 5"
                            fill
                        />
                    </figure>


                    {/* Square 5 */}
                    <figure className="flex items-center justify-center text-3xl font-extrabold leading-none text-zinc-400 p-6 bg-white relative object-cover border border-solid border-zinc-300 size-[150px] z-[3] -ml-4 cursor-pointer">
                        <Image
                            src="/memory-4.jpg"
                            alt="Memory Image 5"
                            fill
                        />
                    </figure>
                </div>
            </div>
        </>
    );
}
export default Memory;