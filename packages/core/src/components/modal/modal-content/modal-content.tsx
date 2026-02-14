import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { Portal } from "../../portal";
import { Transition } from "../../transition";
import { useModalContext } from "../modal.context";
import { ModalContentFactoryPayload } from "../modal.types";

const ModalContent = factory<ModalContentFactoryPayload>(
    ({ children, className, style, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const {
            modal,
            withinPortal,
            radius,
            transitionProps,
            headerId,
            contentRef,
            getStyles
        } = useModalContext();

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

        const content = (
            <Transition
                transition="scale"
                duration={150}
                mounted={modal.opened}
                {...resolvedTransitionProps}
                className={cx(
                    "fixed inset-0 z-50 grid place-items-center p-3 sm:p-6 pointer-events-none",
                    transitionClassName
                )}
            >
                <div
                    ref={setRefs}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={headerId}
                    data-opened={modal.opened}
                    style={style}
                    className={cx(
                        "pointer-events-auto relative z-50 w-full max-w-[36rem]",
                        "border border-[var(--refraktor-border)] bg-[var(--refraktor-bg-elevated)] px-5 pb-5 pt-4 text-[var(--refraktor-text)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.75)] sm:px-6 sm:pb-6 sm:pt-5",
                        "max-h-[calc(100vh-1.5rem)] max-h-[calc(100dvh-1.5rem)] overflow-y-auto refraktor-scrollbar",
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

ModalContent.displayName = "@refraktor/core/Modal.Content";

export default ModalContent;
