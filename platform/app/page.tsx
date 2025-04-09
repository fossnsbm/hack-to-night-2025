import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";

export default function Home() {
    return (
        <>
            <div id="hero" className="snap-start h-screen w-full py-[50px] px-4"><Hero/></div>
            <div id="about" className="snap-start h-screen w-full py-[50px] px-4"><About/></div>
            <div id="photos" className="snap-start h-screen w-full py-[50px] px-4">Photos</div>
            <div id="timeline" className="snap-start h-screen w-full py-[50px] px-4">Timeline</div>
            <div id="register" className="snap-start h-screen w-full py-[50px] px-4">Register</div>
            <div id="faq" className="snap-start h-screen w-full py-[50px] px-4">Faq</div> 
        </>
    );
}
