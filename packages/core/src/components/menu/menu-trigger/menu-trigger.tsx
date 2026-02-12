import { cloneElement, ComponentProps, isValidElement } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { MenuTriggerFactoryPayload } from "../menu.types";
import {
    focusMenuItem,
    getNavigableMenuItems,
    useMenuLevelContext,
    useMenuRootContext
} from "../menu.context";

const MenuTrigger = factory<MenuTriggerFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { getStyles } = useMenuRootContext();
        const level = useMenuLevelContext();

        const focusFirstItem = () => {
            const items = getNavigableMenuItems(level.getItems());
            focusMenuItem(items[0]);
        };

        const focusLastItem = () => {
            const items = getNavigableMenuItems(level.getItems());
            focusMenuItem(items[items.length - 1]);
        };

        const triggerElement = isValidElement(children)
            ? cloneElement(children as any, {
                  ref: (node: HTMLElement | null) => {
                      level.menu.refs.setReference(node);

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
                  ...level.menu.getReferenceProps({
                      ...(children.props as ComponentProps<any>),
                      "aria-haspopup": "menu",
                      "aria-expanded": level.menu.opened,
                      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
                          (children.props as ComponentProps<any>)?.onKeyDown?.(
                              event
                          );

                          if (event.defaultPrevented) {
                              return;
                          }

                          if (event.key === "ArrowDown") {
                              event.preventDefault();

                              if (!level.menu.opened) {
                                  level.menu.open();
                              }

                              requestAnimationFrame(focusFirstItem);
                          }

                          if (event.key === "ArrowUp") {
                              event.preventDefault();

                              if (!level.menu.opened) {
                                  level.menu.open();
                              }

                              requestAnimationFrame(focusLastItem);
                          }
                      }
                  })
              })
            : children;

        return (
            <div
                className={cx("inline-block", getStyles("trigger"), className)}
                data-opened={level.menu.opened}
                {...props}
            >
                {triggerElement}
            </div>
        );
    }
);

MenuTrigger.displayName = "@refraktor/core/Menu.Trigger";

export default MenuTrigger;
