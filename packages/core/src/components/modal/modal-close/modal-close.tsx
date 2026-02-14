import { XIcon } from "../../../icons";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useModalContext } from "../modal.context";
import { ModalCloseFactoryPayload } from "../modal.types";

const ModalClose = factory<ModalCloseFactoryPayload>(
    ({ children, className, onClick, type = "button", ...props }, ref) => {
        const { cx } = useTheme();
        const { modal, getStyles } = useModalContext();

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);

            if (event.defaultPrevented) {
                return;
            }

            modal.close();
        };

        return (
            <button
                ref={ref}
                type={type}
                aria-label="Close"
                className={cx(
                    "absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full cursor-pointer border border-transparent",
                    "text-base text-[var(--refraktor-text-secondary)] transition-all",
                    "hover:border-[var(--refraktor-border)] hover:bg-[var(--refraktor-bg-subtle)] hover:text-[var(--refraktor-text)]",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                    "active:scale-95",
                    getStyles("close"),
                    className
                )}
                onClick={handleClick}
                {...props}
            >
                {children ?? <XIcon />}
            </button>
        );
    }
);

ModalClose.displayName = "@refraktor/core/Modal.Close";

export default ModalClose;
