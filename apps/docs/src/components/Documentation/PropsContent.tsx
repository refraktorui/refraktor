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
        <tr>
            <td className="px-4 py-3.5 align-top whitespace-nowrap">
                <div className="inline-flex items-center gap-1">
                    <span className="text-white text-sm font-medium">
                        {name}
                    </span>
                    {required && <span className="text-red-500">*</span>}
                </div>
            </td>

            <td className="px-4 py-3.5">
                <span className="text-xs text-dark-100">{type}</span>
            </td>

            <td className="px-4 py-3.5">
                <span className="text-xs text-dark-100">
                    {defaultValue ?? "—"}
                </span>
            </td>

            <td className="px-4 py-3.5 text-dark-200 text-sm">
                {description ?? <span className="text-dark-200">—</span>}
            </td>
        </tr>
    );
}

export default PropsContent;
