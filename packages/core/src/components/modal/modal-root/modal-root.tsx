import { useId } from "@refraktor/utils";
import { useTheme } from "../../../theme";
import { factory, useClassNames, useProps } from "../../../utils";
import { ModalProvider } from "../modal.context";
import { useModal } from "../use-modal";
import {
    ModalClassNames,
    ModalRootFactoryPayload,
    ModalRootProps
} from "../modal.types";

const defaultProps = {
    closeOnClickOutside: true,
    closeOnEscape: true,
    strategy: "absolute",
    lockScroll: true,
    withinPortal: true,
    radius: "md",
    size: "md",
    centered: true,
    trapFocus: true,
    returnFocus: true
} satisfies Partial<ModalRootProps>;

const ModalRoot = factory<ModalRootFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
        opened,
        defaultOpened,
        onOpenedChange,
        closeOnClickOutside,
        closeOnEscape,
        strategy,
        lockScroll,
        withinPortal,
        radius,
        size,
        centered,
        trapFocus,
        returnFocus,
        transitionProps,
        className,
        classNames,
        ...props
    } = useProps("Modal", defaultProps, _props);
    const classes = useClassNames("Modal", classNames);

    const _id = useId(id);
    const headerId = `${_id}-header`;

    const modal = useModal({
        opened,
        defaultOpened,
        onOpenedChange,
        closeOnClickOutside,
        closeOnEscape,
        strategy
    });

    const getStyles = (part: keyof ModalClassNames) => classes[part];

    return (
        <ModalProvider
            value={{
                modal,
                closeOnClickOutside,
                lockScroll,
                withinPortal,
                radius,
                size,
                centered,
                trapFocus,
                returnFocus,
                transitionProps,
                headerId,
                classNames,
                getStyles
            }}
        >
            <div
                ref={ref}
                id={_id}
                className={cx(classes.root, className)}
                {...props}
            >
                {children}
            </div>
        </ModalProvider>
    );
});

ModalRoot.displayName = "@refraktor/core/Modal.Root";

export default ModalRoot;
