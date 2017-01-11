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

Although it is useful with React and MobX, `boxm` has no runtime package dependencies itself.

## Purpose

This library provides a way to conveniently grab a "reference" to a mutable property, with static type safety for TypeScript users.

Properties are named features of objects and so to address one for reading/writing you need to know the object and the name of the property. This can lead to ugly bifurcation and the use of "stringly typed" interfaces.

It's better to make an object with a static `get`/`set` interface that encapsulates one property:

```ts
export interface MetaValue<T> { 
    get(): T;
    set(v: T): void;
}
```

This can then be passed around as a first-class value. All that's needed is a succinct way to create such an object.

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
    text: MetaValue<string>;  // see MetaValue<T> declaration above
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
