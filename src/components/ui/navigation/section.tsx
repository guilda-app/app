
export default function ({ text, className = "" }: { text: string, className?: any }) {
    return (
        <div className={`mt-1 text-muted-foreground mb-3 text-xs uppercase font-bold ${className}`}>
            {text}
        </div>
    )
}
