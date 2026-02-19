import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { Portal } from "../../portal";
import { Transition, TransitionProps } from "../../transition";
import { useDrawerContext } from "../drawer.context";
import { DrawerContentFactoryPayload, DrawerPosition } from "../drawer.types";
import { getSizeStyles } from "../drawer.styles";

const positionClasses: Record<DrawerPosition, string> = {
    left: "left-0 top-0 h-full max-h-full",
    right: "right-0 top-0 h-full max-h-full",
    top: "left-0 top-0 w-full max-w-full",
    bottom: "bottom-0 left-0 w-full max-w-full"
};

const transitionsByPosition: Record<
    DrawerPosition,
    TransitionProps["transition"]
> = {
    left: "slide-right",
    right: "slide-left",
    top: "slide-down",
    bottom: "slide-up"
};

const DrawerContent = factory<DrawerContentFactoryPayload>(
    ({ children, className, style, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const {
            drawer,
            withinPortal,
            radius,
            position,
            size,
            transitionProps,
            headerId,
            contentRef,
            getStyles
        } = useDrawerContext();

        const setRefs = (node: HTMLDivElement | null) => {
            contentRef.current = node;

            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        const { className: transitionClassName, ...resolvedTransitionProps } =
            transitionProps ?? {};

        const sizeStyles = getSizeStyles(position, size);

        const content = (
            <Transition
                transition={transitionsByPosition[position]}
                duration={200}
                mounted={drawer.opened}
                {...resolvedTransitionProps}
                className={cx(
                    "fixed inset-0 z-50 pointer-events-none",
                    transitionClassName
                )}
            >
                <div
                    ref={setRefs}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={headerId}
                    data-opened={drawer.opened}
                    data-position={position}
                    style={{
                        ...sizeStyles,
                        ...style
                    }}
                    className={cx(
                        "pointer-events-auto fixed z-50 border border-[var(--refraktor-border)] bg-[var(--refraktor-bg)] p-4 text-[var(--refraktor-text)] shadow-md",
                        positionClasses[position],
                        getRadius(radius),
                        getStyles("content"),
                        className
                    )}
                    {...props}
                >
                    {children}
                </div>
            </Transition>
        );

        return withinPortal ? <Portal>{content}</Portal> : content;
    }
);

DrawerContent.displayName = "@refraktor/core/Drawer.Content";

export default DrawerContent;
