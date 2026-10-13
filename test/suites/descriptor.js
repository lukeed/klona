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

	Descriptors('non-writable array length', () => {
		[[], [{ value: 1 }], Array(3)].forEach(input => {
			Object.defineProperty(input, 'length', { writable: false });
			const output = klona(input);

			assert.notStrictEqual(output, input);
			assert.deepStrictEqual(
				Object.getOwnPropertyDescriptor(output, 'length'),
				Object.getOwnPropertyDescriptor(input, 'length')
			);
			assert.throws(() => output.push('extra'), TypeError);
			assert.equal(output.length, input.length);
			if (input[0]) {
				output[0].value = 2;
				assert.equal(input[0].value, 1);
			}
		});
	});

	Descriptors('non-writable RegExp lastIndex', () => {
		[0, 2].forEach(value => {
			const input = /a/g;
			Object.defineProperty(input, 'lastIndex', { value, writable: false });
			const output = klona(input);

			assert.notStrictEqual(output, input);
			assert.deepStrictEqual(
				Object.getOwnPropertyDescriptor(output, 'lastIndex'),
				Object.getOwnPropertyDescriptor(input, 'lastIndex')
			);
			assert.throws(() => output.exec('aaa'), TypeError);
		});
	});

	Descriptors('writable builtin properties stay writable', () => {
		const array = klona([1]);
		array.push(2);
		assert.deepEqual(array, [1, 2]);
		const regexp = klona(/a/g);
		assert.equal(regexp.exec('a')[0], 'a');
		assert.equal(regexp.lastIndex, 1);
	});

	Descriptors('typed array custom property descriptors', () => {
		class Values extends Uint8Array {
			constructor(value) {
				super(value);
				Object.defineProperty(this, 'label', {
					value: 1, enumerable: true, configurable: true, writable: true
				});
			}
		}
		const input = new Values([1, 2]);
		Object.defineProperty(input, 'label', { writable: false });
		Object.defineProperty(input, '01', { value: { nested: true } });
		const output = klona(input);
		assert.deepStrictEqual(
			Object.getOwnPropertyDescriptor(output, 'label'),
			Object.getOwnPropertyDescriptor(input, 'label')
		);
		assert.deepStrictEqual(
			Object.getOwnPropertyDescriptor(output, '01'),
			Object.getOwnPropertyDescriptor(input, '01')
		);
		assert.notStrictEqual(output['01'], input['01']);
		output[0] = 3;
		assert.equal(input[0], 1);
	});

	Descriptors.run();
}
