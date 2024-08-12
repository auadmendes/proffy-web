import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    color?: string;
}

export function Button({ label, color, ...rest }: ButtonProps) {
    return (
        <button
            className={`w-full h-20 bg-secondary font-semibold text-2xl font-archivo 
            text-button_text border-0 rounded-sm transition-all mt-4
            hover:bg-secondary_dark md:px-2 md:py-2 md:mt-0 ${color ? color : ''}`}
            type="button"
            {...rest}
        >
            {label}
        </button>
    );
}