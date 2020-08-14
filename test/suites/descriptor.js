import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Descriptors = suite('Descriptor');

	Descriptors('hidden', () => {
		const input = { foo: 123 };
		Object.defineProperty(input, 'bar', {
			enumerable: false,
			value: [1, 2, 3]
		});

		const output = klona(input);
		assert.deepEqual(input, output);

		assert.deepEqual(
			Object.getOwnPropertyDescriptor(output, 'bar'),
			{
				enumerable: false,
				configurable: false,
				writable: false,
				value: [1, 2, 3]
			}
		);

		output.bar.push('howdy');
		assert.deepEqual(input.bar, [1, 2, 3]);
	});

	Descriptors('hidden writable configurable', () => {
		const input = { foo: 123 };
		Object.defineProperty(input, 'bar', {
			enumerable: false,
			configurable: true,
			writable: true,
			value: [1, 2, 3]
		});

		const output = klona(input);
		assert.deepEqual(input, output);

		assert.deepEqual(
			Object.getOwnPropertyDescriptor(output, 'bar'),
			{
				enumerable: false,
				configurable: true,
				writable: true,
				value: [1, 2, 3]
			}
		);

		output.bar.push('howdy');
		assert.deepEqual(input.bar, [1, 2, 3]);
	});

	Descriptors('hidden getter', () => {
		const input = { foo: 123 };
		Object.defineProperty(input, 'bar', {
			enumerable: false,
			get() {
				return [1, 2, 3]
			}
		});

		const output = klona(input);
		assert.deepEqual(input, output);

		const xyz = Object.getOwnPropertyDescriptor(output, 'bar');
		assert.equal(typeof xyz.get, 'function');

		output.bar.push('howdy');
		assert.deepEqual(input.bar, [1, 2, 3]);
		assert.deepEqual(output.bar, [1, 2, 3]);
	});

	Descriptors.run();
}
