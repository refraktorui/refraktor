import {
    ComponentPropsWithoutRef,
    ComponentPropsWithRef,
    ElementType,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    ReactElement,
    Ref,
    RefAttributes
} from "react";

export interface FactoryPayload {
    props: Record<string, any>;
    ref: any;
    compound?: Record<string, any>;
}

export interface PolymorphicFactoryPayload {
    props: Record<string, any>;
    defaultRef: any;
    defaultComponent: ElementType;
    compound?: Record<string, any>;
}

export type ElementRef<C extends ElementType> =
    ComponentPropsWithRef<C> extends RefAttributes<infer R> ? R : never;

export type PolymorphicComponentProps<
    C extends ElementType,
    Props = object
> = Props &
    Omit<ComponentPropsWithoutRef<C>, keyof Props | "as"> & {
        as?: C;
    };

export type PolymorphicComponentPropsWithRef<
    C extends ElementType,
    Props = object
> = PolymorphicComponentProps<C, Props> & {
    ref?: Ref<ElementRef<C>>;
};

export type RefraktorComponent<Payload extends FactoryPayload> =
    ForwardRefExoticComponent<
        PropsWithoutRef<Payload["props"]> & RefAttributes<Payload["ref"]>
    > &
        (Payload["compound"] extends Record<string, any>
            ? Payload["compound"]
            : Record<string, never>);

export type PolymorphicRefraktorComponent<
    Payload extends PolymorphicFactoryPayload
> = (<C extends ElementType = Payload["defaultComponent"]>(
    props: PolymorphicComponentPropsWithRef<C, Payload["props"]>
) => ReactElement | null) &
    Omit<
        ForwardRefExoticComponent<
            PolymorphicComponentPropsWithRef<
                Payload["defaultComponent"],
                Payload["props"]
            >
        >,
        "displayName"
    > & { displayName?: string } & (Payload["compound"] extends Record<
        string,
        any
    >
        ? Payload["compound"]
        : Record<string, never>);

export type Factory<Payload extends FactoryPayload> =
    RefraktorComponent<Payload>;

export type PolymorphicFactory<Payload extends PolymorphicFactoryPayload> =
    PolymorphicRefraktorComponent<Payload>;

export type FactoryRenderFunction<Payload extends FactoryPayload> = (
    props: Payload["props"],
    ref: Ref<Payload["ref"]>
) => ReactElement | null;

export type PolymorphicRenderFunction<
    Payload extends PolymorphicFactoryPayload
> = (
    props: PolymorphicComponentProps<
        Payload["defaultComponent"],
        Payload["props"]
    > & {
        as?: ElementType;
    },
    ref: Ref<ElementRef<Payload["defaultComponent"]>>
) => ReactElement | null;
