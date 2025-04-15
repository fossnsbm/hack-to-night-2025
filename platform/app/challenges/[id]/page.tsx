//import { useRouter } from "next/navigation"

export default function Challenge(params:any) {
    
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full flex flex-col justify-center p-6">
                <span className="mb-4 text-lg text-left">Question No 1</span>
                <div className="border border-blue-400 p-6 px-8 text-blue-400">
                    <form className="flex flex-col space-y-4">
                        <div>
                            <label htmlFor="title" className="block mb-1">Title</label>
                            <input type="text" name="title" id="title"
                                className="px-4 py-2 border border-blue-400 rounded-md w-full"
                                style={{ backgroundColor: "rgba(136, 155, 172, 0.22)" }}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-1">Description</label>
                            <input type="text" name="description" id="description"
                            className="px-4 py-2 border border-blue-400 rounded-md w-full"
                            style={{ backgroundColor: "rgba(136, 155, 172, 0.22)" }}
                            />
                        </div>
                        <div>
                            <label htmlFor="answer" className="block mb-1">Enter your answer</label>
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        name="answer" 
                                        id="answer" 
                                        className="px-4 py-2 border border-blue-400 rounded-md w-full"
                                        style={{ backgroundColor: "rgba(136, 155, 172, 0.22)" }}
                                    />
                                </div>
                                <button className="px-4 py-2 rounded-[10px] bg-[#889BAC] text-blue-950">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="mt-6 flex justify-between">
                    <button className="w-56 h-12 px-4 py-2 border border-blue-400 bg-black text-white 
                        rounded-md">
                        Back
                    </button>
                    <button className="w-56 h-12 px-4 py-2 border border-blue-400 bg-black text-white 
                        rounded-md">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}