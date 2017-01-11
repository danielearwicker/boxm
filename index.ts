
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

function makeBoxedValue(obj: any, key: string) {
    // MobX will leave it alone if it has a prototype    
    const value = Object.create(prototype);
    value.get = () => (obj as any)[key];
    value.set = (val: any) => (obj as any)[key] = val;
    return value;
}

const handler: ProxyHandler<any> = {
    get(target: any, key: PropertyKey) {
        return makeBoxedValue(target, key as string);
    }
}

export function box<T>(obj: T): BoxedObject<T> {

    if (proxyEnabled) {
        return new Proxy(obj, handler);
    }

    var fallbackProxy: any = {};
    for (const key of Object.keys(obj)) {
        fallbackProxy[key] = makeBoxedValue(obj, key);
    }

    return fallbackProxy;
}

