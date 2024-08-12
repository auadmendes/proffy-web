import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    color?: string;
    error?: string;
}

export function Input({ label, name, color, error, ...rest }: InputProps) {
    const { register, formState: { errors } } = useFormContext()

    return (
        <div className="input-block text-lg md:mt-6 relative">
            <label
                className={`${color ? color : "text-text_in_primary"}`}
                htmlFor={name}
            >
                {label} <span className="text-red-400">{error && "Email já cadastrado"}</span>
            </label>
            <input
                className={`w-full h-14 my-0 rounded-md bg-input_background 
                border-2 border-solid border-line_in_white outline-none 
                py-0 px-6 font-archivo text-lg focus:border-b-4 mt-2
                focus:border-b-primary_light ${error && error?.length > 0 ? "border-red-400" : ''}`}
                type="text"
                {...register(name)}
                {...rest}
            />
            {errors[name] && 
                <span className="text-red-500 text-sm">
                    {(errors[name].message as string) || "Erro no campo"}
                </span>
            }
        </div>
    );
}

//   {errors.youtube && <span>{errors.youtube.message}</span>}