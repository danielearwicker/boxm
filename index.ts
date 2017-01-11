
let proxyEnabled = typeof Proxy !== "undefined";

export function enableProxy(enabled: boolean) {
    proxyEnabled = enabled;
}

export interface MetaValue<T> { 
    get(): T;
    set(v: T): void;
}

export type MetaObject<T> = {
    readonly [P in keyof T]: MetaValue<T[P]>;
};

function makeMetaValue(obj: any, key: string) {
    // Make the value proxy a function, this makes mobx leave it alone!
    const value = (() => {}) as any;
    value.get = () => (obj as any)[key];
    value.set = (val: any) => (obj as any)[key] = val;
    return value;
}

const handler: ProxyHandler<any> = {
    get(target: any, key: PropertyKey) {
        return makeMetaValue(target, key as string);
    }
}

export function from<T>(obj: T): MetaObject<T> {

    if (proxyEnabled) {
        return new Proxy(obj, handler);
    }

    var fallbackProxy: any = {};
    for (const key of Object.keys(obj)) {
        fallbackProxy[key] = makeMetaValue(obj, key);
    }

    return fallbackProxy;
}

