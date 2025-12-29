import { signalStore } from './constant';
import { Signal } from './signal';

export const Reactive = (target: Object, propertyKey: string) => {
    const signals: Map<string, Signal> = signalStore.get(target) || new Map();
    signals.set(propertyKey, new Signal());
    signalStore.set(target, signals);
};

export const observable = <T extends { new (...args: any[]): {} }>() => {
    return (constructor: T) => {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                const signals: Map<string, Signal> = signalStore.get(this);

                signals.forEach((signal, key) => {
                    let value = this[key as keyof typeof this];
                    Object.defineProperty(this, key, {
                        set(val) {
                            if (val !== value) {
                                value = val;
                                signal.signal(val);
                            }
                        },
                        get() {
                            return value;
                        },
                    });
                });
            }
        };
    };
};
