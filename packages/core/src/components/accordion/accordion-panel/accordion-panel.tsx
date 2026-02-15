import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import {
    useAccordionContext,
    useAccordionItemContext
} from "../accordion.context";
import { getSize, getVariant } from "../accordion.styles";
import { AccordionPanelFactoryPayload } from "../accordion.types";

const AccordionPanel = factory<AccordionPanelFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const {
            keepMounted,
            size,
            variant,
            isItemOpen,
            getControlId,
            getPanelId,
            getStyles
        } = useAccordionContext();
        const item = useAccordionItemContext();

        const isOpen = isItemOpen(item.value);

        if (!keepMounted && !isOpen) {
            return null;
        }

        const sizeStyles = getSize(size);
        const variantStyles = getVariant(variant);

        return (
            <div
                ref={ref}
                id={getPanelId(item.value)}
                role="region"
                aria-labelledby={getControlId(item.value)}
                data-opened={isOpen}
                hidden={!isOpen}
                className={cx(
                    "outline-none",
                    sizeStyles.panel,
                    variantStyles.panel,
                    getStyles("panel"),
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

AccordionPanel.displayName = "@refraktor/core/Accordion.Panel";

export default AccordionPanel;
