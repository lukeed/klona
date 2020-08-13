import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Functions = suite('Function');

	Functions('function', () => {
		let input = () => {};
		let output = klona(input);
		let original = input.toString();

		assert.deepEqual(input, output);

		input = () => 123;
		assert.equal(output.toString(), original);

		output = () => 456;
		assert.equal(input.toString(), '() => 123');
	});

	Functions.run();
}
