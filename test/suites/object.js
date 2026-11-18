import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Objects = suite('Object');

	Objects('flat', () => {
		const input = { foo:1, bar:2, baz:3 };
		const output = klona(input);

		assert.deepEqual(input, output);

		output.foo++;
		assert.equal(input.foo, 1);

		output.bar = 'hello';
		assert.equal(input.bar, 2);
	});

	Objects('nested', () => {
		const input = {
			foo: 1,
			bar: {
				a: 2,
				b: ['hello', 'world'],
				c: [{ hello: 1, world: 2 }]
			},
			baz: 3
		};

		const output = klona(input);

		assert.equal(
			JSON.stringify(input),
			JSON.stringify(output)
		);

		output.bar.a = 11;
		assert.equal(input.bar.a, 2);

		output.bar.b[1] = 'mundo';
		assert.equal(input.bar.b[1], 'world');

		output.bar.c[0].hello = 99;
		assert.equal(input.bar.c[0].hello, 1);
	});

	Objects('Object.create', () => {
		const input = Object.create({
			method() {
				return 'foo';
			}
		});

		const output = klona(input);

		assert.equal(input.method(), 'foo');
		assert.equal(output.method(), 'foo');
	});

	Objects('spoofed Symbol.toStringTag', () => {
		// A plain object must be deep-cloned no matter its tag (#54).
		// Before the fix, a 'Map' tag crashed (`x.forEach is not a function`)
		// and unknown tags returned the input by reference.
		const map = { a: 1, [Symbol.toStringTag]: 'Map' };
		const out1 = klona(map);

		assert.notEqual(out1, map);
		assert.equal(out1.a, 1);

		out1.a = 99;
		assert.equal(map.a, 1);

		const err = { a: 1, [Symbol.toStringTag]: 'Error' };
		const out2 = klona(err);

		assert.notEqual(out2, err);
		assert.equal(out2.a, 1);

		out2.a = 99;
		assert.equal(err.a, 1);

		// nested spoofed objects are cloned too
		const nested = { inner: { a: 1, [Symbol.toStringTag]: 'Set' } };
		const out3 = klona(nested);

		assert.notEqual(out3.inner, nested.inner);
		assert.equal(out3.inner.a, 1);
	});

	Objects.run();
}
