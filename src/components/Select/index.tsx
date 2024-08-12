import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: string;
    color?: string;
    options: Array<{
        value: string;
        label: string;
    }>;
}

export function Select({ label, name, color, options, ...rest}: SelectProps) {
    return (
        <div className="input-block text-lg md:mt-6 relative">

            <label
                className={`${color ? color: "text-text_in_primary"}`} 
                htmlFor={name}
            >
                {label}
            </label>

            <select
                className={`w-full h-14 my-0 rounded-md bg-input_background 
                border-2 border-solid border-line_in_white outline-none 
                py-0 px-6 font-archivo text-lg focus:border-b-4 mt-2
                focus:border-b-primary_light`}
                id={name}
                value={''}
                {...rest}
            >
                <option value={''} disabled hidden>Selecione uma opção</option>
                {options.map(item => {
                    return <option key={item.value} value={item.value}>{item.label}</option>
                })}
            </select>
        </div>
    )
}