<div align="center">
  <img src="logo.png" alt="klona" height="100" />
</div>

<div align="center">
  <a href="https://npmjs.org/package/klona">
    <img src="https://badgen.now.sh/npm/v/klona" alt="version" />
  </a>
  <a href="https://travis-ci.org/lukeed/klona">
    <img src="https://badgen.now.sh/travis/lukeed/klona" alt="travis" />
  </a>
  <a href="https://npmjs.org/package/klona">
    <img src="https://badgen.now.sh/npm/dm/klona" alt="downloads" />
  </a>
  <a href="https://codecov.io/gh/lukeed/klona">
    <img src="https://badgen.now.sh/codecov/c/github/lukeed/klona" alt="codecov" />
  </a>
</div>

<div align="center">A tiny (228B) and fast utility to "deep clone" Objects, Arrays, Dates, RegExps, and more!</div>


## Features

* Super tiny and [performant](#benchmarks)
* Deep clone / recursive copies
* Safety with `Date`s and `RegExp`s

Unlike a "shallow copy" (eg, `Object.assign`), a "deep clone" recursively traverses a source input and copies its _values_ &mdash; instead of _references_ to its values &mdash; into a new instance of that input. The result is a structurally equivalent carbon copy that operates independently of the original source.

Additionally, this module is delivered as:

* **ES Module**: [`dist/klona.mjs`](https://unpkg.com/klona/dist/klona.mjs)
* **CommonJS**: [`dist/klona.js`](https://unpkg.com/klona/dist/klona.js)
* **UMD**: [`dist/klona.min.js`](https://unpkg.com/klona)

> **Why "klona"?** It's "clone" in Swedish.<br>
> **Why the sheep, man?** Because [Dolly](https://en.wikipedia.org/wiki/Dolly_(sheep)).


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

> via Node.js v10.15.3

```
Validation:
  ✘ fast-clone (FAILED @ "intial copy")
  ✔ lodash
  ✔ clone-deep
  ✘ deep-copy (FAILED @ "intial copy")
  ✔ depcopy
  ✔ klona

Benchmark:
  fast-clone       x  22,323 ops/sec ±1.41% (90 runs sampled)
  lodash           x  39,066 ops/sec ±1.50% (90 runs sampled)
  clone-deep       x  81,136 ops/sec ±1.32% (91 runs sampled)
  deep-copy        x 109,054 ops/sec ±1.27% (94 runs sampled)
  depcopy          x  23,686 ops/sec ±0.75% (96 runs sampled)
  klona            x 238,643 ops/sec ±1.90% (92 runs sampled)
```


## Related

* [dlv](https://github.com/developit/dlv) – safely **read** from deep properties in 120 bytes
* [dset](https://github.com/lukeed/dset) – safely **write** into deep properties in 160 bytes


## License

MIT © [Luke Edwards](https://lukeed.com)
