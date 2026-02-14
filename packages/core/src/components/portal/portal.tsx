import { createPortal } from "react-dom";
import { createComponentConfig, factory, useProps } from "../../utils";
import { PortalFactoryPayload, PortalProps } from "./portal.types";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";

function createPortalNode(props: ComponentPropsWithoutRef<"div">) {
    const node = document.createElement("div");
    node.setAttribute("data-portal", "true");
    typeof props.className === "string" &&
        node.classList.add(...props.className.split(" ").filter(Boolean));
    typeof props.style === "object" && Object.assign(node.style, props.style);
    typeof props.id === "string" && node.setAttribute("id", props.id);
    return node;
}

function getTargetNode({
    target,
    reuseTargetNode,
    ...others
}: Omit<PortalProps, "children">): HTMLElement {
    if (target) {
        if (typeof target === "string") {
            return (
                document.querySelector<HTMLElement>(target) ||
                createPortalNode(others)
            );
        }

        return target;
    }

    if (reuseTargetNode) {
        const existingNode = document.querySelector<HTMLElement>(
            "[data-velra-shared-portal-node]"
        );

        if (existingNode) {
            return existingNode;
        }

        const node = createPortalNode(others);
        node.setAttribute("data-velra-shared-portal-node", "true");
        document.body.appendChild(node);
        return node;
    }

    return createPortalNode(others);
}

const Portal = factory<PortalFactoryPayload>((_props, ref) => {
    const { children, target, reuseTargetNode, ...others } = useProps(
        "Portal",
        null,
        _props
    );

    const [mounted, setMounted] = useState(false);
    const nodeRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        setMounted(true);
        nodeRef.current = getTargetNode({ target, reuseTargetNode, ...others });

        if (ref) {
            if (typeof ref === "function") {
                ref(nodeRef.current as HTMLDivElement);
            } else {
                ref.current = nodeRef.current as HTMLDivElement;
            }
        }

        if (target && nodeRef.current) {
            const computedStyle = window.getComputedStyle(nodeRef.current);
            if (computedStyle.position === "static") {
                nodeRef.current.style.position = "relative";
            }
        }

        if (!target && !reuseTargetNode && nodeRef.current) {
            document.body.appendChild(nodeRef.current);
        }

        return () => {
            if (!target && !reuseTargetNode && nodeRef.current) {
                try {
                    if (document.body.contains(nodeRef.current)) {
                        document.body.removeChild(nodeRef.current);
                    }
                } catch (error) {}
            }
        };
    }, [target, reuseTargetNode]);

    if (!mounted || !nodeRef.current) {
        return null;
    }

    return createPortal(<>{children}</>, nodeRef.current);
});

Portal.displayName = "@velra/core/Portal";
Portal.configure = createComponentConfig<PortalProps>();

export default Portal;
