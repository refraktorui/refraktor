import type { ReactNode } from "react";

interface PropsWrapperProps {
    children: ReactNode;
}

function PropsWrapper({ children }: PropsWrapperProps) {
    return (
        <div className="overflow-hidden rounded-md border border-dark-600 bg-dark-800">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-dark-600 text-xs text-dark-200 font-semibold uppercase">
                            <th className="w-48 whitespace-nowrap px-4 py-3 text-left">
                                Prop
                            </th>
                            <th className="w-68 whitespace-nowrap px-4 py-3 text-left">
                                Type
                            </th>
                            <th className="w-32 whitespace-nowrap px-4 py-3 text-left">
                                Default
                            </th>
                            <th className="px-4 py-3 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PropsWrapper;
