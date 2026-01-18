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
    PopoverClassNames,
    PopoverFactoryPayload,
    PopoverProps
} from "./popover.types";
import { usePopover } from "./use-popover";
import { PopoverProvider } from "./popover.context";
import { PopoverTrigger } from "./popover-trigger";
import { PopoverDropdown } from "./popover-dropdown";

const defaultProps = {
    positioning: {
        placement: "bottom",
        offset: 8
    },
    middlewares: { flip: true, shift: true },
    trigger: "click",
    openDelay: 0,
    closeDelay: 0,
    showArrow: false,
    radius: "default",
    withinPortal: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
    trapFocus: false
} satisfies Partial<PopoverProps>;

const Popover = factory<PopoverFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
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
        closeOnClickOutside,
        closeOnEscape,
        trapFocus,
        className,
        classNames,
        ...props
    } = useProps("Popover", defaultProps, _props);
    const classes = useClassNames("Popover", classNames);

    const _id = useId(id);

    const popover = usePopover({
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        middlewares,
        disabled,
        trigger,
        showArrow,
        closeOnClickOutside,
        closeOnEscape,
        openDelay,
        closeDelay
    });

    const getStyles = (part: keyof PopoverClassNames) => classes[part];

    return (
        <PopoverProvider
            value={{
                popover,
                showArrow: showArrow ?? false,
                radius: radius ?? "default",
                withinPortal: withinPortal ?? true,
                transitionProps,
                classNames,
                getStyles
            }}
        >
            <div
                ref={ref}
                id={_id}
                className={cx("inline-block", classes.root, className)}
                {...props}
            >
                {children}
            </div>
        </PopoverProvider>
    );
});

Popover.displayName = "@refraktor/core/Popover";
Popover.configure = createComponentConfig<PopoverProps>();
Popover.classNames = createClassNamesConfig<PopoverClassNames>();
Popover.Trigger = PopoverTrigger;
Popover.Dropdown = PopoverDropdown;

export default Popover;
