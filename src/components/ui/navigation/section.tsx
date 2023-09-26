
export default function ({ text, className = "" }: { text: string, className?: any }) {
    return (
        <div className={`text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 mt-1 mb-3 ${className}`}>
            {text}
        </div>
    )
}
