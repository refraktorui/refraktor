import type { ReactNode } from "react";

interface PropsWrapperProps {
    children: ReactNode;
    caption?: string;
}

function PropsWrapper({ children, caption }: PropsWrapperProps) {
    return (
        <div className="flex flex-col gap-2">
            {caption && (
                <p className="text-xs text-dark-300 uppercase tracking-widest font-medium px-1">
                    {caption}
                </p>
            )}

            <div className="rounded-md border border-dark-600 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-dark-600 bg-dark-800/80">
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-dark-300 uppercase tracking-wider whitespace-nowrap">
                                    Prop
                                </th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-dark-300 uppercase tracking-wider whitespace-nowrap">
                                    Type
                                </th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-dark-300 uppercase tracking-wider whitespace-nowrap">
                                    Default
                                </th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-dark-300 uppercase tracking-wider">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/60">
                            {children}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PropsWrapper;
