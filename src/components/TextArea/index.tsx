import { TextareaHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    name: string;
    color?: string;
}

export function TextArea({ label, name, color, ...rest }: TextAreaProps) {
    const { register, watch, formState: { errors } } = useFormContext();
    
    // Watch the specific textarea field's value
    const textValue = watch(name) || '';
    const remainingCharacters = 150 - textValue.length;

    return (
        <div className="input-block text-lg md:mt-6 relative">
            <label
                className={`${color ? color : "text-text_in_primary"}`}
                htmlFor={name}
            >
                {label}
            </label>
            <textarea
                className={`w-full h-64 min-h-32 my-0 rounded-md bg-input_background 
                border-2 border-solid border-line_in_white outline-none 
                py-5 px-6 font-archivo text-lg focus:border-b-4 resize-y mt-2
                focus:border-b-primary_light`}
                id={name}
                {...register(name)}
                {...rest}
            />
            {errors[name] && (
                <span className="text-red-500 text-sm">
                    {(errors[name]?.message as string) || "Erro no campo"}
                </span>
            )}
            <div className="text-sm mt-1">
                {remainingCharacters > 0
                    ? `Você ainda precisa digitar ${remainingCharacters} caracteres`
                    : "A biografia tem caracteres suficientes"}
            </div>
        </div>
    );
}
