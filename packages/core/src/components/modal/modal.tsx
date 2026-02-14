import {
    createClassNamesConfig,
    createComponentConfig,
    factory
} from "../../utils";
import { ModalClose } from "./modal-close";
import { ModalContent } from "./modal-content";
import { ModalHeader } from "./modal-header";
import { ModalOverlay } from "./modal-overlay";
import { ModalRoot } from "./modal-root";
import { ModalClassNames, ModalFactoryPayload, ModalProps } from "./modal.types";

const Modal = factory<ModalFactoryPayload>((props, ref) => {
    return <ModalRoot {...props} ref={ref} />;
});

Modal.displayName = "@refraktor/core/Modal";
Modal.configure = createComponentConfig<ModalProps>();
Modal.classNames = createClassNamesConfig<ModalClassNames>();
Modal.Root = ModalRoot;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Close = ModalClose;

export default Modal;
