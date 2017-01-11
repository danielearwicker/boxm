import * as test from "tape";

import { from } from "../index"

test("Object literal properties", t => {

    const o = { str: "hello", num: 5 };

    const str = from(o).str;
    const num = from(o).num;

    t.equal(str.get(), "hello");
    t.equal(num.get(), 5);    

    str.set("goodbye");

    t.equal(str.get(), "goodbye");
    t.equal(num.get(), 5);    

    num.set(22);

    t.equal(str.get(), "goodbye");
    t.equal(num.get(), 22);

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

    const day = from(first).day;
    const third = from(first.second).third;
    const num = from(first.second.third).num;

    t.equal(day.get(), "wednesday");
    t.equal(third.get().num, 5);
    t.equal(num.get(), 5);

    num.set(6);

    t.equal(day.get(), "wednesday");
    t.equal(third.get().num, 6);
    t.equal(num.get(), 6);

    first.second = {
        third: {
            num: 22
        }
    };

    // still bound to original 'second'
    t.equal(day.get(), "wednesday");
    t.equal(third.get().num, 6);
    t.equal(num.get(), 6);

    // rebind
    const day2 = from(first).day;
    const third2 = from(first.second).third;
    const num2 = from(first.second.third).num;

    t.equal(day2.get(), "wednesday");
    t.equal(third2.get().num, 22);
    t.equal(num2.get(), 22);

    t.end();
});
