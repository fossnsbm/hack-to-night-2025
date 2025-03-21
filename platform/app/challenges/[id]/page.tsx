import { useRouter } from "next/router"

export default function Challenge() {
    const router = useRouter()
    return <>{router.query.id}</>
}
