import questions from "./Questions";

export default function FAQSection() {
    return (
            <div className="flex flex-col items-center justify-center text-center">
                {questions.map(({ id, question, answer }) => (
                    <div key={id} className="">
                        <h2 className="text-lg font-bold mt-6">{question}</h2>
                        <p className="text-gray-700 mb-6">{answer}</p>
                    </div>
                ))}
            </div>
    );
}
