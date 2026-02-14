import { useId } from "@refraktor/utils";
import { useRef } from "react";
import { useTheme } from "../../../theme";
import { factory, useClassNames, useProps } from "../../../utils";
import { ModalProvider } from "../modal.context";
import { useModal } from "../use-modal";
import {
    ModalClassNames,
    ModalRootFactoryPayload,
    ModalRootProps
} from "../modal.types";
import { RemoveScroll } from "react-remove-scroll";

const defaultProps = {
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
    withinPortal: true,
    radius: "md"
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
        lockScroll,
        withinPortal,
        radius,
        transitionProps,
        className,
        classNames,
        ...props
    } = useProps("Modal", defaultProps, _props);
    const classes = useClassNames("Modal", classNames);

    const _id = useId(id);
    const headerId = `${_id}-header`;
    const contentRef = useRef<HTMLDivElement | null>(null);

    const modal = useModal({
        opened,
        defaultOpened,
        onOpenedChange,
        closeOnClickOutside,
        closeOnEscape,
        contentRef
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
                transitionProps,
                headerId,
                contentRef,
                classNames,
                getStyles
            }}
        >
            <RemoveScroll enabled={modal.opened && lockScroll}>
                <div
                    ref={ref}
                    id={_id}
                    className={cx(classes.root, className)}
                    {...props}
                >
                    {children}
                </div>
            </RemoveScroll>
        </ModalProvider>
    );
});

ModalRoot.displayName = "@refraktor/core/Modal.Root";

export default ModalRoot;
