import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { PopoverDropdownFactoryPayload } from "../popover.types";
import { usePopoverContext } from "../popover.context";
import { Transition } from "../../transition";
import {
    FloatingArrow,
    FloatingFocusManager,
    FloatingPortal
} from "@floating-ui/react";

const PopoverDropdown = factory<PopoverDropdownFactoryPayload>(
    ({ children, className, style, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const {
            popover,
            showArrow,
            radius,
            withinPortal,
            transitionProps,
            getStyles
        } = usePopoverContext();

        const dropdownContent = (
            <Transition
                ref={(node: HTMLDivElement | null) => {
                    popover.refs.setFloating(node);

                    if (typeof ref === "function") {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                transition="fade"
                duration={200}
                mounted={popover.opened}
                role="dialog"
                aria-modal="true"
                style={{
                    ...popover.floatingStyles,
                    zIndex: 1000,
                    ...style
                }}
                className={cx(
                    "z-50 p-2 bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] shadow-md text-sm border-0",
                    getRadius(radius),
                    getStyles("dropdown"),
                    className
                )}
                {...popover.getFloatingProps()}
                {...transitionProps}
                {...props}
            >
                {children}

                {showArrow && (
                    <FloatingArrow
                        ref={popover.arrowRef}
                        context={popover.context}
                        width={10}
                        height={5}
                        className={cx(
                            "fill-[var(--refraktor-bg)]",
                            getStyles("arrow")
                        )}
                    />
                )}
            </Transition>
        );

        const wrappedContent = popover.opened ? (
            <FloatingFocusManager context={popover.context} modal={false}>
                {dropdownContent}
            </FloatingFocusManager>
        ) : (
            dropdownContent
        );

        if (withinPortal) {
            return <FloatingPortal>{wrappedContent}</FloatingPortal>;
        }

        return wrappedContent;
    }
);

PopoverDropdown.displayName = "@refraktor/core/Popover.Dropdown";

export default PopoverDropdown;
