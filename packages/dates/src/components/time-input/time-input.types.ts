import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload,
    InputProps
} from "@refraktor/core";

export type TimeInputClassNames = {
    input?: string;
};

interface _TimeInputProps {
    /** Show seconds in the native time input @default `false` */
    withSeconds?: boolean;

    /** Used for styling TimeInput parts */
    classNames?: TimeInputClassNames;
}

export type TimeInputProps = _TimeInputProps &
    Omit<InputProps, "type" | "classNames">;

export interface TimeInputFactoryPayload extends FactoryPayload {
    props: TimeInputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TimeInputProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<TimeInputClassNames>>;
    };
}
