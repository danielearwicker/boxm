import * as test from "tape";

import { from } from "../index"

test("Object literal properties", t => {

    const o = { str: "hello", num: 5 };

    const str = from(o)("str");
    const num = from(o)("num");

    t.equal(str.value, "hello");
    t.equal(num.value, 5);    

    str.value = "goodbye";

    t.equal(str.value, "goodbye");
    t.equal(num.value, 5);    

    num.value = 22;

    t.equal(str.value, "goodbye");
    t.equal(num.value, 22);

    t.end();
});

test("Paths", t => {

    const first = { 
        day: "wednesday", 
        second: {
            third: { 
                num: 5 
            }
        }         
    };

    const day = from(first)("day");
    const third = from(first)("second")("third");
    const num = from(first)("second")("third")("num");

    t.equal(day.value, "wednesday");
    t.equal(third.value.num, 5);
    t.equal(num.value, 5);

    num.value = 6;

    t.equal(day.value, "wednesday");
    t.equal(third.value.num, 6);
    t.equal(num.value, 6);

    first.second = {
        third: {
            num: 22
        }
    };

    // still bound to original 'second'
    t.equal(day.value, "wednesday");
    t.equal(third.value.num, 6);
    t.equal(num.value, 6);

    // rebind
    const day2 = from(first)("day");
    const third2 = from(first)("second")("third");
    const num2 = from(first)("second")("third")("num");

    t.equal(day2.value, "wednesday");
    t.equal(third2.value.num, 22);
    t.equal(num2.value, 22);

    t.end();
});
