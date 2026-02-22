interface PropsContentProps {
    name: string;
    type: string;
    default?: string;
    description?: string;
    required?: boolean;
}

function PropsContent({
    name,
    type,
    default: defaultValue,
    description,
    required
}: PropsContentProps) {
    return (
        <tr className="group hover:bg-dark-800/40 transition-colors">
            <td className="px-4 py-3 align-top whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                    <code className="text-primary-400 font-mono text-xs">
                        {name}
                    </code>
                    {required && (
                        <span
                            className="text-red-400 text-xs font-bold leading-none"
                            title="Required"
                        >
                            *
                        </span>
                    )}
                </span>
            </td>

            <td className="px-4 py-3 align-top max-w-[220px]">
                <code className="font-mono text-xs text-dark-100 break-words whitespace-pre-wrap leading-relaxed">
                    {type}
                </code>
            </td>

            <td className="px-4 py-3 align-top whitespace-nowrap">
                {defaultValue !== undefined ? (
                    <code className="font-mono text-xs text-dark-200">
                        {defaultValue}
                    </code>
                ) : (
                    <span className="text-dark-500 text-xs">—</span>
                )}
            </td>

            <td className="px-4 py-3 align-top text-dark-200 text-xs leading-relaxed">
                {description ?? <span className="text-dark-500">—</span>}
            </td>
        </tr>
    );
}

export default PropsContent;
