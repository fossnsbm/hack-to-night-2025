import Section from "@/components/landing/Section";
import Title from "@/components/common/Title";

export default function ContactSection() {
    return (
        <Section id="contact">
            <div className="w-full h-full flex flex-col gap-8 items-center justify-center md:p-[25%] text-center">
                <Title title="Contact Us" />
                <p className="text-sm md:text-lg">Join our vibrant FOSS community! Connect, share, and grow with like-minded enthusiasts. Click to dive in! 🚀</p>
                <a className="text-sm md:text-lg p-4 bg-[#0f2537] shadow-[3px_3px_0px_#98c2e1] active:shadow-none active:ml-[2px] active:mt-[2px] rounded transition" href="https://chat.whatsapp.com/FF5KgEk59uMCVS1BypTWyR">Join WhatsApp</a>
            </div>
        </Section>
    )
}
