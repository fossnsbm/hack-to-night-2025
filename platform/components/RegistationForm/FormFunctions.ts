import { set, useForm } from "react-hook-form";
import { Form } from "./FormTypes";
import parts from "./FormParts";

export async function handleClickNext(
    part: number,
    setPart: (part: number) => void
) {
    const { trigger } = useForm<Form>();
    const currentPartFields = parts[part].fields.map((fields) => fields.name);
    const isValid = await trigger(currentPartFields as (keyof Form)[]);
    setPart(isValid ? part + 1 : part);
}

export function handleCLickSubmit() {}
