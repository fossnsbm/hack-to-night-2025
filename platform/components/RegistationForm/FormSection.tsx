"use client";
import parts from "./FormParts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "./FormTypes";
import { handleClickNext, handleCLickSubmit } from "./FormFunctions";

export default function FormSection() {
    const [part, setPart] = useState(0);
    const { register } = useForm<Form>();
    return (
        <form className="snap-start h-screen w-full py-[50px] px-4 flex flex-col items-center justify-center">
            <h1 className="font-bold text-2xl m-4">{parts[part].title}</h1>
            {parts[part].fields.map((field) => (
                <div key={field.name} className="m-1 text-center w-full max-w-md flex justify-between items-center">
                    <label htmlFor={field.name} className="m-2">
                        {field.label}
                    </label>
                    <input
                        type="text"
                        id={field.name}
                        required={parts[part].required}
                        className="border-2 border-dotted"
                        {...register(field.name as keyof Form)}
                        disabled
                    />
                </div>
            ))}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => {
                        setPart(part - 1);
                    }}
                    className={
                        part == 0 ? "hidden" : "border-2 border-dotted m-2"
                    }
                >
                    Back
                </button>
                <button
                    type={part == parts.length - 1 ? "button" : "button"}
                    onClick={() => {
                        setPart(part + 1);
                    }}
                    className={
                        part == parts.length - 1
                            ? "hidden"
                            : "border-2 border-dotted m-2"
                    }
                >
                    {part == parts.length ? "Submit" : "Next"}
                </button>
            </div>
        </form>
    );
}
