import { from, enableProxy } from "./index"

// Quick benchmark of Proxy versus fallback. I find Proxy is about 5x faster.

for (const mode of [true, false]) {

    enableProxy(mode);

    var started = process.hrtime()

    for (let n = 0; n < 1000000; n++) {
        const o = { str: "hello", num: 5, 
            junk1: 1, junk2: 1, junk3: 1, 
            junk4: 1, junk5: 1, junk6: 1,
            junk7: 1, junk8: 1, junk9: 1 };
        const str = from(o).str;
        const num = from(o).num;
        str.get();
        num.get();
        str.set(str.get() + num.get());
    }

    var elapsed = process.hrtime(started);

    console.log(mode, elapsed[0] * 1000 + elapsed[1]/1000000);
}

// Relevant node API
declare const process: { 
    hrtime(time?: [number, number]): [number, number];
}
