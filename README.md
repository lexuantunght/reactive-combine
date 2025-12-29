# The reactive module for JS app

# How to install

```

npm install reactive-combine

```

# How to use

```

import { observable, Reactive, observe } from 'reactive-combine';

export interface MyApp {
    readonly isReady: boolean;
}

@observable()
export class MyAppImpl implements MyApp {
    @Reactive isReady: boolean = false;

    setReady() {
        this.isReady = true; // Cause signal
    }
}


function App() {
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const instance: MyApp = new MyAppImpl()
        return observe(instance, 'isReady', (ready: boolean) => {
            setReady(ready)
        })
    }, [])

    if (!ready) {
        return <Splash />;
    }

    return <AppContent>;
}

```

# Create custom hook in React usage

```

import React from 'react';
import { observe } from 'reactive-combine';

export function useReactive<T extends object>(instance: T) {
    const [, setTick] = React.useState(0);

    React.useEffect(() => {
        return observe(instance, () => {
            setTick((t) => t + 1);
        });
    }, [instance]);

    return instance;
}

export function useReactiveItem<T extends object, K extends keyof T>(instance: T, item: T[K]) {
    const [, setTick] = React.useState(0);

    React.useEffect(() => {
        return observe(instance, item, () => {
            setTick((t) => t + 1);
        });
    }, [instance, item]);

    return instance[item];
}

```