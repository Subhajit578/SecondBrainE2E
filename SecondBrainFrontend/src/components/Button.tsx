import type { ReactElement } from "react";

interface ButtonProps {
    variant : "primary" | "secondary" | "tag";
    text:string;
    startIcon: ReactElement;
    onClick?: () => void;
    fullWidth? : boolean;
    loading? : boolean
}
const variantClasses  = {
    "primary" : "bg-purple-600 text-white",
    "secondary" : "bg-purple-200 text-purple-600",
    "tag": "bg-gray-200 text-gray-700 hover:bg-gray-300"
}
const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center "
export function Button({variant,text,startIcon,onClick,fullWidth,loading}: ButtonProps){
    return <button onClick = {onClick} 
    className={variantClasses[variant] + " " + defaultStyles + `${fullWidth ? " w-full flex justify-center items-center" : ""} ${loading ? "opacity-45 cursor-not-allowed" : ""}` } disabled={loading}
    >
        <div className="pr-2">
        {startIcon}
        </div>
        {text}
    </button>
}