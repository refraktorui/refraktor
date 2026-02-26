import { FloatingOverlay, FloatingPortal } from "@floating-ui/react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { Transition } from "../../transition";
import { useDrawerContext } from "../drawer.context";
import { DrawerOverlayFactoryPayload } from "../drawer.types";

const DrawerOverlay = factory<DrawerOverlayFactoryPayload>(
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
            drawer,
            closeOnClickOutside,
            lockScroll,
            withinPortal,
            transitionProps,
            getStyles
        } = useDrawerContext();

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

            drawer.close();
        };

        const overlayContent = (
            <Transition
                transition="fade"
                duration={150}
                mounted={drawer.opened}
                {...transitionProps}
            >
                <FloatingOverlay
                    lockScroll={lockScroll}
                    ref={ref}
                    className={cx(
                        "z-40",
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
            <FloatingPortal>{overlayContent}</FloatingPortal>
        ) : (
            overlayContent
        );
    }
);

DrawerOverlay.displayName = "@refraktor/core/Drawer.Overlay";

export default DrawerOverlay;
