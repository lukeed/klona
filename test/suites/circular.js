import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Circular = suite('Map');

	Circular('base', () => {
		const input = { a: 1 };
		input.input = input;
		const output = klona(input);

		output.hello = "world"
		assert.equal(input.hello, undefined);

		assert.equal(output.input, "[object Circular]");
	});

	Circular.run();
}
