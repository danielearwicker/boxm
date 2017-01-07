export interface Bindable<T> {
    <K extends keyof T>(name: K): BindableValue<T[K]>;
}

export interface Value<T> {
    value: T;
}

export interface BindableValue<T> extends Bindable<T>, Value<T> { }

function bind<T, K extends keyof T>(obj: T, name: K): BindableValue<T[K]> {
    
    function f<C extends keyof T[K]>(childName: C): BindableValue<T[K][C]> {
        return bind(obj[name], childName);
    }

    return Object.assign(f, {
        get value() {
            return obj[name];
        },
        set value(val: T[K]) {
            obj[name] = val;
        }
    });
}

export function from<T>(obj: T): Bindable<T> {
    return <K extends keyof T>(name: K): BindableValue<T[K]> => bind(obj, name);
}
