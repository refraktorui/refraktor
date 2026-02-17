import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { ModalClose } from "../modal-close";
import { useModalContext } from "../modal.context";
import { ModalHeaderFactoryPayload } from "../modal.types";

const ModalHeader = factory<ModalHeaderFactoryPayload>(
    ({ children, className, id, text, withClose = true, ...props }, ref) => {
        const { cx } = useTheme();
        const { headerId, getStyles } = useModalContext();
        const resolvedId = id ?? headerId;

        return (
            <div
                ref={ref}
                className={cx(
                    "mb-4 flex items-center justify-between",
                    getStyles("header"),
                    className
                )}
                {...props}
            >
                <div
                    id={resolvedId}
                    className="min-w-0 flex-1 text-sm font-semibold leading-5 text-[var(--refraktor-text)]"
                >
                    {text ?? children}
                </div>

                {withClose && (
                    <ModalClose className="static shrink-0 self-center" />
                )}
            </div>
        );
    }
);

ModalHeader.displayName = "@refraktor/core/Modal.Header";

export default ModalHeader;
