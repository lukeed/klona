import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const RegExps = suite('RegExp');

	RegExps('basic', () => {
		const input = /foo/gi;
		const output = klona(input);

		assert.deepEqual(input, output);

		output.exec('foofoofoo');
		assert.equal(output.lastIndex, 3);
		assert.equal(input.lastIndex, 0);
	});

	RegExps('state', () => {
		const input = /foo/gi;
		input.exec('foofoofoo');
		const index = input.lastIndex;

		const output = klona(input);

		assert.deepEqual(input, output);

		assert.equal(index, 3);
		assert.equal(input.lastIndex, index);
		assert.equal(output.lastIndex, index);
	});

	RegExps.run();
}
