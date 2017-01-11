
export interface MetaValue<T> { 
    get(): T;
    set(v: T): void;
}

export type MetaObject<T> = {
    readonly [P in keyof T]: MetaValue<T[P]>;
};

export function from<T>(obj: T): MetaObject<T> {

    // TODO - if Proxy support available (everywhere except IE!), create a proxy 
    // so we only generate property wrappers on demand. The approach below is 
    // then the fallback for IE 9 thru 11.

    var fallbackProxy: any = {};
    for (const key of Object.keys(obj)) {

        // Make the value proxy a function, this makes mobx leave it alone!
        const value = (() => {}) as any;
        value.get = () => (obj as any)[key];
        value.set = (val: any) => (obj as any)[key] = val;
        fallbackProxy[key] = value;
    }

    return fallbackProxy;
}

