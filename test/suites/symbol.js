import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Symbols = suite('Symbol');

	Symbols('direct', () => {
		const input = Symbol('input');
		const output = klona(input);

		assert.deepStrictEqual(input, output);
	});

	// https://github.com/lukeed/klona/issues/16
	Symbols('object :: enumerable key', () => {
		const key = Symbol('key');
		const input = { foo: 123, [key]: 456 };
		console.log('START');
		const output = klona(input);
		console.log('~> output', output);

		assert.equal(output[key], 456);
		assert.deepStrictEqual(input, output);
	});

	Symbols.run();
}
