import { forwardRef } from "react";
import {
    FactoryPayload,
    FactoryRenderFunction,
    PolymorphicFactoryPayload,
    PolymorphicRefraktorComponent,
    PolymorphicRenderFunction,
    RefraktorComponent
} from "./types";

export function factory<Payload extends FactoryPayload>(
    renderFn: FactoryRenderFunction<Payload>
): RefraktorComponent<Payload> {
    const component = forwardRef<Payload["ref"], Payload["props"]>(renderFn);
    return component as unknown as RefraktorComponent<Payload>;
}

export function polymorphicFactory<Payload extends PolymorphicFactoryPayload>(
    renderFn: PolymorphicRenderFunction<Payload>
): PolymorphicRefraktorComponent<Payload> {
    const component = forwardRef<any, any>(renderFn as any);
    return component as unknown as PolymorphicRefraktorComponent<Payload>;
}
