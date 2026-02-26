import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useModalContext } from "../modal.context";
import { ModalBodyFactoryPayload } from "../modal.types";

const ModalBody = factory<ModalBodyFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { getStyles } = useModalContext();

        return (
            <div
                ref={ref}
                className={cx(
                    "overflow-y-auto",
                    getStyles("body"),
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

ModalBody.displayName = "@refraktor/core/Modal.Body";

export default ModalBody;
