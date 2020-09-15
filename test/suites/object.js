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

	Objects.run();
}
