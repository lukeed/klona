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

	Arrays.run();
}
