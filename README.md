# boxm
_Turning properties into objects_

[![Build Status](https://travis-ci.org/danielearwicker/boxm.svg?branch=master)](https://travis-ci.org/danielearwicker/boxm)
[![Coverage Status](https://coveralls.io/repos/danielearwicker/boxm/badge.svg?branch=master&service=github)](https://coveralls.io/github/danielearwicker/boxm?branch=master)

## Usage

```ts
import { box } from "boxm"

const person = new Person();

// get a reference to the firstName property
const firstNameProperty = box(person).firstName;

// get/set the property value
const oldName = firstNameProperty.get();
firstNameProperty.set("Jim");

// grab several references in one hit (destructuring)
const { firstName, lastName, dateOfBirth } = box(person);
```

## Installation

```
npm install --save boxm
```

(Type declarations are included of course.)

## Dependency-free

Although it is useful with React and MobX (and the name is a play on MobX, as well as *box 'em*), `boxm` has no runtime package dependencies itself.

## Purpose

This library provides a way to conveniently grab a "reference" to a mutable property, with static type safety for TypeScript users.

Properties are named features of objects and so to address one for reading/writing you need to know the object and the name of the property. This can lead to ugly bifurcation and the use of "stringly typed" interfaces.

It's better to make an object with a static `get`/`set` interface that encapsulates one property:

```ts
export interface BoxedValue<T> { 
    get(): T;
    set(v: T): void;
}
```

This can then be passed around as a first-class value. All that's needed is a succinct way to create such an object.

[More background here](http://danielearwicker.github.io/Box_em_Property_references_for_TypeScript.html)

## Fun, Exciting Use-case

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
    text: BoxedValue<string>;  // see BoxedValue<T> declaration above
}

function TextInput(props: TextInputProps) {
    return <input type="text"
        value={props.text.get()}
        onChange={e => props.text.set((e.target as HTMLInputElement).value)}
        />
}
```

With such a component you can describe the UI:

```tsx
const { firstName, lastName } = box(simpson);

return (
    <div>
        <div>
            <label>First name: <TextInput text={firstName}/></label>
        </div>
        <div>
            <label>Last name: <TextInput text={lastName}/></label>
        </div>
    </div>
);
```

This achieves simple two-way binding, via the `box` function, with obvious clarity and static type-safety. If we'd just said `person.lastName` we'd be passing the value, so the `TextInput` component would not be able to modify the value, but by saying `box(person).lastName` we're passing a wrapper that supports both `get` and `set` operations on the value of `person.lastName`.

## Advanced API

You can create a `box`-like function from any function that can create a `BoxValue`, by wrapping it with the `boxer` higher order function:

```ts
function boxer(
    propertyBoxer: (obj: any, key: string) => BoxedValue<any>
): <T>(obj: T) => BoxedObject<T>;
```

So it accepts a "dynamic" means of boxing a single property, and returns a function that provides the same facility through the statically type-checked API of `boxm`.

The function `makeBoxedValue`, is suitable for passing directly to `boxer` to duplicate the standard behaviour:

```ts
function makeBoxedValue(obj: any, key: string): BoxedValue<any>;
```

(The returned object has a prototype, which serves as a hint to MobX to handle it transparently.)

Combining these two pieces, we get the implementation of `box`:

```ts
const box = boxer(makeBoxedValue);
```

For example, this is how [bidi-mobx](https://github.com/danielearwicker/bidi-mobx) defines its own MobX-optimal version of `box`. It falls back to `makeBoxedValue` if it can't do any better:

```ts
const box = boxer((obj, key) => {
    const atom = (isObservable(obj, key) || isComputed(obj, key)) 
        && extras.getAtom(obj, key) as any as BoxedValue<any>;

    return atom || makeBoxedValue(obj, key);
});
```

## License

MIT