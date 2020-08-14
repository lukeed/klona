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

<div align="center">A tiny (240B to 507B) and fast utility to "deep clone" Objects, Arrays, Dates, RegExps, and more!</div>


## Features

* Super tiny and [performant](#benchmarks)
* Deep clone / recursive copies
* Safely handles complex data types<br>
    _Array, Date, Map, Object, RegExp, Set, TypedArray, and more_

Unlike a "shallow copy" (eg, `Object.assign`), a "deep clone" recursively traverses a source input and copies its _values_ &mdash; instead of _references_ to its values &mdash; into a new instance of that input. The result is a structurally equivalent clone that operates independently of the original source and controls its own values.

> **Why "klona"?** It's "clone" in Swedish.<br>
> **What's with the sheep?** [Dolly](https://en.wikipedia.org/wiki/Dolly_(sheep)).


## Install

```
$ npm install --save klona
```


## Modes

There are multiple "versions" of `klona` available, which allows you to bring only the functionality you need!

#### `klona/json`
> **Size (gzip):** 240 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/klona/json/index.js), [ES Module](https://unpkg.com/klona/json/index.mjs), [UMD](https://unpkg.com/klona/json/index.min.js)<br>
> **Ability:** JSON data types

```js
import { klona } from 'klona/json';
```

#### `klona/lite`
> **Size (gzip):** 354 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/klona/lite/index.js), [ES Module](https://unpkg.com/klona/lite/index.mjs), [UMD](https://unpkg.com/klona/lite/index.min.js)<br>
> **Ability:** extends `klona/json` with support for custom class, Date, and RegExp

```js
import { klona } from 'klona/lite';
```

#### `klona`
> **Size (gzip):** 451 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/klona/dist/index.js), [ES Module](https://unpkg.com/klona/dist/index.mjs), [UMD](https://unpkg.com/klona/dist/index.min.js)<br>
> **Ability:** extends `klona/lite` with support for Map, Set, DataView, ArrayBuffer, TypedArray

```js
import { klona } from 'klona';
```

#### `klona/full`
> **Size (gzip):** 507 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/klona/full/index.js), [ES Module](https://unpkg.com/klona/full/index.mjs), [UMD](https://unpkg.com/klona/full/index.min.js)<br>
> **Ability:** extends `klona` with support for Symbol properties and and non-enumerable properties

```js
import { klona } from 'klona/full';
```


## Usage

```js
import { klona } from 'klona';

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

> Running Node v12.18.3

The benchmarks can be found in the [`/bench`](/bench) directory. They are separated into multiple categories:

* `JSON` – compares an array of objects comprised of JSON data types (`String`, `Number`, `null`, `Array`, `Object`)
* `LITE` – like `JSON`, but adds `RegExp`, `Date` and `undefined` values
* `DEFAULT` – object with `RegExp`, `Date`, `Array`, `Map`, `Set`, custom class, `Int8Array`, `DataView`, `Buffer` values
* `FULL` – like `DEFAULT`, but adds `Symbol` and non-enumerable properties

> **Important:** Only candidates that pass validation step(s) are listed. <br>However, `lodash` and `clone` are kept to highlight important differences.

> **Note:** The `clone/include` candidate refers to its [`includeNonEnumerable` option](https://www.npmjs.com/package/clone#api) enabled.

```
Load times:
  lodash/clonedeep   29.257ms
  rfdc                0.511ms
  clone               0.576ms
  clone-deep          2.494ms
  deep-copy           0.451ms
  klona/full          0.408ms
  klona               0.265ms
  klona/lite          0.308ms
  klona/json          0.263ms

Benchmark :: JSON
  JSON.stringify      x   50,156 ops/sec ±0.32% (93 runs sampled)
  lodash              x   44,269 ops/sec ±0.48% (94 runs sampled)
  rfdc                x  202,428 ops/sec ±0.91% (94 runs sampled)
  clone               x   38,947 ops/sec ±0.34% (97 runs sampled)
  clone/include       x   25,021 ops/sec ±0.22% (93 runs sampled)
  clone-deep          x   98,676 ops/sec ±0.20% (93 runs sampled)
  deep-copy           x  129,432 ops/sec ±0.25% (98 runs sampled)
  klona/full          x   52,482 ops/sec ±0.26% (98 runs sampled)
  klona               x  257,905 ops/sec ±0.54% (97 runs sampled)
  klona/lite          x  301,324 ops/sec ±0.31% (97 runs sampled)
  klona/json          x  336,300 ops/sec ±0.17% (96 runs sampled)

Benchmark :: LITE
  lodash              x   35,046 ops/sec ±0.20% (96 runs sampled)
  clone               x   35,425 ops/sec ±0.46% (93 runs sampled)
  clone/include       x   22,296 ops/sec ±0.31% (95 runs sampled)
  clone-deep          x   85,550 ops/sec ±0.25% (97 runs sampled)
  klona/full          x   46,303 ops/sec ±0.30% (96 runs sampled)
  klona               x  211,161 ops/sec ±0.19% (99 runs sampled)
  klona/lite          x  241,172 ops/sec ±0.17% (97 runs sampled)

Benchmark :: DEFAULT
  lodash              x   48,006 ops/sec ±0.34% (95 runs sampled)
    ✘ Buffer
    ✘ Map keys
  clone               x   91,191 ops/sec ±0.24% (94 runs sampled)
    ✘ DataView
  clone/include       x   59,209 ops/sec ±0.28% (96 runs sampled)
    ✘ DataView
  klona/full          x   84,333 ops/sec ±0.27% (95 runs sampled)
  klona               x  208,685 ops/sec ±0.23% (95 runs sampled)

Benchmark :: FULL
  lodash              x   51,634 ops/sec ±0.44% (94 runs sampled)
    ✘ Buffer
    ✘ Map keys
    ✘ Missing non-enumerable Properties
  clone/include       x   44,020 ops/sec ±0.31% (93 runs sampled)
    ✘ DataView
    ✘ Incorrect non-enumerable Properties
  klona/full          x   78,217 ops/sec ±0.61% (97 runs sampled)
```


## Related

* [dlv](https://github.com/developit/dlv) – safely **read** from deep properties in 120 bytes
* [dset](https://github.com/lukeed/dset) – safely **write** into deep properties in 160 bytes
* [dequal](https://github.com/lukeed/dequal) – safely check for deep equality in 304 to 489 bytes


## License

MIT © [Luke Edwards](https://lukeed.com)
