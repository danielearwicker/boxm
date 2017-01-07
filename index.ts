export interface MetaObject<T> {
    <K extends keyof T>(name: K): MetaProperty<T[K]>;
}

export interface Value<T> { value: T; }

export interface MetaProperty<T>
       extends MetaObject<T>, Value<T> { }

function bind<T, K extends keyof T>(
    obj: T, 
    name: K
): MetaProperty<T[K]> {

    function f<C extends keyof T[K]>(
        childName: C
    ): MetaProperty<T[K][C]> {
        return bind(obj[name], childName);
    }

    Object.defineProperty(f, "value", {
        get() {
            return obj[name];
        },
        set(v) {
            obj[name] = v;
        }
    });

    return f as any;
}

export function from<T>(obj: T): MetaObject<T> {
    return <K extends keyof T>(name: K) => bind(obj, name);
}
