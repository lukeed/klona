import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Dictionarys = suite('Dictionary');

	Dictionarys('dictionary :: empty', () => {
		const input = Object.create(null);

		let output = klona(input);
		assert.deepEqual(input, output);
		assert.equal(output.constructor, undefined);

		output.foo = 123;
		assert.equal(input.foo, undefined);
	});

	Dictionarys('dictionary :: values', () => {
		const input = Object.create(null);
		input.hello = 'world';
		input.list = [1, 2, 3];

		let output = klona(input);
		assert.deepEqual(input, output);
		assert.equal(output.constructor, undefined);

		output.list.push('howdy');
		assert.deepEqual(input.list, [1, 2, 3]);
	});

	Dictionarys.run();
}
