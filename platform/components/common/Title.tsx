import * as motion from "motion/react-client";

interface Props {
    title: string
}

export default function Title({ title }: Props) {
    return (
        <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{
                scale: 1,
                transition: { duration: 0.4 },
            }}
        >
            <h2 className="text-2xl md:text-3xl text-center mb-4">
                { title }
            </h2>
        </motion.div>
    )
}
