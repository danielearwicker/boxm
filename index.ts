
let proxyEnabled = typeof Proxy !== "undefined";

export function enableProxy(enabled: boolean) {
    proxyEnabled = enabled;
}

export interface BoxedValue<T> { 
    get(): T;
    set(v: T): void;
}

export type BoxedObject<T> = {
    readonly [P in keyof T]: BoxedValue<T[P]>;
};

const prototype: BoxedValue<any> = {} as any;

export function makeBoxedValue(obj: any, key: string): BoxedValue<any> {
    // MobX will leave it alone if it has a prototype    
    const value = Object.create(prototype);
    value.get = () => (obj as any)[key];
    value.set = (val: any) => (obj as any)[key] = val;
    return value;
}

export function boxer(propertyBoxer: (obj: any, key: string) => BoxedValue<any>) {
    const handler = {
        get(target: any, key: PropertyKey) {
            return propertyBoxer(target, key as string);
        }
    };

    return <T>(obj: T): BoxedObject<T> => {
        if (proxyEnabled) {
            return new Proxy(obj, handler);
        }

        var fallbackProxy: any = {};
        for (const key of Object.keys(obj)) {
            fallbackProxy[key] = propertyBoxer(obj, key);
        }

        return fallbackProxy;
    }
}

export const box = boxer(makeBoxedValue);
