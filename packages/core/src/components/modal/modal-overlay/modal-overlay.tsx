import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { Portal } from "../../portal";
import { Transition } from "../../transition";
import { useModalContext } from "../modal.context";
import { ModalOverlayFactoryPayload } from "../modal.types";

const ModalOverlay = factory<ModalOverlayFactoryPayload>(
    ({ closeOnClick = true, className, onMouseDown, ...props }, ref) => {
        const { cx } = useTheme();
        const {
            modal,
            closeOnClickOutside,
            withinPortal,
            transitionProps,
            getStyles
        } = useModalContext();

        const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
            onMouseDown?.(event);

            if (
                event.defaultPrevented ||
                !closeOnClick ||
                !closeOnClickOutside
            ) {
                return;
            }

            modal.close();
        };

        const overlayContent = (
            <Transition
                transition="fade"
                duration={150}
                mounted={modal.opened}
                {...transitionProps}
            >
                <div
                    ref={ref}
                    aria-hidden="true"
                    className={cx(
                        "fixed inset-0 z-40 bg-gradient-to-b from-black/60 via-black/45 to-black/65 backdrop-blur-[2px]",
                        getStyles("overlay"),
                        className
                    )}
                    onMouseDown={handleMouseDown}
                    {...props}
                />
            </Transition>
        );

        return <Portal withinPortal={withinPortal}>{overlayContent}</Portal>;
    }
);

ModalOverlay.displayName = "@refraktor/core/Modal.Overlay";

export default ModalOverlay;
