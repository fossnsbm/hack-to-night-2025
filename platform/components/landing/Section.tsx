interface Props {
    id: string,
}

export default function Section({ id, children }: React.PropsWithChildren<Props>) {
    return (
        <div id={id} className="snap-start h-screen w-full py-[50px] px-12 md:px-8">{children}</div>
    )
}
