import { SIGNAL_KEY } from './constant';
import { Signal } from './signal';

export function observe<T extends Object, K extends keyof T>(
    instance: T,
    item: K,
    callback: (data: T[K]) => void
) {
    const signals: Map<string, Signal<T[K]>> = Reflect.getMetadata(SIGNAL_KEY, instance);
    if (!signals) {
        throw Error(`The instance which item ${String(item)} is not observable`);
    }
    const signal = signals.get(String(item));
    if (!signal) {
        throw Error(`The item ${String(item)} is not reactive`);
    }
    return signal.subscribe(callback);
}

export function unobserve<T extends Object, K extends keyof T>(
    instance: T,
    item: K,
    callback: (data: T[K]) => void
) {
    const signals: Map<string, Signal<T[K]>> = Reflect.getMetadata(SIGNAL_KEY, instance);
    if (!signals) {
        return;
    }
    const signal = signals.get(String(item));
    if (!signal) {
        return;
    }
    return signal.unsubscribe(callback);
}
