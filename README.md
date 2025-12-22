# The reactive module for JS app

# How to install

1. npm install reactive-combine reflect-metadata
2. import 'reflect-metadata' in the first line of your project entrypoint

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