import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const  Classes = suite('class');

	Classes('class', () => {
		class Foobar {}
		const input = new Foobar();
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.equal(input.constructor, output.constructor);
		assert.equal(output.constructor.name, 'Foobar');

		output.foobar = 123;
		// @ts-ignore
		assert.notEqual(input.foobar, 123);
	});

	// @see https://github.com/lukeed/klona/issues/14
	Classes('prototype', () => {
		function Test () {}
		Test.prototype.val = 42;

		const input = new Test();
		const output = klona(input);

		assert.deepEqual(input, output);

		assert.deepEqual(output.constructor, Test);
		assert.deepEqual(output.__proto__, { val: 42 });
		assert.deepEqual(output, {});
		assert.equal(output.val, 42);
	});

	Classes('prototype methods :: manual', () => {
		function Test() {}

		Test.prototype = {
			count: 0,
			increment() {
				this.count++;
			}
		};

		const input = new Test();
		const output = klona(input);

		assert.equal(input.count, 0);
		assert.equal(output.count, 0);

		assert.equal(typeof input.increment, 'function');
		assert.equal(typeof output.increment, 'function');

		output.increment();
		assert.equal(input.count, 0);
		assert.equal(output.count, 1);

		input.increment();
		assert.equal(input.count, 1);
		assert.equal(output.count, 1);
	});

	Classes('prototype methods :: class', () => {
		class Test {
			constructor() {
				this.count = 0;
			}
			increment() {
				this.count++
			}
		}

		const input = new Test();
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.deepEqual(output.__proto__, Test.prototype);

		assert.equal(input.count, 0);
		assert.equal(output.count, 0);

		assert.equal(typeof input.increment, 'function');
		assert.equal(typeof output.increment, 'function');

		output.increment();
		assert.equal(input.count, 0);
		assert.equal(output.count, 1);

		input.increment();
		assert.equal(input.count, 1);
		assert.equal(output.count, 1);
	});

	Classes('constructor properties', () => {
		function Test (num) {
			this.value = num;
		}

		Test.prototype.val = 42;

		const input = new Test(123);
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.deepEqual(output.constructor, Test);
		assert.deepEqual(output.__proto__, { val: 42 });
		assert.equal(output.value, 123);
		assert.equal(output.val, 42);
	});

	Classes('constructor properties :: class', () => {
		class Test {
			constructor(num) {
				this.value = num;
			}
		}

		Test.prototype.val = 42;

		const input = new Test(123);
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.deepEqual(output.constructor, Test);
		assert.deepEqual(output.__proto__, { val: 42 });

		assert.equal(output.value, 123);
		assert.equal(output.val, 42);
	});

	Classes('constructor properties :: defaults', () => {
		class Test {
			constructor(num = 123) {
				this.value = num;
			}
		}

		const input = new Test(456);
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.equal(output.value, 456);
	});

	Classes('accessors', () => {
		class Test {
			get val() {
				return 42;
			}
		}

		const input = new Test();
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.deepEqual(output.constructor, Test);
		assert.deepEqual(output.__proto__, {});

		assert.deepEqual(
			// @ts-ignore
			Object.getOwnPropertyDescriptor(input.__proto__, 'val'),
			Object.getOwnPropertyDescriptor(output.__proto__, 'val'),
		);

		assert.equal(output.val, 42);
	});

	Classes('inheritance', () => {
		class Animal {
			constructor() {
				this.cute = true;
			}
			get carbon() {
				return true;
			}
		}

		class Dog extends Animal {
			constructor(name) {
				super();
				this.name = name;
			}
			bark() {
				console.log('woof');
			}
		}

		const input = new Dog('spot');
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.deepEqual(input.name, output.name);
		assert.equal(output instanceof Animal, true);
		assert.deepEqual(output.constructor, Dog);
		assert.deepEqual(output.__proto__, {});
		assert.equal(output.carbon, true);

		assert.deepStrictEqual(
			Object.getOwnPropertyDescriptors(input),
			Object.getOwnPropertyDescriptors(output),
		);
	});

	Classes.run();
}
