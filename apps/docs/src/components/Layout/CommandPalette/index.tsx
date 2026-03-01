import { Input, Modal, cx } from "@refraktor/core";
import { useNavigate } from "@tanstack/react-router";
import {
    type KeyboardEvent as ReactKeyboardEvent,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import sidebarItems from "@/components/Layout/Sidebar/items";
import type { SidebarNode } from "@/typings";
import { IconSearch } from "@tabler/icons-react";

interface CommandItem {
    title: string;
    href: string;
    section: string;
    keywords: string;
}

interface CommandPaletteProps {
    opened: boolean;
    onOpenedChange: (opened: boolean) => void;
}

const commandItems = flattenSidebarLinks(sidebarItems).filter((item) =>
    item.href.startsWith("/core/")
);

export default function CommandPalette({
    opened,
    onOpenedChange
}: CommandPaletteProps) {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const results = useMemo(() => {
        const normalizedQuery = normalizeQuery(query);

        if (!normalizedQuery) {
            return commandItems;
        }

        return commandItems
            .map((item) => ({
                item,
                score: getMatchScore(item, normalizedQuery)
            }))
            .filter((entry) => entry.score !== Number.POSITIVE_INFINITY)
            .sort((a, b) => {
                if (a.score !== b.score) {
                    return a.score - b.score;
                }

                return a.item.title.localeCompare(b.item.title);
            })
            .map((entry) => entry.item);
    }, [query]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const isShortcut = (event.ctrlKey || event.metaKey) && key === "k";

            if (!isShortcut) {
                return;
            }

            event.preventDefault();
            onOpenedChange(!opened);
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [onOpenedChange, opened]);

    useEffect(() => {
        if (!opened) {
            setQuery("");
            setActiveIndex(0);
            return;
        }

        const frame = window.requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

        return () => {
            window.cancelAnimationFrame(frame);
        };
    }, [opened]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    useEffect(() => {
        if (results.length === 0) {
            setActiveIndex(0);
            return;
        }

        if (activeIndex > results.length - 1) {
            setActiveIndex(results.length - 1);
        }
    }, [activeIndex, results.length]);

    const handleSelect = (item: CommandItem) => {
        void navigate({ to: item.href });
        onOpenedChange(false);
    };

    const handleInputKeyDown = (
        event: ReactKeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((previous) =>
                Math.min(previous + 1, Math.max(results.length - 1, 0))
            );
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((previous) => Math.max(previous - 1, 0));
            return;
        }

        if (event.key === "Enter") {
            const selected = results[activeIndex];

            if (!selected) {
                return;
            }

            event.preventDefault();
            handleSelect(selected);
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            onOpenedChange(false);
        }
    };

    return (
        <Modal.Root opened={opened} onOpenedChange={onOpenedChange}>
            <Modal.Overlay />

            <Modal.Content className="p-0 bg-dark-800 border-none max-w-sm md:max-w-lg">
                <Modal.Body>
                    <div className="border-b border-dark-500">
                        <Input
                            className="bg-transparent border-none"
                            classNames={{}}
                            placeholder="Search components"
                            leftSection={<IconSearch size={18} />}
                            size="lg"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={handleInputKeyDown}
                        />
                    </div>

                    <ul
                        className="max-h-96 min-h-20 space-y-1 overflow-y-auto docs-scrollbar p-1"
                        role="listbox"
                        aria-label="Component search results"
                    >
                        {results.length > 0 ? (
                            results.map((item, index) => {
                                const isActive = index === activeIndex;

                                return (
                                    <li
                                        key={item.href}
                                        role="option"
                                        aria-selected={isActive}
                                    >
                                        <button
                                            className={cx(
                                                "flex w-full items-center rounded-md px-4 py-2",
                                                isActive && "bg-dark-700"
                                            )}
                                            onMouseEnter={() =>
                                                setActiveIndex(index)
                                            }
                                            onClick={() => handleSelect(item)}
                                        >
                                            <span className="text-sm font-medium">
                                                {item.title}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="h-full p-4 text-center text-sm text-dark-200 flex items-center justify-center">
                                <span>Nothing found...</span>
                            </li>
                        )}
                    </ul>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}

function flattenSidebarLinks(
    nodes: SidebarNode[],
    parentTitles: string[] = []
): CommandItem[] {
    const result: CommandItem[] = [];

    for (const node of nodes) {
        if (node.kind === "link") {
            const section = parentTitles.join(" / ");
            const keywords = [node.title, section, node.href]
                .join(" ")
                .toLowerCase();

            result.push({
                title: node.title,
                href: node.href,
                section,
                keywords
            });
            continue;
        }

        result.push(
            ...flattenSidebarLinks(node.items, [...parentTitles, node.title])
        );
    }

    return result;
}

function normalizeQuery(value: string) {
    return value.trim().toLowerCase();
}

function getMatchScore(item: CommandItem, query: string) {
    const title = item.title.toLowerCase();
    const href = item.href.toLowerCase();
    const section = item.section.toLowerCase();

    if (title === query) {
        return 0;
    }

    if (title.startsWith(query)) {
        return 1;
    }

    if (title.includes(query)) {
        return 2;
    }

    if (section.includes(query)) {
        return 3;
    }

    if (href.includes(query) || item.keywords.includes(query)) {
        return 4;
    }

    return Number.POSITIVE_INFINITY;
}
