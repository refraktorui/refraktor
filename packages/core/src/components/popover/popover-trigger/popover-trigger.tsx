import { cloneElement, isValidElement, ComponentProps } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { PopoverTriggerFactoryPayload } from "../popover.types";
import { usePopoverContext } from "../popover.context";

const PopoverTrigger = factory<PopoverTriggerFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { popover, getStyles } = usePopoverContext();

        const triggerElement = isValidElement(children)
            ? cloneElement(children as any, {
                  ref: (node: HTMLElement | null) => {
                      popover.refs.setReference(node);

                      const childRef = (children as any).ref;
                      if (typeof childRef === "function") {
                          childRef(node);
                      } else if (childRef) {
                          childRef.current = node;
                      }

                      if (typeof ref === "function") {
                          ref(node as HTMLDivElement);
                      } else if (ref) {
                          ref.current = node as HTMLDivElement;
                      }
                  },
                  ...popover.getReferenceProps({
                      ...(children.props as ComponentProps<any>)
                  })
              })
            : children;

        return (
            <div
                className={cx("inline-block", getStyles("trigger"), className)}
                {...props}
            >
                {triggerElement}
            </div>
        );
    }
);

PopoverTrigger.displayName = "@refraktor/core/Popover.Trigger";

export default PopoverTrigger;
