<div align="center">
  <img src="logo.png" alt="klona" height="100" />
</div>

<div align="center">
  <a href="https://npmjs.org/package/klona">
    <img src="https://badgen.now.sh/npm/v/klona" alt="version" />
  </a>
  <a href="https://github.com/lukeed/klona/actions">
    <img src="https://github.com/lukeed/klona/workflows/CI/badge.svg" alt="CI" />
  </a>
  <a href="https://npmjs.org/package/klona">
    <img src="https://badgen.now.sh/npm/dm/klona" alt="downloads" />
  </a>
  <a href="https://codecov.io/gh/lukeed/klona">
    <img src="https://codecov.io/gh/lukeed/klona/branch/master/graph/badge.svg?token=8ej0WeKqz7" alt="codecov" />
  </a>
</div>

<div align="center">A tiny (366B) and fast utility to "deep clone" Objects, Arrays, Dates, RegExps, and more!</div>


## Features

* Super tiny and [performant](#benchmarks)
* Deep clone / recursive copies
* Safely handles complex data types<br>
    _Array, Date, Map, Object, RegExp, Set, TypedArray_

Unlike a "shallow copy" (eg, `Object.assign`), a "deep clone" recursively traverses a source input and copies its _values_ &mdash; instead of _references_ to its values &mdash; into a new instance of that input. The result is a structurally equivalent clone that operates independently of the original source and controls its own values.

Additionally, this module is delivered as:

* **ES Module**: [`dist/klona.mjs`](https://unpkg.com/klona/dist/klona.mjs)
* **CommonJS**: [`dist/klona.js`](https://unpkg.com/klona/dist/klona.js)
* **UMD**: [`dist/klona.min.js`](https://unpkg.com/klona)

> **Why "klona"?** It's "clone" in Swedish.<br>
> **What's with the sheep?** [Dolly](https://en.wikipedia.org/wiki/Dolly_(sheep)).


## Install

```
$ npm install --save klona
```


## Usage

```js
import klona from 'klona';

const input = {
  foo: 1,
  bar: {
    baz: 2,
    bat: {
      hello: 'world'
    }
  }
};

const output = klona(input);

// exact copy of original
assert.deepStrictEqual(input, output);

// applying deep updates...
output.bar.bat.hola = 'mundo';
output.bar.baz = 99;

// ...doesn't affect source!
console.log(
  JSON.stringify(input, null, 2)
);
// {
//   "foo": 1,
//   "bar": {
//     "baz": 2,
//     "bat": {
//       "hello": "world"
//     }
//   }
// }
```


## API

### klona(input)
Returns: `typeof input`

Returns a deep copy/clone of the input.


## Benchmarks

> via Node.js v10.13.0

```
Validation:
  ✘ JSON.stringify (FAILED @ "initial copy")
  ✘ fast-clone (FAILED @ "initial copy")
  ✔ lodash
  ✔ clone-deep
  ✘ deep-copy (FAILED @ "initial copy")
  ✔ depcopy
  ✔ klona

Benchmark:
  JSON.stringify   x  37,803 ops/sec ±0.68% (89 runs sampled)
  fast-clone       x  24,210 ops/sec ±0.81% (91 runs sampled)
  lodash           x  40,563 ops/sec ±1.10% (94 runs sampled)
  clone-deep       x  85,020 ops/sec ±0.17% (95 runs sampled)
  deep-copy        x 116,139 ops/sec ±0.29% (96 runs sampled)
  depcopy          x  24,392 ops/sec ±0.71% (96 runs sampled)
  klona            x 274,496 ops/sec ±0.15% (99 runs sampled)
```


## Related

* [dlv](https://github.com/developit/dlv) – safely **read** from deep properties in 120 bytes
* [dset](https://github.com/lukeed/dset) – safely **write** into deep properties in 160 bytes
* [dequal](https://github.com/lukeed/dequal) – safely check for deep equality in 247 bytes


## License

MIT © [Luke Edwards](https://lukeed.com)
