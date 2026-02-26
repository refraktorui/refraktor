import {
    createClassNamesConfig,
    createComponentConfig,
    factory
} from "../../utils";
import { DrawerBody } from "./drawer-body";
import { DrawerClose } from "./drawer-close";
import { DrawerContent } from "./drawer-content";
import { DrawerHeader } from "./drawer-header";
import { DrawerOverlay } from "./drawer-overlay";
import { DrawerRoot } from "./drawer-root";
import {
    DrawerClassNames,
    DrawerFactoryPayload,
    DrawerProps
} from "./drawer.types";

const Drawer = factory<DrawerFactoryPayload>(
    (
        {
            title,
            withOverlay = true,
            withCloseButton = true,
            overlayProps,
            children,
            ...rootProps
        },
        ref
    ) => {
        return (
            <DrawerRoot {...rootProps} ref={ref}>
                {withOverlay && <DrawerOverlay {...overlayProps} />}

                <DrawerContent>
                    {(title || withCloseButton) && (
                        <DrawerHeader withClose={withCloseButton}>
                            {title}
                        </DrawerHeader>
                    )}

                    <DrawerBody>{children}</DrawerBody>
                </DrawerContent>
            </DrawerRoot>
        );
    }
);

Drawer.displayName = "@refraktor/core/Drawer";
Drawer.configure = createComponentConfig<DrawerProps>();
Drawer.classNames = createClassNamesConfig<DrawerClassNames>();
Drawer.Root = DrawerRoot;
Drawer.Overlay = DrawerOverlay;
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Close = DrawerClose;

export default Drawer;
