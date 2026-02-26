import {
    FloatingFocusManager,
    FloatingPortal
} from "@floating-ui/react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { Transition } from "../../transition";
import { useModalContext } from "../modal.context";
import { ModalContentFactoryPayload, ModalSize } from "../modal.types";

const sizeClasses: Record<ModalSize, string> = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full"
};

const ModalContent = factory<ModalContentFactoryPayload>(
    ({ children, className, style, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const {
            modal,
            withinPortal,
            radius,
            size,
            centered,
            trapFocus,
            returnFocus,
            transitionProps,
            headerId,
            getStyles
        } = useModalContext();

        const setRefs = (node: HTMLDivElement | null) => {
            modal.refs.setFloating(node);

            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        const { className: transitionClassName, ...resolvedTransitionProps } =
            transitionProps ?? {};

        const content = (
            <Transition
                transition="scale"
                duration={150}
                mounted={modal.opened}
                {...resolvedTransitionProps}
                className={cx(
                    "fixed inset-0 z-50 grid pointer-events-none",
                    centered ? "place-items-center" : "items-start justify-center pt-12",
                    transitionClassName
                )}
            >
                {modal.opened ? (
                    <FloatingFocusManager
                        context={modal.context}
                        modal={trapFocus}
                        returnFocus={returnFocus}
                        outsideElementsInert={false}
                    >
                        <div
                            ref={setRefs}
                            aria-labelledby={headerId}
                            data-opened={modal.opened}
                            style={style}
                            className={cx(
                                "pointer-events-auto relative z-50 w-full",
                                "border border-[var(--refraktor-border)] bg-[var(--refraktor-bg)] p-4 text-[var(--refraktor-text)] shadow-md",
                                sizeClasses[size],
                                getRadius(radius),
                                getStyles("content"),
                                className
                            )}
                            {...modal.getFloatingProps()}
                            {...props}
                        >
                            {children}
                        </div>
                    </FloatingFocusManager>
                ) : (
                    <div
                        ref={setRefs}
                        aria-labelledby={headerId}
                        data-opened={modal.opened}
                        style={style}
                        className={cx(
                            "pointer-events-auto relative z-50 w-full",
                            "border border-[var(--refraktor-border)] bg-[var(--refraktor-bg)] p-4 text-[var(--refraktor-text)] shadow-md",
                            sizeClasses[size],
                            getRadius(radius),
                            getStyles("content"),
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </div>
                )}
            </Transition>
        );

        return withinPortal ? (
            <FloatingPortal>{content}</FloatingPortal>
        ) : (
            content
        );
    }
);

ModalContent.displayName = "@refraktor/core/Modal.Content";

export default ModalContent;
