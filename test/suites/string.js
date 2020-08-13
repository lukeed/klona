import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Strings = suite('String');

	Strings('string', () => {
		let input = 'hello';
		let output = klona(input);

		assert.equal(input, output);

		output += ' world';
		assert.equal(input, 'hello');

		input += '123';
		assert.equal(output, 'hello world');
	});

	Strings.run();
}
