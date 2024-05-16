import { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode
}

export function Container({ children }: ContainerProps) {
    return <div className="w-full max-w-6xl mx-auto p-4">
        {children}
    </div>
}