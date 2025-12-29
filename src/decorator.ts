import { SIGNAL_KEY } from './constant';
import { Signal } from './signal';

export const Reactive = (target: Object, propertyKey: string) => {
    const signals: Map<string, Signal> = Reflect.getMetadata(SIGNAL_KEY, target) || new Map();
    signals.set(propertyKey, new Signal());
    Reflect.defineMetadata(SIGNAL_KEY, signals, target);
};

export const observable = <T extends { new (...args: any[]): {} }>() => {
    return (constructor: T) => {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                const signals: Map<string, Signal> = Reflect.getMetadata(SIGNAL_KEY, this);

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
