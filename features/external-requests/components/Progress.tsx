import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number
}

export function Progress({ className, value, ...props }: ProgressProps) {
    return (
        <div
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-gray-100",
                className
            )}
            {...props}
        >
            <div
                className="h-full w-full flex-1 bg-blue-600 transition-all duration-200"
                style={{ transform: `translateX(-${100 - value}%)` }}
            />
        </div>
    )
}
