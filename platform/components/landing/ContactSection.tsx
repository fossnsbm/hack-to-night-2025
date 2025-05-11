import Section from "@/components/common/Section";
import Title from "@/components/common/Title";
import { getButtonClasses } from '@/lib/ui-utils';

export default function ContactSection() {
    return (
        <Section id="contact">
            <div className="w-full h-full flex flex-col gap-8 items-center justify-center md:p-[25%] text-center">
                <Title title="Contact Us" />
                <p className="text-sm md:text-lg">Join Our Vibrant FOSS Community!
Step into a space where innovation meets collaboration. At FOSS NSBM, we're more than just a tech community — we're a family of passionate individuals who believe in open-source values, continuous learning, and mutual growth.<br/><br/>
Click below and become a part of something bigger — your journey starts here! 🚀</p>
                <a className={getButtonClasses('primary', 'md')} href="https://chat.whatsapp.com/FF5KgEk59uMCVS1BypTWyR">Join WhatsApp</a>
            </div>
        </Section>
    )
}
