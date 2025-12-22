export class Signal<T = unknown> {
    private listeners = new Set<(val: T) => void>();

    signal(val: T) {
        this.listeners.forEach((fn) => fn(val));
    }

    subscribe(fn: (val: T) => void) {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }

    unsubscribe(fn: (val: T) => void) {
        this.listeners.delete(fn);
    }
}
