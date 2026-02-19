import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { Portal } from "../../portal";
import { Transition } from "../../transition";
import { useModalContext } from "../modal.context";
import { ModalOverlayFactoryPayload } from "../modal.types";

const ModalOverlay = factory<ModalOverlayFactoryPayload>(
    (
        {
            closeOnClick = true,
            backgroundOpacity = 0.5,
            blur = 0,
            className,
            onMouseDown,
            style,
            ...props
        },
        ref
    ) => {
        const { cx } = useTheme();
        const {
            modal,
            closeOnClickOutside,
            withinPortal,
            transitionProps,
            getStyles
        } = useModalContext();

        const blurValue = typeof blur === "number" ? `${blur}px` : blur;
        const backdropFilterValue =
            blurValue !== "0" && blurValue !== "0px"
                ? `blur(${blurValue})`
                : undefined;

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
                        "fixed inset-0 z-40",
                        getStyles("overlay"),
                        className
                    )}
                    style={{
                        backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})`,
                        backdropFilter: backdropFilterValue,
                        ...style
                    }}
                    onMouseDown={handleMouseDown}
                    {...props}
                />
            </Transition>
        );

        return withinPortal ? (
            <Portal>{overlayContent}</Portal>
        ) : (
            overlayContent
        );
    }
);

ModalOverlay.displayName = "@refraktor/core/Modal.Overlay";

export default ModalOverlay;
