import { SIGNAL_KEY } from './constant';
import { Signal } from './signal';

export function observe<T extends Object, K extends keyof T>(
    instance: T,
    callback?: (data: T) => void
): () => void;
export function observe<T extends Object, K extends keyof T>(
    instance: T,
    item: K,
    callback?: (data: T[K]) => void
): () => void;
export function observe<T extends Object, K extends keyof T>(
    instance: T,
    item?: K,
    callback?: (data: T[K]) => void
) {
    if (!callback) {
        throw Error('Callback cannot be null or undefined');
    }

    const signals: Map<string, Signal<T[K]>> = Reflect.getMetadata(SIGNAL_KEY, instance);
    if (!signals) {
        throw Error(`The instance of ${instance.constructor.name} is not observable`);
    }

    if (item) {
        const signal = signals.get(String(item));
        if (!signal) {
            throw Error(`The item ${String(item)} is not reactive`);
        }
        return signal.subscribe(callback);
    }

    const subs: Array<() => void> = [];
    signals.forEach((signal) => {
        subs.push(signal.subscribe(callback));
    });
    return () => {
        subs.forEach((fn) => fn());
    };
}

export function unobserve<T extends Object, K extends keyof T>(
    instance: T,
    callback?: (data: T) => void
): void;
export function unobserve<T extends Object, K extends keyof T>(
    instance: T,
    item?: K,
    callback?: (data: T[K]) => void
): void
export function unobserve<T extends Object, K extends keyof T>(
    instance: T,
    item?: K,
    callback?: (data: T[K]) => void
) {
    if (!callback) {
        return;
    }

    const signals: Map<string, Signal<T[K]>> = Reflect.getMetadata(SIGNAL_KEY, instance);
    if (!signals) {
        return;
    }
    if (item) {
        const signal = signals.get(String(item));
        if (!signal) {
            return;
        }
        signal.unsubscribe(callback);
        return;
    }
    signals.forEach((signal) => {
        signal.unsubscribe(callback);
    });
}
