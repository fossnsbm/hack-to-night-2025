import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import MemoriesSection from "@/components/landing/MemoriesSection"
import ContactSection from "@/components/landing/ContactSection";
import FAQSection from "@/components/landing/FAQSection";

export default function Landing() {
    return (
        <>
            <HeroSection />
            <AboutSection/>
            <MemoriesSection />
            <ContactSection />
            <FAQSection />
        </>
    );
}
