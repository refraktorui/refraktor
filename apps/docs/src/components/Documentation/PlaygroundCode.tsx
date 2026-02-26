import CodeBlock from "@/components/CodeBlock";

interface CodeFile {
    name: string;
    language: string;
    code: string;
}

interface PlaygroundCodeMultiProps {
    files: CodeFile[];
    code?: never;
    language?: never;
    filename?: never;
}

interface PlaygroundCodeSingleProps {
    files?: never;
    code: string;
    language: string;
    filename?: string;
}

type PlaygroundCodeProps = PlaygroundCodeMultiProps | PlaygroundCodeSingleProps;

function PlaygroundCode(props: PlaygroundCodeProps) {
    return <CodeBlock {...props} />;
}

export default PlaygroundCode;
