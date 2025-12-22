import { SIGNAL_KEY } from './constant';
import { Signal } from './signal';

/**
 * Note - update reactive value must be called in a function
 * @param target
 * @param propertyKey
 */
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

                return new Proxy(this, {
                    set(target: any, prop: string, value) {
                        const oldValue = target[prop];
                        const signals: Map<string, Signal> = Reflect.getMetadata(
                            SIGNAL_KEY,
                            constructor.prototype
                        );
                        if (signals && signals.has(prop) && oldValue !== value) {
                            target[prop] = value;
                            signals.get(prop)?.signal(value);
                        } else {
                            target[prop] = value;
                        }
                        return true;
                    },
                });
            }
        };
    };
};
