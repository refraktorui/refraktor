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
                    "size-6 text-[var(--refraktor-text-secondary)] hover:text-[var(--refraktor-text)] cursor-pointer transition-colors",
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
