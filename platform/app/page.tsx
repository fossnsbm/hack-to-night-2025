import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function Home() {
    return (
        <div id="page" className="snap-y snap-mandatory overflow-y-auto font-sans">
            <Header />
            <div id="hero" className="snap-start h-screen pt-[50px]">Hero</div>
            <div id="about" className="snap-start h-screen pt-[50px]">About</div>
            <div id="photos" className="snap-start h-screen pt-[50px]">Photos</div>
            <div id="timeline" className="snap-start h-screen pt-[50px]">Timeline</div>
            <div id="register" className="snap-start h-screen pt-[50px]">Register</div>

            <div id="faq" className="snap-start h-screen pt-[50px]">Faq


                
            </div>
            <Footer/>
        </div>
    );
}
