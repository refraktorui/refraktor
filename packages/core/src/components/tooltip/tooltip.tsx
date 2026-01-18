import { useId } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    TooltipClassNames,
    TooltipFactoryPayload,
    TooltipProps
} from "./tooltip.types";
import { useTooltip } from "./use-tooltip";
import { cloneElement, ComponentProps, isValidElement } from "react";
import { Transition } from "../transition";
import { FloatingArrow, FloatingPortal } from "@floating-ui/react";

const defaultProps = {
    positioning: {
        placement: "top",
        offset: 8
    },
    middlewares: { flip: true, shift: true, inline: true },
    trigger: "hover",
    openDelay: 0,
    closeDelay: 0,
    showArrow: false,
    radius: "default",
    withinPortal: true
} satisfies Partial<TooltipProps>;

const Tooltip = factory<TooltipFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        children,
        content,
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        middlewares,
        disabled,
        trigger,
        openDelay,
        closeDelay,
        showArrow,
        transitionProps,
        radius,
        withinPortal,
        className,
        classNames,
        ...props
    } = useProps("Tooltip", defaultProps, _props);
    const classes = useClassNames("Tooltip", classNames);

    const _id = useId(id);

    const {
        opened: isOpened,
        context,
        refs,
        floatingStyles,
        getReferenceProps,
        getFloatingProps,
        placement,
        arrowRef
    } = useTooltip({
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        middlewares,
        disabled,
        trigger,
        openDelay,
        closeDelay,
        showArrow
    });

    const triggerElement = isValidElement(children)
        ? cloneElement(children as any, {
              ref: refs.setReference,
              ...getReferenceProps({
                  ...(children.props as ComponentProps<any>)
              })
          })
        : null;

    const tooltipContent = (
        <Transition
            transition="fade"
            duration={200}
            mounted={isOpened}
            {...transitionProps}
        >
            <div
                ref={(node) => {
                    refs.setFloating(node);

                    if (typeof ref === "function") {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                id={_id}
                role="tooltip"
                style={floatingStyles}
                className={cx(
                    "z-50 px-2 py-1 text-sm bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] shadow-md",
                    getRadius(radius),
                    classes.content,
                    className
                )}
                {...getFloatingProps()}
                {...props}
            >
                {content}

                {showArrow && (
                    <FloatingArrow
                        ref={arrowRef}
                        context={context}
                        width={10}
                        height={5}
                        className={cx(
                            "fill-[var(--refraktor-bg)]",
                            classes.arrow
                        )}
                    />
                )}
            </div>
        </Transition>
    );

    return (
        <div className={cx("inline-block", classes.root)}>
            <span className={cx("inline-block", classes.trigger)}>
                {triggerElement}
            </span>

            {withinPortal ? (
                <FloatingPortal>{tooltipContent}</FloatingPortal>
            ) : (
                tooltipContent
            )}
        </div>
    );
});

Tooltip.displayName = "@refraktor/core/Tooltip";
Tooltip.configure = createComponentConfig<TooltipProps>();
Tooltip.classNames = createClassNamesConfig<TooltipClassNames>();

export default Tooltip;
