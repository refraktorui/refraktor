import {
    createClassNamesConfig,
    createComponentConfig,
    factory
} from "../../utils";
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

const Drawer = factory<DrawerFactoryPayload>((props, ref) => {
    return <DrawerRoot {...props} ref={ref} />;
});

Drawer.displayName = "@refraktor/core/Drawer";
Drawer.configure = createComponentConfig<DrawerProps>();
Drawer.classNames = createClassNamesConfig<DrawerClassNames>();
Drawer.Root = DrawerRoot;
Drawer.Overlay = DrawerOverlay;
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.Close = DrawerClose;

export default Drawer;
