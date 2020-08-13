import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Nully = suite('nullish');

	Nully('null', () => {
		let input = null;
		let output = klona(input);

		assert.deepEqual(input, output);

		output = 1;
		assert.equal(input, null);

		input = 123;
		assert.equal(output, 1);
	});

	Nully('undefined', () => {
		let input = undefined;
		let output = klona(input);

		assert.deepEqual(input, output);

		output = 1;
		assert.equal(input, undefined);

		input = 123;
		assert.equal(output, 1);
	});

	Nully('0', () => {
		let input = 0;
		let output = klona(input);

		assert.deepEqual(input, output);

		output = 1;
		assert.equal(input, 0);

		input = 123;
		assert.equal(output, 1);
	});

	Nully('NaN', () => {
		let input = NaN;
		let output = klona(input);

		assert.equal(Number.isNaN(output), true);

		output = 1;
		assert.equal(Number.isNaN(input), true);

		input = 123;
		assert.equal(output, 1);
	});

	Nully.run();
}
