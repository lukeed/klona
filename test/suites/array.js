import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Arrays = suite('Arrays');

	Arrays('flat', () => {
		const input = ['foo', 'bar', 'baz'];
		const output = klona(input);

		assert.deepEqual(input, output);

		output[1] = 'hello';
		assert.notEqual(input[1], 'hello');
	});

	Arrays('nested', () => {
		const input = ['foo', [1, 2, ['hello', 'world'], 3], 'bar', 'baz'];
		const output = klona(input);

		assert.deepEqual(input, output);

		output[1][2][0] = 'howdy';
		assert.equal(input[1][2][0], 'hello');

		output[1] = 'hello';
		assert.notEqual(input[1], 'hello');
	});

	Arrays('sparse', () => {
		const input = Array(5);
		input[1] = undefined;
		input[3] = { value: 'hello' };
		const output = klona(input);

		assert.deepEqual(input, output);
		assert.equal(output.length, 5);
		assert.deepEqual(Object.keys(output), ['1', '3']);
		assert.equal(0 in output, false);
		assert.equal(1 in output, true);
		assert.equal(4 in output, false);

		let visits = 0;
		output.forEach(() => visits++);
		assert.equal(visits, 2);

		output[3].value = 'world';
		assert.equal(input[3].value, 'hello');
	});

	Arrays.run();
}
