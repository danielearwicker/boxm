import * as test from "tape";

import { box, enableProxy } from "../index"

for (const mode of [true, false]) {

    enableProxy(mode);

    test(`Object literal properties, proxy={mode}`, t => {

        const o = { str: "hello", num: 5 };

        const str = box(o).str;
        const num = box(o).num;

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

    test(`Paths, proxy={mode}`, t => {

        const first = { 
            day: "wednesday", 
            second: {
                third: { 
                    num: 5 
                }
            }
        };

        const day = box(first).day;
        const third = box(first.second).third;
        const num = box(first.second.third).num;

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
        const day2 = box(first).day;
        const third2 = box(first.second).third;
        const num2 = box(first.second.third).num;

        t.equal(day2.get(), "wednesday");
        t.equal(third2.get().num, 22);
        t.equal(num2.get(), 22);

        t.end();
    });
}