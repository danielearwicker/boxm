# meta-object
_Turning properties into objects_

[![Build Status](https://travis-ci.org/danielearwicker/meta-object.svg?branch=master)](https://travis-ci.org/danielearwicker/meta-object)
[![Coverage Status](https://coveralls.io/repos/danielearwicker/meta-object/badge.svg?branch=master&service=github)](https://coveralls.io/github/danielearwicker/meta-object?branch=master)

## Prerequisites

`meta-object` has no package dependencies itself. It assumes a JS runtime that is ES5 + `Object.assign`.

## Use case

In MobX you typically have an object holding the current state of the UI (or a piece of the UI):

```ts
class Person {
    @observable firstName = "Leia";
    @observable lastName = "Organa";
}
```

And in React you can create modular components. These might be as elemental as a single text input field:

```ts
interface TextInputProps {
    text: Value<string>;  // see Value<T> declaration below
}

function TextInput(props: TextInputProps) {
    return <input type="text"
        value={props.text.value}
        onChange={e => props.text.value = (e.target as HTMLInputElement).value}
        />
}
```

With such a component you can describe the UI:

```tsx
return (
    <div>
        <div>
            <label>First name: 
                <TextInput text={from(person)("firstName")}/> 
            </label>
        </div>
        <div>
            <label>Last name: 
                <TextInput text={from(person)("lastName")}/> 
            </label>
        </div>
    </div>
);
```

This achieves simple two-way binding, via the `from` function. Although the property name is specified as a string, it is statically type checked, as is the property's value type.

## Dry theory

A `MetaObject` is a wrapper around an ordinary object, which provides access its properties (it's actually a function):

```ts
export interface MetaObject<T> {
    <K extends keyof T>(name: K): MetaProperty<T[K]>;
}
```

The `from` function can make this wrapper from any object:

```ts
function from<T>(obj: T): MetaObject<T>;
```

The purpose is **not** to allow dynamic access to the properties by name (JavaScript already allows that). The purpose is the exact opposite: to allow a reference to a mutable property to be created with *static* type safety. 

The type declaration means that the `name` must be a string that matches the name of a property in `T`. Also the returned `MetaProperty` will wrap a value of that property's type.

The simplest representation of a mutable value is:

```ts
export interface Value<T> { value: T; }
```

That is, an object with a property called `value`. By housing it in object, it becomes "first class" so we can pass it around as a reference (e.g. as a prop to a React component).

A property obtained from a `MetaObject` is both a `Value` (so you can get or set the property's value) and also a `MetaObject` (so you can access its own properties, if any).

```ts
export interface MetaProperty<T> 
       extends MetaObject<T>, Value<T> { }
```

This recursive nature means that you can follow a path down a hierarchy of objects.
