import { createPortal } from "react-dom";
import { createComponentConfig, factory, useProps } from "../../utils";
import { PortalFactoryPayload, PortalProps } from "./portal.types";

const defaultProps = {
    withinPortal: true
} satisfies Partial<PortalProps>;

const resolvePortalTarget = (target: PortalProps["target"]) => {
    if (typeof document === "undefined") {
        return null;
    }

    if (target instanceof HTMLElement) {
        return target;
    }

    if (typeof target === "string") {
        return document.querySelector<HTMLElement>(target) ?? document.body;
    }

    return document.body;
};

const Portal = factory<PortalFactoryPayload>((_props, _ref) => {
    const { children, withinPortal, target } = useProps(
        "Portal",
        defaultProps,
        _props
    );

    if (!withinPortal) {
        return <>{children}</>;
    }

    const portalTarget = resolvePortalTarget(target);

    if (!portalTarget) {
        return null;
    }

    return createPortal(children, portalTarget);
});

Portal.displayName = "@refraktor/core/Portal";
Portal.configure = createComponentConfig<PortalProps>();

export default Portal;
