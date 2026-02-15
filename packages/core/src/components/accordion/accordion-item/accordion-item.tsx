import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import {
    AccordionItemProvider,
    useAccordionContext
} from "../accordion.context";
import { getVariant } from "../accordion.styles";
import { AccordionItemFactoryPayload } from "../accordion.types";

const AccordionItem = factory<AccordionItemFactoryPayload>(
    ({ value, disabled, children, className, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const { variant, radius, isItemOpen, getStyles } = useAccordionContext();
        const variantStyles = getVariant(variant);

        return (
            <AccordionItemProvider value={{ value, disabled: !!disabled }}>
                <div
                    ref={ref}
                    data-opened={isItemOpen(value)}
                    data-disabled={disabled}
                    className={cx(
                        "overflow-hidden",
                        variantStyles.item,
                        variant === "separated" && getRadius(radius),
                        getStyles("item"),
                        className
                    )}
                    {...props}
                >
                    {children}
                </div>
            </AccordionItemProvider>
        );
    }
);

AccordionItem.displayName = "@refraktor/core/Accordion.Item";

export default AccordionItem;
