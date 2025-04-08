//import { useRouter } from "next/navigation"

export default function Challenge(params:any) {
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <input
                type="text"
                placeholder="Type here..."
                className="px-4 py-2 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
        //change
    );
}