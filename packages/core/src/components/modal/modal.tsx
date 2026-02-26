import {
    createClassNamesConfig,
    createComponentConfig,
    factory
} from "../../utils";
import { ModalBody } from "./modal-body";
import { ModalClose } from "./modal-close";
import { ModalContent } from "./modal-content";
import { ModalHeader } from "./modal-header";
import { ModalOverlay } from "./modal-overlay";
import { ModalRoot } from "./modal-root";
import {
    ModalClassNames,
    ModalFactoryPayload,
    ModalProps
} from "./modal.types";

const Modal = factory<ModalFactoryPayload>(
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
            <ModalRoot {...rootProps} ref={ref}>
                {withOverlay && <ModalOverlay {...overlayProps} />}

                <ModalContent>
                    {(title || withCloseButton) && (
                        <ModalHeader withClose={withCloseButton}>
                            {title}
                        </ModalHeader>
                    )}

                    <ModalBody>{children}</ModalBody>
                </ModalContent>
            </ModalRoot>
        );
    }
);

Modal.displayName = "@refraktor/core/Modal";
Modal.configure = createComponentConfig<ModalProps>();
Modal.classNames = createClassNamesConfig<ModalClassNames>();
Modal.Root = ModalRoot;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Close = ModalClose;

export default Modal;
