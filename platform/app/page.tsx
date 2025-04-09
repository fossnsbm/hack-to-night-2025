import Hero from "@/components/landing/Hero";
import FAQ from "@/components/landing/FAQ";
import About from "@/components/landing/About";
import Memories from "@/components/landing/Memories"

export default function Home() {
    return (
        <>
            <div id="hero" className="snap-start h-screen w-full py-[50px] px-4"><Hero /></div>
            <div id="about" className="snap-start h-screen w-full py-[50px] px-4"><About/></div>
            <div id="photos" className="snap-start h-screen w-full py-[50px] px-4"><Memories /></div>
            <div id="timeline" className="snap-start h-screen w-full py-[50px] px-4">Timeline</div>
            <div id="register" className="snap-start h-screen w-full py-[50px] px-4">Register</div>
            <div id="faq" className="snap-start h-screen w-full py-[50px] px-4"><FAQ /></div>
        </>
    );
}
