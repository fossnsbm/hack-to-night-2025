import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/About";

export default function Home() {
    return (
        <>
            <div
                id="hero"
                className="snap-start h-screen w-full py-[50px] px-4"
            >
                <Hero />
            </div>
            <About />
            <div
                id="photos"
                className="snap-start h-screen w-full py-[50px] px-4"
            >
                Photos
            </div>
            <div
                id="timeline"
                className="snap-start h-screen w-full py-[50px] px-4"
            >
                Timeline
            </div>
            <div
                id="register"
                className="snap-start h-screen w-full py-[50px] px-4"
            >
                Register
            </div>
            <div id="faq" className="snap-start h-screen w-full py-[50px] px-4">
                Faq
            </div>
        </>
    );
}
