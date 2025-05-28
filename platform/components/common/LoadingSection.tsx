"use client"

import Section from "./Section";

type LoadingSectionProps = {
    id: string;
    loading: boolean;
};

export default function LoadingSection({ id, loading, children }: React.PropsWithChildren<LoadingSectionProps>) {
    return (
        loading ? (
            <Section id={id}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </div>
            </Section>
        ) : (
            <Section id={id}>
                {children}
            </Section>
        )
    )
}
