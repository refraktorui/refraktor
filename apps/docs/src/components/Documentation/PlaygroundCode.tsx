import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    IconArrowsVertical,
    IconBrandTypescript,
    IconCheck,
    IconCopy
} from "@tabler/icons-react";
import { Button, cx, Tooltip } from "@refraktor/core";

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

const COLLAPSE_LINE_THRESHOLD = 12;
const COLLAPSED_HEIGHT = 108;

function PlaygroundCode(props: PlaygroundCodeProps) {
    const files: CodeFile[] = props.files
        ? props.files
        : [
              {
                  name: props.filename ?? "Code",
                  language: props.language,
                  code: props.code
              }
          ];

    const [activeFile, setActiveFile] = useState(0);
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const [expandedHeight, setExpandedHeight] = useState(0);

    const current = files[activeFile];
    const lineCount = current.code.split("\n").length;
    const isCollapsible = lineCount > COLLAPSE_LINE_THRESHOLD;

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const updateHeight = () => setExpandedHeight(element.scrollHeight);
        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        observer.observe(element);

        return () => observer.disconnect();
    }, [activeFile, current.code]);

    const handleCopy = () => {
        navigator.clipboard.writeText(current.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getIcon = () => {
        switch (current.language) {
            case "tsx":
                return <IconBrandTypescript className="size-4" />;
        }
    };

    return (
        <div className="bg-dark-900">
            <div className="flex items-center justify-between px-2 py-1.5">
                <div className="flex items-center gap-1">
                    {files.map((file, i) => (
                        <button
                            key={file.name}
                            onClick={() => {
                                setActiveFile(i);
                            }}
                            className={cx(
                                "flex items-center border border-transparent gap-1 px-2 py-1 text-[11px] rounded-sm transition-colors cursor-pointer",
                                i === activeFile
                                    ? "text-white border-dark-600 bg-dark-700"
                                    : "text-dark-200 hover:text-white hover:bg-dark-700"
                            )}
                        >
                            {getIcon()}
                            <span>{file.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1">
                    {isCollapsible && (
                        <Tooltip
                            positioning={{ placement: "bottom" }}
                            content={expanded ? "Collapse" : "Expand"}
                        >
                            <Button
                                onClick={() => setExpanded((e) => !e)}
                                variant="ghost"
                                className="text-dark-200 hover:text-white hover:bg-dark-600 size-7"
                            >
                                <IconArrowsVertical className="size-4" />
                            </Button>
                        </Tooltip>
                    )}

                    <Tooltip
                        positioning={{ placement: "bottom" }}
                        content={copied ? "Copied" : "Copy"}
                    >
                        <Button
                            onClick={handleCopy}
                            variant="ghost"
                            className="text-dark-200 hover:text-white hover:bg-dark-600 size-7"
                        >
                            {copied ? (
                                <IconCheck className="size-4" />
                            ) : (
                                <IconCopy className="size-4" />
                            )}
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <div className="relative">
                <div
                    style={{
                        height: isCollapsible
                            ? expanded
                                ? `${Math.max(expandedHeight, COLLAPSED_HEIGHT)}px`
                                : `${COLLAPSED_HEIGHT}px`
                            : "auto"
                    }}
                >
                    <div ref={contentRef}>
                        <SyntaxHighlighter
                            language={current.language}
                            style={oneDark}
                            customStyle={{
                                background: "transparent",
                                margin: 0,
                                padding: "1rem",
                                fontSize: "0.8rem"
                            }}
                            codeTagProps={{
                                style: { fontFamily: "inherit" }
                            }}
                        >
                            {current.code}
                        </SyntaxHighlighter>
                    </div>
                </div>

                {!expanded && isCollapsible && (
                    <>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-2 flex justify-center">
                            <button
                                onClick={() => setExpanded(true)}
                                className="text-xs font-medium text-primary-400 hover:text-white cursor-pointer"
                            >
                                Expand code
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PlaygroundCode;
