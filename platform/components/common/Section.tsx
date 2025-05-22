interface Props {
    id: string,
}

export default function Section({ id, children }: React.PropsWithChildren<Props>) {
    return (
        <div id={id} className="snap-end h-dvh w-full pt-[calc(4rem+50px)] pb-[50px] px-12 md:px-8">{children}</div>
    )
}
