<div align="center">
  <img src="logo.png" alt="klona" height="100" />
</div>

<div align="center">
  <a href="https://npmjs.org/package/klona">
    <img src="https://badgen.now.sh/npm/v/klona" alt="version" />
  </a>
  <a href="https://github.com/lukeed/klona/actions">
    <img src="https://badgen.net/github/status/lukeed/klona" alt="status" />
  </a>
  <a href="https://npmjs.org/package/klona">
    <img src="https://badgen.now.sh/npm/dm/klona" alt="downloads" />
  </a>
  <a href="https://codecov.io/gh/lukeed/klona">
    <img src="https://badgen.net/codecov/c/github/lukeed/klona" alt="codecov" />
  </a>
</div>

<div align="center">A tiny (228B) and fast utility to "deep clone" Objects, Arrays, Dates, RegExps, and more!</div>


## Features

* Super tiny and [performant](#benchmarks)
* Deep clone / recursive copies
* Safety with `Date`s and `RegExp`s

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
  JSON.stringify   x  37,987 ops/sec ±0.56% (91 runs sampled)
  fast-clone       x  23,840 ops/sec ±0.62% (93 runs sampled)
  lodash           x  40,873 ops/sec ±1.13% (94 runs sampled)
  clone-deep       x  84,537 ops/sec ±0.16% (97 runs sampled)
  deep-copy        x 116,896 ops/sec ±0.15% (99 runs sampled)
  depcopy          x  24,788 ops/sec ±0.62% (95 runs sampled)
  klona            x 250,513 ops/sec ±0.20% (96 runs sampled)
```


## Related

* [dlv](https://github.com/developit/dlv) – safely **read** from deep properties in 120 bytes
* [dset](https://github.com/lukeed/dset) – safely **write** into deep properties in 160 bytes
* [dequal](https://github.com/lukeed/dequal) – safely check for deep equality in 247 bytes


## License

MIT © [Luke Edwards](https://lukeed.com)
